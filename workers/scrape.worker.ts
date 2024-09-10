import { CANT_FETCH_C, QueueItem, ScrapeData, User } from "@/app/utils/backend";
import OPS from "@/app/utils/db_ops";
import { UserData } from "@/app/utils/hybrid";
import { scrape } from "@/app/utils/portal";

import { Queue } from "bullmq";

export const scrapeQueue = new Queue("scrapeQueue", {
	connection: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
		username: process.env.REDIS_USERNAME,
		password: process.env.REDIS_PASSWORD,
	},
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
	streams: {
        events: {
            maxLen: 500,
        }
    }
});

export const processScrape = async (job: any) => {
	const item: QueueItem = job.data;
	const regNo = item.credentials.regNo;
	try {
		let data: ScrapeData | null = null;
		let scrapeRetryCount = 0;
		let maxScrapeRetry = Number(process.env.MAX_SCRAPE_RETRY ?? 1);
		while (!data && scrapeRetryCount < maxScrapeRetry) {
			try {
				data = await scrape(item.portal, item.systemData);
			} catch (err: any) {
				scrapeRetryCount++;
			}
		}
		if (!data) {
			throw new Error(CANT_FETCH_C);
		}
		if (item.user) {
			const user = item.user;
			const scrapingInfo = user.userData.scrapingInfo;
			const previoslyScraped = new Date(scrapingInfo.lastScraped);
			scrapingInfo.lastScraped = new Date().toISOString();
			if (item.refetch) scrapingInfo.refetchCount++;
			if (previoslyScraped.getDate() !== new Date().getDate())
				scrapingInfo.refetchCount = 0;
			user.userData = { ...data, scrapingInfo };
			await OPS.addOrUpdateUser(item.credentials.regNo, user);
		} else {
			const scrapingInfo = {
				lastScraped: new Date().toISOString(),
				refetchCount: 0,
			};
			const userData: UserData = { ...data, scrapingInfo };
			const user: User = {
				userData,
				userCredentials: item.credentials,
			};
			await OPS.addOrUpdateUser(item.credentials.regNo, user);
		}
	} catch (err: any) {
		console.error(err);
	} finally {
		await OPS.updateUserScrapeProgress(regNo, false);
	}
};
