import crypto from "crypto";

export const generateChecksum = (text: string): string => {
	const hash = crypto.createHash("sha256");
	hash.update(text);
	return hash.digest("hex");
};

export const getRandom32ByteString = (): string => {
	return crypto.randomBytes(32).toString("hex");
};

export const getRandom16ByteString = (): string => {
	return crypto.randomBytes(16).toString("hex");
};

export type Time = {
	hours: number;
	minutes: number;
};

export type Timing = {
	startTime: Time;
	endTime: Time;
};

export type Session = {
	timing: Timing;
	courseCode: string;
};

export type Timetable = {
	monday: Session[];
	tuesday: Session[];
	wednesday: Session[];
	thursday: Session[];
	friday: Session[];
	saturday: Session[];
	sunday: Session[];
};

export type Attendance = {
	courseCode: string;
	present: number;
	absent: number;
	totalScheduled: number;
	total: number;
	notEntered: number;
	presentPercent: number;
	odml: number;
	odmlPercent: number;
};

export type Course = {
	code: string;
	name: string;
	ltpc: string;
	faculty: string;
	classRoom: string;
};

export type Profile = {
	name: string;
	year: string;
	semester: number;
	program: string;
	section: string;
	dob: string;
	gender: string;
};

export type ScrapingInfo = {
	lastScraped: string;
	refetchCount: number;
};

export type UserData = {
	profile: Profile;
	timetable: Timetable;
	attendances: Attendance[];
	courses: Course[];
	scrapingInfo: ScrapingInfo;
};

export type Holiday = {
	date: string;
	name: string;
};

export type SpecialWorkingDay = {
	date: string;
	replacementDay: number;
};

export type AdminData = {
	holidays: Holiday[];
	specialWorkingDays: SpecialWorkingDay[];
	errorAtBackend: boolean;
	inMaintenance: boolean;
	semStartDate: string;
	semEndDate: string;
};
