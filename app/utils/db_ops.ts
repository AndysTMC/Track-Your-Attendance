
import { connectDB, isConnectionOpen } from '@/app/configs/db';
import { UserModel, HolidayModel, SpecialWorkingDayModel, SystemStateModel } from '@/app/configs/models';
import { Holiday, SpecialWorkingDay, UserData, AdminData } from './hybrid';
import { generateAdminKey, OtherData, SSMap, User } from './backend';
import { get } from 'http';


const addIfNoSystemState = async () => {
    await connectDB();
    const doc = await SystemStateModel.findOne();
    if (!doc) {
        const systemState = new SystemStateModel({});
        await systemState.save();
    }
}

addIfNoSystemState();

class OPS {
    
    static async addOrUpdateUser(regNo: string, user: User): Promise<void> {
        await connectDB();
        const cuser = await UserModel.updateOne(
            { 'userCredentials.regNo': regNo },
            { $set: user },
            { upsert: true },
        );
    }

    static async hasUser(regNo: string): Promise<boolean> {
        await connectDB();
        const user = await UserModel.findOne({ 'userCredentials.regNo': regNo });
        if (user) {
            return true;
        }
        return false;
    }

    static async getUser(regNo: string): Promise<User | null> {
        await connectDB();
        return await UserModel.findOne({ 'userCredentials.regNo': regNo });
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
        await UserModel.deleteOne({ 'userCredentials.regNo': regNo });
    }

    static async getUserEncryptedPassword(regNo: string): Promise<string> {
        await connectDB();
        const user = await UserModel.findOne({ 'userCredentials.regNo': regNo });
        if (!user) { throw new Error('User not found'); }
        return user.userCredentials.encryptedPassword || '';
    }

    static async updateUserEncryptedPassword(regNo: string, encryptedPassword: string): Promise<void> {
        await connectDB();
        await UserModel.updateOne(
            { 'userCredentials.regNo': regNo },
            {
                $set: {
                    'userCredentials.encryptedPassword': encryptedPassword,
                    'userData.scrapingInfo.lastScraped': new Date().toISOString(),
                },
            },
        );
    }

    static async isRefetchPossible(regNo: string): Promise<boolean> {
        await connectDB();
        const user = await this.getUser(regNo);
        const maxRefetchCount = Number(process.env.MAX_REFETCH_COUNT) || 5;
        if (user && user.userData.scrapingInfo.refetchCount < maxRefetchCount) {
            return true;
        }
        return false;
    }

    static async hasCoolDown(regNo: string): Promise<boolean> {
        await connectDB();
        const user = await this.getUser(regNo);
        if (user) {
            const lastScraped = new Date(user.userData.scrapingInfo.lastScraped);
            const currentTime = new Date();
            const diff = currentTime.getTime() - lastScraped.getTime();
            if (diff < 6 * 60 * 60 * 1000) {
                return true;
            }
        }
        return false;
    }

    static async updateUserScrapeProgress(regNo: string, scrapeInProgress: boolean): Promise<void> {
        await connectDB();
        await UserModel.updateOne(
            { 'userCredentials.regNo': regNo },
            { $set: { scrapeInProgress } },
        );
    }

    static async getScrapeInProgress(regNo: string): Promise<boolean> {
        await connectDB();
        const user = await this.getUser(regNo);
        if (user) {
            return user.scrapeInProgress;
        }
        return false;
    }

    static async getHolidays(): Promise<Holiday[]> {
        await connectDB();
        return await HolidayModel.find();
    }

    static async addHoliday(date: string, name: string): Promise<void> {
        await connectDB();
        const holiday = new HolidayModel({ date, name });
        await holiday.save();
    }

    static async hasHoliday(date: string): Promise<boolean> {
        await connectDB();
        return !!await HolidayModel
            .findOne({ date });
    }

    static async removeHoliday(date: string): Promise<void> {
        await connectDB();
        await HolidayModel.deleteOne({ date });
    }

    static async getSpecialWorkingDays(): Promise<SpecialWorkingDay[]> {
        await connectDB();
        return await SpecialWorkingDayModel.find();
    }

    static async addSpecialWorkingDay(date: string, replacementDay: number): Promise<void> {
        await connectDB();
        const specialWorkingDay = new SpecialWorkingDayModel({ date, replacementDay });
        await specialWorkingDay.save();
    }

    static async hasSpecialWorkingDay(date: string): Promise<boolean> {
        await connectDB();
        return !!await SpecialWorkingDayModel
            .findOne({ date });
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
        return doc.semEndDate
    }

    static async hasErrorAtBackend(): Promise<boolean> {
        await connectDB();
        const doc = await SystemStateModel.findOne({});
        return doc.errorAtBackend;
    }

    static async setErrorAtBackend(hasError: boolean): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { errorAtBackend: hasError } });
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

    static async addFailedAuth(regNo: string, eData: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { [`failedAuths.${regNo}`]: eData } });
    }

    static async hasFailedAuth(regNo: string): Promise<boolean> {
        await connectDB();
        const doc = await SystemStateModel.findOne({});
        return doc.failedAuths.has(regNo);
    }

    static async removeFailedAuth(regNo: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $unset: { [`failedAuths.${regNo}`]: '' } });
    }

    static async addInvalidAuth(regNo: string, password: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { [`invalidAuths.${regNo}`]: password } });
    }

    static async hasInvalidAuth(regNo: string, password: string): Promise<boolean> {
        await connectDB();
        const doc = await SystemStateModel.findOne({});
        return doc.invalidAuths.has(regNo) && doc.invalidAuths.get(regNo) !== password;
    }

    static async removeInvalidAuth(regNo: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $unset: { [`invalidAuths.${regNo}`]: '' } });
    }

    static async addPortalError(regNo: string, eData: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { [`portalErrors.${regNo}`]: eData } });
    }

    static async removePortalError(regNo: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $unset: { [`portalErrors.${regNo}`]: '' } });
    }

    static async hasPortalError(regNo: string): Promise<boolean> {
        await connectDB();
        const doc = await SystemStateModel.findOne({});
        return doc.portalErrors.has(regNo);
    }

    static async addFailedScrape(regNo: string, eData: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { [`failedScrapes.${regNo}`]: eData } });
    }

    static async removeFailedScrape(regNo: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $unset: { [`failedScrapes.${regNo}`]: '' } });
    }

    static async hasFailedScrape(regNo: string): Promise<boolean> {
        await connectDB();
        const doc = await SystemStateModel.findOne({});
        return doc.failedScrapes.has(regNo);
    }

    static async getFailedAuths():  Promise<Array<String>> {
        await connectDB();
        return (await SystemStateModel.findOne({})).failedAuths;
    }

    static async getFailedScrapes():  Promise<Array<String>> {
        await connectDB();
        return (await SystemStateModel.findOne({})).failedScrapes;
    }

    static async getPortalErrors(): Promise<Array<String>> {
        await connectDB();
        return (await SystemStateModel.findOne({})).portalErrors;
    }
    
    static async setAdminKey(key: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { adminKey: key } });
    }

    static async getAdminKey(): Promise<string> {
        await connectDB();
        const doc = await SystemStateModel.findOne({})
        return doc.adminKey;
    }

    static async getAdminData(): Promise<AdminData> {
        await connectDB();
        const holidays = await HolidayModel.find().sort({ date: 1 });
        const specialWorkingDays = await SpecialWorkingDayModel.find().sort({ date: 1 });
        const systemState = await SystemStateModel.findOne();
        const semStartDate = systemState.semStartDate;
        const semEndDate = systemState.semEndDate;
        const errorAtBackend = systemState.errorAtBackend;
        const inMaintenance = systemState.inMaintenance;
        return { holidays, specialWorkingDays, semStartDate, semEndDate, errorAtBackend, inMaintenance };
    }

    static async setProperties({ semStartDate, semEndDate, inMaintenance }: { semStartDate: string, semEndDate: string, inMaintenance: boolean}): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $set: { semStartDate, semEndDate, inMaintenance } });
    }

    static async clearAllErrors(regNo: string): Promise<void> {
        await connectDB();
        await SystemStateModel.updateOne({}, { $unset: { [`failedAuths.${regNo}`]: '', [`invalidAuths.${regNo}`]: '', [`portalErrors.${regNo}`]: '', [`failedScrapes.${regNo}`]: '' } });
    }
    
}

export default OPS;