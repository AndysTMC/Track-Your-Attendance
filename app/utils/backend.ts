import OPS from "@/app/utils/db_ops";
import {
	Attendance,
	Course,
	Holiday,
	Profile,
	SpecialWorkingDay,
	Timetable,
	UserData,
} from "./hybrid";
import crypto from "crypto";

// Error Types
export const INVALID_AUTH_C = "INVALID AUTHENTICATION";
export const FAILED_AUTH_C = "FAILED AUTHENTICATION";
export const FAILED_SCRAPE_C = "FAILED SCRAPE";
export const PORTAL_ERROR_C = "PORTAL ERROR";
export const FAILED_DECRYPT_C = "FAILED DECRYPT";
export const IN_MAINTENANCE_C = "IN MAINTENANCE";
export const ERROR_AT_BACKEND_C = "ERROR AT BACKEND";
export const CANT_FETCH_C = "CANT FETCH";
export const CANT_REFETCH_C = "CANT REFETCH";

// Locations
export const JSESSIONID_CHECK_C = "JSESSIONID CHECK";
export const CAPTCHA_CHECK_C = "CAPTCHA CHECK";
export const PORTAL_ERROR_CHECK_C = "PORTAL ERROR CHECK";
export const PROFILE_SCRAPE_C = "PROFILE SCRAPE";
export const TIMETABLE_SCRAPE_C = "TIMETABLE SCRAPE";
export const ATTENDANCE_SCRAPE_C = "ATTENDANCE SCRAPE";
export const REGNO_CHECK_C = "REGNO CHECK";
export const CREDENTIALS_CHECK_C = "CREDENTIALS CHECK";
export const REGNO_IN_QUEUE_CHECK_C = "REGNO IN QUEUE CHECK";
export const SCRAPE_IN_PROGRESS_CHECK_C = "SCRAPE IN PROGRESS CHECK";
export const REFETCH_POSSIBLITY_CHECK_C = "REFETCH POSSIBLITY CHECK";
export const DKEY_CHECK_C = "DKEY CHECK";
export const REGNO_DATA_CHECK_C = "REGNO DATA CHECK";
export const COOLDOWN_CHECK_C = "COOLDOWN CHECK";
export const INVALID_AUTH_CHECK_C = "INVALID AUTH CHECK";
export const FAILED_SCRAPE_CHECK_C = "FAILED SCRAPE CHECK";
export const SERVER_CHECK_C = "SERVER CHECK";
export const BACKEND_CHECK_C = "BACKEND CHECK";
export const FAILED_AUTH_CHECK_C = "FAILED AUTH CHECK";

// Messages
export const UNKNOWN_C = "Unknown";
export const NA_C = "Not available";
export const REGNO_NOT_PROVIDED_C = "Registration number not provided";
export const DATA_NA_WITH_REGNO =
	"Data not available for the given registration number";
export const PASSWORD_NOT_PROVIDED_C = "Password not provided";
export const DKEY_NOT_PROVIDED_C = "Dkey not provided";
export const TIME_LIMIT_NOT_REACHED_C = "6-hour time limit not reached";
export const SERVER_IN_MAINTENANCE_C = "Server is in maintenance";
export const REFETCH_LIMIT_REACHED_C = "Refetch limit reached";
export const INVALID_CREDENTIALS_C = "Invalid credentials";
export const PLEASE_TRY_AGAIN_C = "Please try again";
export const PLEASE_TRY_AGAIN_LATER_C = "Please try again sometime later";
export const NEITHER_PASSWORD_NOR_DKEY_PROVIDED_C =
	"Neither password nor dkey provided";
export const FAILED_TO_FETCH_DATA_C = "Failed to fetch data";

export type QueueItem = {
	credentials: Credentials;
	refetch: boolean;
	portal: Portal;
	user: User | null;
	systemData: SystemData;
};

export class Queue {
	private items: QueueItem[] = [];

	async enqueue(item: QueueItem): Promise<void> {
		this.items.push(item);
	}

	dequeue(): QueueItem | undefined {
		return this.items.shift();
	}

	peek(): QueueItem | undefined {
		return this.items[0];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}

	inFront(regNo: string): number {
		return this.items.findIndex((item) => item.credentials.regNo === regNo);
	}

	hasUser(regNo: string): boolean {
		return this.items.some((item) => item.credentials.regNo === regNo);
	}
}

export type Portal = {
	url: string;
	headers: Record<string, string>;
};

export type Credentials = {
	regNo: string;
	encryptedPassword: string;
};

export type ScrapeData = {
	profile: Profile;
	timetable: Timetable;
	attendances: Attendance[];
	courses: Course[];
};

export type User = {
	userData: UserData;
	userCredentials: Credentials;
};

export type SystemData = {
	inMaintenance: boolean;
	semStartDate: string;
	semEndDate: string;
	adminKey: string;
	scrapesInProgress: string[];
};

const allChars =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

export const generateDKey = (): string => {
	const suffledChars = [...allChars].sort(() => Math.random() - 0.5);
	return suffledChars.join("");
};

const isValidDKey = (dKey: string): boolean => {
	const dKeySet = new Set(dKey);
	const allCharsSet = new Set(allChars);
	const intersection = new Set(
		[...dKeySet].filter((char) => allCharsSet.has(char))
	);
	return intersection.size === allCharsSet.size;
};

const getAllCharDKey = (dKey: string): Record<string, string> => {
	const map: Record<string, string> = {};
	for (let i = 0; i < allChars.length; i++) {
		map[allChars[i]] = dKey[i];
	}
	return map;
};

const getDKeyAllChar = (dKey: string): Record<string, string> => {
	const map: Record<string, string> = {};
	for (let i = 0; i < allChars.length; i++) {
		map[dKey[i]] = allChars[i];
	}
	return map;
};

export const encrypt = (text: string): [string, string] => {
	const dKey: string = generateDKey();
	const charsMap = getAllCharDKey(dKey);
	let encrypted = "";
	for (let i = 0; i < text.length; i++) {
		encrypted += charsMap[text[i]];
	}
	return [encrypted, dKey];
};

export const decrypt = (encryptedText: string, dKey: string): string => {
	try {
		if (!isValidDKey(dKey)) {
			throw new Error("Invalid Decryption key");
		}
		const charsMap = getDKeyAllChar(dKey);
		let decrypted = "";
		for (let i = 0; i < encryptedText.length; i++) {
			decrypted += charsMap[encryptedText[i]];
		}
		return decrypted;
	} catch (err: any) {
		throw new Error(
			[FAILED_DECRYPT_C, DKEY_CHECK_C, err.message].join(":::")
		);
	}
};

export const generateAdminKey = (): string => {
	return crypto.randomBytes(32).toString("hex");
};
