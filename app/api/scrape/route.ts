import { getPortal, scrape } from "@/app/utils/portal";
import {
	Credentials,
	INVALID_AUTH_C,
	NEITHER_PASSWORD_NOR_DKEY_PROVIDED_C,
	PLEASE_TRY_AGAIN_C,
	REFETCH_LIMIT_REACHED_C,
	REGNO_NOT_PROVIDED_C,
	Portal,
	SystemData,
	User,
	SERVER_IN_MAINTENANCE_C,
	ScrapeData,
	CANT_FETCH_C,
} from "@/app/utils/backend";
import { ScrapingInfo, UserData } from "@/app/utils/hybrid";
import OPS from "@/app/utils/db_ops";
import { encrypt, decrypt } from "@/app/utils/backend";

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

// export async function POST(request: Request): Promise<void | Response> {
// 	let {
// 		regNo,
// 		password,
// 		dKey,
// 		refetch,
// 	}: { regNo: string; password: string; dKey: string; refetch: boolean } =
// 		await request.json();
// 	const systemData = await OPS.getSystemData();
// 	if (systemData.inMaintenance) {
// 		return new Response(JSON.stringify({ error: SERVER_IN_MAINTENANCE_C }), {
// 			status: 503,
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});
// 	}
// 	if (!regNo) {
// 		return new Response(JSON.stringify({ error: REGNO_NOT_PROVIDED_C }), {
// 			status: 400,
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});
// 	}
// 	if (password === null && dKey === null) {
// 		return new Response(
// 			JSON.stringify({ error: NEITHER_PASSWORD_NOR_DKEY_PROVIDED_C }),
// 			{
// 				status: 400,
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);
// 	}
// 	if (await hasUserInQueue(regNo)) {
// 		return new Response(
// 			JSON.stringify({
// 				inQueue: await inFrontOfUser(regNo),
// 				inProgress: true,
// 			}),
// 			{
// 				status: 200,
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);
// 	}
// 	if (isScrapeInProgress(regNo, systemData)) {
// 		return new Response(
// 			JSON.stringify({
// 				inQueue: 0,
// 				inProgress: true,
// 			}),
// 			{
// 				status: 200,
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);
// 	}
// 	const user = await OPS.getUser(regNo);
// 	const [_dKey, _password, _encryptedPassword] = getDKeyAndDEPs(
// 		dKey,
// 		password,
// 		user?.userCredentials.encryptedPassword
// 	);
// 	if (user != null) {
// 		if (refetch) {
// 			if (!isRefetchPossible(user.userData.scrapingInfo)) {
// 				return new Response(
// 					JSON.stringify({ error: REFETCH_LIMIT_REACHED_C }),
// 					{
// 						status: 400,
// 						headers: {
// 							"Content-Type": "application/json",
// 						},
// 					}
// 				);
// 			}
// 		}
// 		let portal = await authenticateUser(regNo, _password);
// 		if (portal == null) {
// 			return new Response(JSON.stringify({ error: INVALID_AUTH_C }), {
// 				status: 401,
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			});
// 		}
// 		if (!refetch && inCoolDownPeriod(user.userData.scrapingInfo)) {
// 			await OPS.updateUserEncryptedPassword(regNo, _encryptedPassword);
// 			const holidays = await OPS.getHolidays();
// 			const specialWorkingDays = await OPS.getSpecialWorkingDays();
// 			return new Response(
// 				JSON.stringify({
// 					userData: user.userData,
// 					holidays,
// 					specialWorkingDays,
// 					dKey: _dKey,
// 					regNo: regNo,
// 				}),
// 				{
// 					status: 200,
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 				}
// 			);
// 		}
// 		await OPS.updateUserScrapeProgress(regNo, true);
// 		user.userCredentials.encryptedPassword = _encryptedPassword;
// 		await enqueueHelper(
// 			regNo,
// 			_encryptedPassword,
// 			refetch,
// 			portal,
// 			user,
// 			systemData
// 		);
// 		return new Response(JSON.stringify({ dKey: _dKey, regNo: regNo }), {
// 			status: 200,
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});
// 	} else {
// 		if (password) {
// 			let portal = await authenticateUser(regNo, password);
// 			if (portal == null) {
// 				return new Response(JSON.stringify({ error: INVALID_AUTH_C }), {
// 					status: 401,
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 				});
// 			}
// 			await OPS.updateUserScrapeProgress(regNo, true);
// 			await enqueueHelper(
// 				regNo,
// 				_encryptedPassword,
// 				refetch,
// 				portal,
// 				null,
// 				systemData
// 			);
// 			return new Response(JSON.stringify({ regNo: regNo, dKey: _dKey }), {
// 				status: 200,
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			});
// 		}
// 		return new Response(JSON.stringify({ error: PLEASE_TRY_AGAIN_C }), {
// 			status: 500,
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});
// 	}
// }

// credentials, refetch, portal, user, systemData

export const processScrape = async (
	credentials: Credentials,
	refetch: boolean,
	portal: Portal,
	user: User | null,
	systemData: SystemData
) => {
	try {
		let data: ScrapeData | null = null;
		let scrapeRetryCount = 0;
		let maxScrapeRetry = Number(process.env.MAX_SCRAPE_RETRY ?? 1);
		while (!data && scrapeRetryCount < maxScrapeRetry) {
			try {
				data = await scrape(portal, systemData);
			} catch (err: any) {
				scrapeRetryCount++;
			}
		}
		if (!data) {
			throw new Error(CANT_FETCH_C);
		}
		if (user) {
			const scrapingInfo = user.userData.scrapingInfo;
			const previoslyScraped = new Date(scrapingInfo.lastScraped);
			scrapingInfo.lastScraped = new Date().toISOString();
			if (refetch) scrapingInfo.refetchCount++;
			if (previoslyScraped.getDate() !== new Date().getDate())
				scrapingInfo.refetchCount = 0;
			user.userData = { ...data, scrapingInfo };
			await OPS.addOrUpdateUser(credentials.regNo, user);
		} else {
			const scrapingInfo = {
				lastScraped: new Date().toISOString(),
				refetchCount: 0,
			};
			const userData: UserData = { ...data, scrapingInfo };
			const user: User = {
				userData,
				userCredentials: credentials,
			};
			await OPS.addOrUpdateUser(credentials.regNo, user);
		}
	} catch (err: any) {
		console.error(err);
	}
};

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
		return new Response(
			JSON.stringify({ error: SERVER_IN_MAINTENANCE_C }),
			{
				status: 503,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
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
			const holidays = await OPS.getHolidays();
			const specialWorkingDays = await OPS.getSpecialWorkingDays();
			await OPS.updateUserEncryptedPassword(regNo, _encryptedPassword);
			return new Response(
				JSON.stringify({
					userData: user.userData,
					holidays,
					specialWorkingDays,
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
		let credentials = { regNo, encryptedPassword: _encryptedPassword };
		await processScrape(credentials, refetch, portal, user, systemData);
	} else {
		if (!password) {
			return new Response(JSON.stringify({ error: PLEASE_TRY_AGAIN_C }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		let portal = await authenticateUser(regNo, password);
		if (portal == null) {
			return new Response(JSON.stringify({ error: INVALID_AUTH_C }), {
				status: 401,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		let credentials: Credentials = {
			regNo,
			encryptedPassword: _encryptedPassword,
		};
		await processScrape(credentials, false, portal, null, systemData);
	}
	const userNew = await OPS.getUser(regNo);
	if (!userNew) {
		return new Response(JSON.stringify({ error: PLEASE_TRY_AGAIN_C }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
	const holidays = await OPS.getHolidays();
	const specialWorkingDays = await OPS.getSpecialWorkingDays();
	return new Response(
		JSON.stringify({
			userData: userNew.userData,
			holidays,
			specialWorkingDays,
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
