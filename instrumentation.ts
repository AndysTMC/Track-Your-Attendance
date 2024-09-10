
export const register = async () => {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { Worker } = await import("bullmq");
        const { processScrape } = await import("./workers/scrape.worker");
        const scrapeWorker = new Worker("scrapeQueue", processScrape, { 
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD,
            }
        });
        scrapeWorker.on("completed", (job) => {
            console.log(`Scrape successful for ${job.data.credentials.regNo}`);
        });
        scrapeWorker.on("failed", (job, err) => {
            if (job) {
                console.log(`Scrape failure for ${job.data.credentials.regNo}`);
            }
        });
    }
}