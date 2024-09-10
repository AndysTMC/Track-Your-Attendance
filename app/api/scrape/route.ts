import { getPortal, scrape } from "@/app/utils/portal";
import {
	CANT_FETCH_C,
	Credentials,
	IN_MAINTENANCE_C,
	INVALID_AUTH_C,
	NEITHER_PASSWORD_NOR_DKEY_PROVIDED_C,
	PLEASE_TRY_AGAIN_C,
	Portal,
	QueueItem,
	REFETCH_LIMIT_REACHED_C,
	REGNO_NOT_PROVIDED_C,
	ScrapeData,
	SystemData,
	User,
} from "@/app/utils/backend";
import { ScrapingInfo } from "@/app/utils/hybrid";
import OPS from "@/app/utils/db_ops";
import { encrypt, decrypt } from "@/app/utils/backend";
import { scrapeQueue } from "@/workers/scrape.worker";

async function enqueueHelper(
	regNo: string,
	encryptedPassword: string,
	refetch: boolean,
	portal: Portal,
	user: User | null,
	systemData: SystemData
) {
	let credentials: Credentials = { regNo, encryptedPassword };
	let item: QueueItem = { credentials, refetch, portal, user, systemData };
	await scrapeQueue.add("scrapeItem", item);
}

// async function executeScrape(item: QueueItem) {
// 	const regNo = item.credentials.regNo;
// 	try {
// 		let data: ScrapeData | null = null;
// 		let scrapeRetryCount = 0;
// 		let maxScrapeRetry = Number(process.env.MAX_SCRAPE_RETRY ?? 1);
// 		while (!data && scrapeRetryCount < maxScrapeRetry) {
// 			try {
// 				data = await scrape(item.portal, item.systemData);
// 			} catch (err: any) {
// 				scrapeRetryCount++;
// 			}
// 		}
// 		if (!data) {
// 			throw new Error(CANT_FETCH_C);
// 		}
// 		if (item.user) {
// 			const user = item.user;
// 			const scrapingInfo = user.userData.scrapingInfo;
// 			const previoslyScraped = new Date(scrapingInfo.lastScraped);
// 			scrapingInfo.lastScraped = new Date().toISOString();
// 			if (item.refetch) scrapingInfo.refetchCount++;
// 			if (previoslyScraped.getDate() !== new Date().getDate())
// 				scrapingInfo.refetchCount = 0;
// 			user.userData = { ...data, scrapingInfo };
// 			await OPS.addOrUpdateUser(item.credentials.regNo, user);
// 		} else {
// 			const scrapingInfo = {
// 				lastScraped: new Date().toISOString(),
// 				refetchCount: 0,
// 			};
// 			const userData: UserData = { ...data, scrapingInfo };
// 			const user: User = {
// 				userData,
// 				userCredentials: item.credentials,
// 			};
// 			await OPS.addOrUpdateUser(item.credentials.regNo, user);
// 		}
// 	} catch (err: any) {
// 		console.error(err);
// 	} finally {
// 		await OPS.updateUserScrapeProgress(regNo, false);
// 	}
// }

const isRefetchPossible = (scrapingInfo: ScrapingInfo) => {
	const maxRefetchCount = Number(process.env.MAX_REFETCH_LIMIT || 5);
	if (scrapingInfo.refetchCount < maxRefetchCount) {
		return true;
	}
	return false;
};

const authenticateUser = async (regNo: string, password: string) => {
	let portal: Portal | null = null;
	let errorType;
	while (errorType !== INVALID_AUTH_C && !portal) {
		try {
			portal = await getPortal(regNo, password);
		} catch (err: any) {
			errorType = err.message.split(":::")[0];
			if (errorType === INVALID_AUTH_C) {
				return null;
			}
		}
	}
	return portal;
};

const getDKeyAndDEPs = (
	dKey: string | null,
	password: string | null,
	encryptedPassword: string | undefined
) => {
	if (dKey && encryptedPassword) {
		return [dKey, decrypt(encryptedPassword, dKey), encryptedPassword];
	} else if (password) {
		let [_encryptedPassword, _dKey] = encrypt(password);
		return [_dKey, password, _encryptedPassword];
	} else {
		return ["", "", ""];
	}
};

const inCoolDownPeriod = (scrapingInfo: ScrapingInfo) => {
	const lastScraped = new Date(scrapingInfo.lastScraped);
	const now = new Date();
	const diff = now.getTime() - lastScraped.getTime();
	const coolDown = Number(process.env.COOLDOWN_TIME ?? 8 * 60 * 60 * 1000);
	if (lastScraped.getDate() == now.getDate() && diff < coolDown) return true;
	return false;
};

const isScrapeInProgress = (regNo: string, systemData: SystemData): boolean => {
	if (systemData.scrapesInProgress.includes(regNo)) {
		return true;
	}
	return false;
};

const inFrontOfUser = async (regNo: string): Promise<number> => {
	const jobs = await scrapeQueue.getJobs(["waiting"]);
	if (jobs.length === 0) {
		return 0;
	}
	return jobs.findIndex((job) => job.data.credentials.regNo === regNo) + 1;
}

const hasUserInQueue = async (regNo: string): Promise<boolean> => {
	const jobs = await scrapeQueue.getJobs(["waiting"]);
	for (let job of jobs) {
		if (job.data.credentials.regNo === regNo) {
			return true;
		}
	}
	return false;
}

export async function POST(request: Request): Promise<void | Response> {
	let {
		regNo,
		password,
		dKey,
		refetch,
	}: { regNo: string; password: string; dKey: string; refetch: boolean } =
		await request.json();
	const systemData = await OPS.getSystemData();
	if (systemData.inMaintenance) {
		return new Response(JSON.stringify({ error: IN_MAINTENANCE_C }), {
			status: 503,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
	if (!regNo) {
		return new Response(JSON.stringify({ error: REGNO_NOT_PROVIDED_C }), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
	if (password === null && dKey === null) {
		return new Response(
			JSON.stringify({ error: NEITHER_PASSWORD_NOR_DKEY_PROVIDED_C }),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
	if (await hasUserInQueue(regNo)) {
		return new Response(
			JSON.stringify({
				inQueue: await inFrontOfUser(regNo),
				inProgress: true,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
	if (isScrapeInProgress(regNo, systemData)) {
		return new Response(
			JSON.stringify({
				inQueue: 0,
				inProgress: true,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
	const user = await OPS.getUser(regNo);
	const [_dKey, _password, _encryptedPassword] = getDKeyAndDEPs(
		dKey,
		password,
		user?.userCredentials.encryptedPassword
	);
	if (user != null) {
		if (refetch) {
			if (!isRefetchPossible(user.userData.scrapingInfo)) {
				return new Response(
					JSON.stringify({ error: REFETCH_LIMIT_REACHED_C }),
					{
						status: 400,
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
			}
		}
		let portal = await authenticateUser(regNo, _password);
		if (portal == null) {
			return new Response(JSON.stringify({ error: INVALID_AUTH_C }), {
				status: 401,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		if (!refetch && inCoolDownPeriod(user.userData.scrapingInfo)) {
			await OPS.updateUserEncryptedPassword(regNo, _encryptedPassword);
			return new Response(
				JSON.stringify({
					userData: user.userData,
					dKey: _dKey,
					regNo: regNo,
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}
		await OPS.updateUserScrapeProgress(regNo, true);
		user.userCredentials.encryptedPassword = _encryptedPassword;
		await enqueueHelper(
			regNo,
			_encryptedPassword,
			refetch,
			portal,
			user,
			systemData
		);
		return new Response(JSON.stringify({ dKey: _dKey, regNo: regNo }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} else {
		if (password) {
			let portal = await authenticateUser(regNo, password);
			if (portal == null) {
				return new Response(JSON.stringify({ error: INVALID_AUTH_C }), {
					status: 401,
					headers: {
						"Content-Type": "application/json",
					},
				});
			}
			await OPS.updateUserScrapeProgress(regNo, true);
			await enqueueHelper(
				regNo,
				_encryptedPassword,
				refetch,
				portal,
				null,
				systemData
			);
			return new Response(JSON.stringify({ regNo: regNo, dKey: _dKey }), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		return new Response(JSON.stringify({ error: PLEASE_TRY_AGAIN_C }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
