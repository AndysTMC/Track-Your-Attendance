import mongoose, { Schema, Document, Model } from "mongoose";

const ProfileSchema = new Schema({
	name: { type: String, required: true },
	year: { type: String, required: true },
	semester: { type: Number, required: true },
	program: { type: String, required: true },
	section: { type: String, required: true },
	dob: { type: String, required: true },
	gender: { type: String, required: true },
});

const TimeSchema = new Schema({
	hours: { type: Number, required: true },
	minutes: { type: Number, required: true },
});

const TimingSchema = new Schema({
	startTime: { type: TimeSchema, required: true },
	endTime: { type: TimeSchema, required: true },
});

const SessionSchema = new Schema({
	timing: { type: TimingSchema, required: true },
	courseCode: { type: String, required: true },
});

const TimetableSchema = new Schema({
	monday: { type: [SessionSchema], required: true },
	tuesday: { type: [SessionSchema], required: true },
	wednesday: { type: [SessionSchema], required: true },
	thursday: { type: [SessionSchema], required: true },
	friday: { type: [SessionSchema], required: true },
	saturday: { type: [SessionSchema], required: true },
	sunday: { type: [SessionSchema], required: true },
});

const AttendanceSchema = new Schema({
	courseCode: { type: String, required: true },
	present: { type: Number, required: true },
	absent: { type: Number, required: true },
	totalScheduled: { type: Number, required: true },
	total: { type: Number, required: true },
	notEntered: { type: Number, required: true },
	odml: { type: Number, required: true },
});

const CourseSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },
	ltpc: { type: String, required: true },
	faculty: { type: String, required: true },
	classRoom: { type: String, required: true },
});

const ScrapingInfoSchema = new Schema({
	lastScraped: { type: String, required: true },
	refetchCount: { type: Number, required: true },
});

const UserDataSchema = new Schema({
	profile: { type: ProfileSchema, required: true },
	timetable: { type: TimetableSchema, required: true },
	attendances: { type: [AttendanceSchema], required: true },
	courses: { type: [CourseSchema], required: true },
	scrapingInfo: { type: ScrapingInfoSchema, required: true },
});

const CredentialsSchema = new Schema({
	regNo: { type: String, required: true },
	encryptedPassword: { type: String, required: true },
});

const UserSchema = new Schema(
	{
		userData: { type: UserDataSchema, required: true },
		userCredentials: { type: CredentialsSchema, required: true },
	},
	{ versionKey: false }
);

const HolidaySchema = new Schema(
	{
		date: { type: String, required: true },
		name: { type: String, required: true },
	},
	{ versionKey: false }
);

const SpecialWorkingDaySchema = new Schema(
	{
		date: { type: String, required: true },
		replacementDay: { type: Number, required: true },
	},
	{ versionKey: false }
);

const SystemStateSchema = new Schema(
	{
		inMaintenance: { type: Boolean, default: false },
		semStartDate: { type: String, default: "" },
		semEndDate: { type: String, default: "" },
		adminKey: { type: String, default: "" },
		scrapesInProgress: { type: [String], default: [] },
	},
	{ versionKey: false }
);

const SystemStateModel =
	mongoose.models?.SystemState ||
	mongoose.model("SystemState", SystemStateSchema, "systemState");
const UserModel =
	mongoose.models?.User || mongoose.model("User", UserSchema, "users");
const HolidayModel =
	mongoose.models?.Holiday ||
	mongoose.model("Holiday", HolidaySchema, "holidays");
const SpecialWorkingDayModel =
	mongoose.models?.SpecialWorkingDay ||
	mongoose.model(
		"SpecialWorkingDay",
		SpecialWorkingDaySchema,
		"specialWorkingDays"
	);

export { UserModel, HolidayModel, SpecialWorkingDayModel, SystemStateModel };
