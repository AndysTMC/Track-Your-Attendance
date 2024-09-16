import { connectDB } from "@/app/configs/db";
import {
	UserModel,
	HolidayModel,
	SpecialWorkingDayModel,
	SystemStateModel,
} from "@/app/configs/models";
import { Holiday, SpecialWorkingDay, UserData, AdminData } from "./hybrid";
import { SystemData, User } from "./backend";

const addIfNoSystemState = async () => {
	await connectDB();
	const doc = await SystemStateModel.findOne();
	if (!doc) {
		const systemState = new SystemStateModel({});
		await systemState.save();
	}
};

addIfNoSystemState();

class OPS {
	static async addOrUpdateUser(regNo: string, user: User): Promise<void> {
		await connectDB();
		const cuser = await UserModel.updateOne(
			{ "userCredentials.regNo": regNo },
			{ $set: user },
			{ upsert: true }
		);
	}

	static async hasUser(regNo: string): Promise<boolean> {
		await connectDB();
		const user = await UserModel.findOne({
			"userCredentials.regNo": regNo,
		});
		if (user) {
			return true;
		}
		return false;
	}

	static async getUser(regNo: string): Promise<User | null> {
		await connectDB();
		return await UserModel.findOne({ "userCredentials.regNo": regNo });
	}

	static async getUserData(regNo: string): Promise<UserData | null> {
		await connectDB();
		const user = await this.getUser(regNo);
		if (user) {
			return user.userData;
		}
		return null;
	}

	static async removeUser(regNo: string): Promise<void> {
		await connectDB();
		await UserModel.deleteOne({ "userCredentials.regNo": regNo });
	}

	static async updateUserEncryptedPassword(
		regNo: string,
		encryptedPassword: string
	): Promise<void> {
		await connectDB();
		await UserModel.updateOne(
			{ "userCredentials.regNo": regNo },
			{ $set: { "userCredentials.encryptedPassword": encryptedPassword } }
		);
	}

	static async updateUserScrapeProgress(
		regNo: string,
		scrapeInProgress: boolean
	): Promise<void> {
		await connectDB();
		if (scrapeInProgress) {
			const scrapeEntry = { regNo, addedTime: new Date() };
			await SystemStateModel.updateOne(
				{},
				{ $push: { scrapesInProgress: scrapeEntry } }
			);
		} else {
			await SystemStateModel.updateOne(
				{},
				{ $pull: { scrapesInProgress: { regNo: regNo } } }
			);
		}
	}

	static async removeExpiredScrapes(): Promise<void> {
		await connectDB();
		const systemState = await SystemStateModel.findOne();
		const scrapesInProgress = systemState.scrapesInProgress;
		const now = new Date();
		const expiredScrapes = scrapesInProgress.filter(
			(scrape: any) =>
				now.getTime() - new Date(scrape.addedTime).getTime() > 300000
		);
		for (const scrape of expiredScrapes) {
			await this.updateUserScrapeProgress(scrape.regNo, false);
		}
	}

	static async getSystemData(): Promise<SystemData> {
		await connectDB();
		const systemState = await SystemStateModel.findOne();
		return {
			inMaintenance: systemState.inMaintenance,
			semStartDate: systemState.semStartDate,
			semEndDate: systemState.semEndDate,
			adminKey: systemState.adminKey,
			scrapesInProgress: systemState.scrapesInProgress,
		};
	}

	static async getHolidays(): Promise<Holiday[]> {
		await connectDB();
		return await HolidayModel.find({}, { _id: 0 });
	}

	static async addHoliday(date: string, name: string): Promise<void> {
		await connectDB();
		const holiday = new HolidayModel({ date, name });
		await holiday.save();
	}

	static async hasHoliday(date: string): Promise<boolean> {
		await connectDB();
		return !!(await HolidayModel.findOne({ date }));
	}

	static async removeHoliday(date: string): Promise<void> {
		await connectDB();
		await HolidayModel.deleteOne({ date });
	}

	static async getSpecialWorkingDays(): Promise<SpecialWorkingDay[]> {
		await connectDB();
		return await SpecialWorkingDayModel.find({}, { _id: 0 });
	}

	static async addSpecialWorkingDay(
		date: string,
		replacementDay: number
	): Promise<void> {
		await connectDB();
		const specialWorkingDay = new SpecialWorkingDayModel({
			date,
			replacementDay,
		});
		await specialWorkingDay.save();
	}

	static async hasSpecialWorkingDay(date: string): Promise<boolean> {
		await connectDB();
		return !!(await SpecialWorkingDayModel.findOne({ date }));
	}

	static async removeSpecialWorkingDay(date: string): Promise<void> {
		await connectDB();
		await SpecialWorkingDayModel.deleteOne({ date });
	}

	static async setSemStartDate(date: string): Promise<void> {
		await connectDB();
		await SystemStateModel.updateOne({}, { $set: { semStartDate: date } });
	}

	static async getSemStartDate(): Promise<string> {
		await connectDB();
		const doc = await SystemStateModel.findOne({});
		return doc.semStartDate;
	}

	static async setSemEndDate(date: string): Promise<void> {
		await connectDB();
		await SystemStateModel.updateOne({}, { $set: { semEndDate: date } });
	}

	static async getSemEndDate(): Promise<string> {
		await connectDB();
		const doc = await SystemStateModel.findOne({});
		return doc.semEndDate;
	}

	static async setInMaintenance(inMaintenance: boolean): Promise<void> {
		await connectDB();
		await SystemStateModel.updateOne({}, { $set: { inMaintenance } });
	}

	static async isInMaintenance(): Promise<boolean> {
		await connectDB();
		const doc = await SystemStateModel.findOne({});
		return doc.inMaintenance;
	}

	static async setAdminKey(key: string): Promise<void> {
		await connectDB();
		await SystemStateModel.updateOne({}, { $set: { adminKey: key } });
	}

	static async getAdminKey(): Promise<string> {
		await connectDB();
		const doc = await SystemStateModel.findOne({});
		return doc.adminKey;
	}

	static async getAdminData(): Promise<AdminData> {
		await connectDB();
		const holidays = await HolidayModel.find().sort({ date: 1 });
		const specialWorkingDays = await SpecialWorkingDayModel.find().sort({
			date: 1,
		});
		const systemState = await SystemStateModel.findOne();
		const semStartDate = systemState.semStartDate;
		const semEndDate = systemState.semEndDate;
		const errorAtBackend = systemState.errorAtBackend;
		const inMaintenance = systemState.inMaintenance;
		return {
			holidays,
			specialWorkingDays,
			semStartDate,
			semEndDate,
			errorAtBackend,
			inMaintenance,
		};
	}

	static async setProperties({
		semStartDate,
		semEndDate,
		inMaintenance,
	}: {
		semStartDate: string;
		semEndDate: string;
		inMaintenance: boolean;
	}): Promise<void> {
		await connectDB();
		await SystemStateModel.updateOne(
			{},
			{ $set: { semStartDate, semEndDate, inMaintenance } }
		);
	}
}

export default OPS;
