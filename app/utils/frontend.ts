import { Attendance, Course, Profile, Session } from "@/app/utils/hybrid";
import dayjs from "dayjs";

export class FTime {
	private hours: number;
	private minutes: number;
	private seconds: number;
	constructor(hours: number, minutes: number, seconds: number) {
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
	}
	static getSecDiff(time1: FTime, time2: FTime): number {
		const time1InSeconds =
			time1.hours * 3600 + time1.minutes * 60 + time1.seconds;
		const time2InSeconds =
			time2.hours * 3600 + time2.minutes * 60 + time2.seconds;
		return time2InSeconds - time1InSeconds;
	}
	getHours() {
		return this.hours;
	}
	getMinutes() {
		return this.minutes;
	}
	getSeconds() {
		return this.seconds;
	}
	toJSON() {
		{
			return {
				hours: this.hours,
				minutes: this.minutes,
				seconds: this.seconds,
			};
		}
	}
}

export interface FSession {
	courseCode: string;
	courseName: string;
	room: string;
	startTime: FTime;
	endTime: FTime;
	timeLeft: number;
	faculty: string;
	ltpc: string;
}

export class FSMethods {
	static getDurationString(startTime: FTime, endTime: FTime) {
		const formatTime = (hours: number, minutes: number) => {
			const period = hours >= 12 ? "PM" : "AM";
			const formattedHours = hours % 12 || 12;
			return `${String(formattedHours).padStart(2, "0")}:${String(
				minutes
			).padStart(2, "0")} ${period}`;
		};
		const { hours: startH, minutes: startM } = startTime.toJSON();
		const { hours: endH, minutes: endM } = endTime.toJSON();
		const startString = formatTime(startH, startM);
		const endString = formatTime(endH, endM);
		return `${startString} - ${endString}`;
	}
	static getTimeLeftString(timeLeft: number) {
		let totalSeconds = timeLeft;
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const formattedTimeLeft = `${String(hours).padStart(2, "0")}:${String(
			minutes
		).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
		return formattedTimeLeft;
	}
}

export const getLiveTime = () => {
	const date = new Date();
	const time = new FTime(
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	);
	return time;
};

export const getSessionIndex = (
	sessions: Array<Session>,
	sessionMode: string
): number => {
	const liveTime = getLiveTime();

	for (let i = 0; i < sessions.length; i++) {
		const session = sessions[i];
		const sessionStartTime = new FTime(
			session.timing.startTime.hours,
			session.timing.startTime.minutes,
			0
		);
		const sessionEndTime = new FTime(
			session.timing.endTime.hours,
			session.timing.endTime.minutes,
			0
		);

		if (sessionMode === "ongoing") {
			if (
				FTime.getSecDiff(sessionStartTime, liveTime) >= 0 &&
				FTime.getSecDiff(liveTime, sessionEndTime) > 0
			) {
				return i;
			}
		} else if (sessionMode === "upcoming") {
			if (FTime.getSecDiff(liveTime, sessionStartTime) > 0) {
				return i;
			}
		}
	}

	return -1;
};

export const days = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];

export const getCurrentDayOfWeek = () => {
	const date = new Date();
	const day = date.getDay();
	return days[day] as DayOfWeek;
};

export const getSessionDetails = (
	courses: Array<Course>,
	session: Session
): FSession => {
	const courseCode = session.courseCode;
	let course = null;
	for (let i = 0; i < courses.length; i++) {
		if (courses[i].code === courseCode) {
			course = courses[i];
			break;
		}
	}
	const startTime = session.timing.startTime;
	const endTime = session.timing.endTime;
	const startFTime = new FTime(startTime.hours, startTime.minutes, 0);
	const endFTime = new FTime(endTime.hours, endTime.minutes, 0);
	const timeLeft = FTime.getSecDiff(getLiveTime(), endFTime);
	const fsession: FSession = {
		courseCode: course!.code,
		courseName: course!.name,
		room: course!.classRoom,
		startTime: startFTime,
		endTime: endFTime,
		timeLeft: timeLeft,
		faculty: course!.faculty,
		ltpc: course!.ltpc,
	};
	return fsession;
};

export type DayOfWeek =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";

export const getCurrentDayIndex = (): number => {
	const date = new Date();
	const day = date.getDay();
	return day;
};

export const getPercent = (attendance: Attendance): number => {
	const present = attendance.present;
	const absent = attendance.absent;
	const totalScheduled = present + absent;
	const percent = (present / totalScheduled) * 100;
	return percent;
};

export const getODMLConsidered = (attendance: Attendance): number => {
	const maxODML = Math.ceil(attendance.total * 0.15);
	const ODMLTaken = attendance.odml;
	return Math.min(ODMLTaken, maxODML);
};

export const getODMLPercent = (attendance: Attendance): number => {
	const present = attendance.present;
	const absent = attendance.absent;
	const ODMLConsidered = getODMLConsidered(attendance);
	const ODMLPercent = ((present + ODMLConsidered) / (absent + present)) * 100;
	return ODMLPercent;
};

export const getSkipsLeft = (attendance: Attendance): number => {
	const absent = attendance.absent;
	const total = attendance.total;
 	const notEntered = attendance.notEntered;
	return Math.max(0, Math.floor(0.25 * total - absent - notEntered));
};

export const getSessionsToHit75 = (attendance: Attendance): number => {
	const present = attendance.present;
	const absent = attendance.absent;
	const notEntered = attendance.notEntered;
	const sessionsToHit75 = 3 * (absent + notEntered) - present;
	return Math.max(0, sessionsToHit75);
};

export const getPrettierIdentity = (profile: Profile): string => {
	let result = "IDENTITY\n\n";
	result += "Name: " + profile.name + "\n";
	result += "Year: " + profile.year + "\n";
	result += "Semester: " + profile.semester + "\n";
	result += "Program: " + profile.program + "\n";
	result += "Section: " + profile.section + "\n";
	result += "DOB: " + profile.dob + "\n";
	result += "Gender: " + profile.gender;
	return result;
};

export const getPrettierSessions = (sessions: FSession): string => {
	let result = "";
	result += "Course Code: " + sessions.courseCode + "\n";
	result += "Course Name: " + sessions.courseName + "\n";
	result += "Room: " + sessions.room + "\n";
	result +=
		"Start Time: " +
		FSMethods.getDurationString(sessions.startTime, sessions.endTime) +
		"\n";
	result += "Faculty: " + sessions.faculty + "\n";
	result += "LTPC: " + sessions.ltpc;
	return result;
};

export const getPrettierSchedule = (sessions: Array<FSession>): string => {
	let result = "SCHEDULE\n\n";
	for (let i = 0; i < sessions.length; i++) {
		result += "Session-" + (i + 1) + "\n";
		result += getPrettierSessions(sessions[i]) + "\n\n";
	}
	return result;
};

export const getPrettierCoursesOverview = (courses: Array<Course>): string => {
	let result = "COURSES OVERVIEW\n\n";
	for (let i = 0; i < courses.length; i++) {
		result += "Course-" + (i + 1) + "\n";
		result += "Code: " + courses[i].code + "\n";
		result += "Name: " + courses[i].name + "\n";
		result += "Faculty: " + courses[i].faculty + "\n";
		result += "Lectures: " + courses[i].ltpc.split("-")[0] + "\n";
		result += "Tutorials: " + courses[i].ltpc.split("-")[1] + "\n";
		result += "Practicals: " + courses[i].ltpc.split("-")[2] + "\n";
		result += "Credits: " + courses[i].ltpc.split("-")[3] + "\n\n";
	}
	return result;
};

export const getPrettierAttendanceStats = (
	attendances: Array<Attendance>
): string => {
	let result = "ATTENDANCE STATS\n\n";
	for (let i = 0; i < attendances.length; i++) {
		result += "Attendance-" + (i + 1) + "\n";
		result += "Course Code: " + attendances[i].courseCode + "\n";
		result += "Percent: " + getPercent(attendances[i]).toFixed(2) + "\n";
		result += "Usable ODML: " + getODMLConsidered(attendances[i]) + "\n";
		result +=
			"Percent (ODML incl.): " +
			getODMLPercent(attendances[i]).toFixed(2) +
			"\n";
		result += "Total: " + attendances[i].total + "\n";
		result += "Skips Left: " + getSkipsLeft(attendances[i]) + "\n";
		result +=
			"Sessions to Hit 75: " +
			getSessionsToHit75(attendances[i]) +
			"\n\n";
	}
	return result;
};

export type FHoliday = {
	date: dayjs.Dayjs;
	name: string;
};

export type FProperties = {
	semStartDate: string;
	semEndDate: string;
	inMaintenance: boolean;
};
