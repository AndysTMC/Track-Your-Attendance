import * as https from 'https';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import * as cheerio from 'cheerio';
import { Timetable, Course, Session, Profile, Timing, Attendance } from '@/app/utils/hybrid'
import { 
    Portal, ScrapeData, JSESSIONID_CHECK_C, CAPTCHA_CHECK_C, CREDENTIALS_CHECK_C, NA_C, UNKNOWN_C, 
    FAILED_AUTH_C, INVALID_AUTH_C, FAILED_SCRAPE_C, PORTAL_ERROR_C, PROFILE_SCRAPE_C, TIMETABLE_SCRAPE_C, ATTENDANCE_SCRAPE_C,
} from '@/app/utils/backend';
import OPS from './db_ops';

const headersForFetchingJSESSIONID: Record<string, string> = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "mode": "cors",
    "credentials": "include",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "referrer": "https://parent.srmap.edu.in/srmapparentcorner/HRDSystem",
};

const optionsForFetchingCaptcha: https.RequestOptions = {
    hostname: 'parent.srmap.edu.in',
    path: '/srmapparentcorner/captchas',
    method: 'GET',
};

const headersForFetchingCaptcha: Record<string, string> = {
    "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
    "host": "parent.srmap.edu.in",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-origin",
    "referrer": "https://parent.srmap.edu.in/srmapparentcorner/LoginPage",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "mode": "cors",
    "credentials": "include"
};

const headersForFetchingLogin: Record<string, string> = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

const headersForGettingPage: Record<string, string> = {
    "accept": "text/html, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "Referer": "https://parent.srmap.edu.in/srmapparentcorner/HRDSystem",
    "Referrer-Policy": "strict-origin-when-cross-origin",
};


const getJSESSIONID = async (): Promise<string> => {
    try {
        const response = await fetch("https://parent.srmap.edu.in/srmapparentcorner/LoginPage",
            { headers: headersForFetchingJSESSIONID, method: "GET" }
        );
        const setCookieHeader = response.headers.get('set-cookie');
        if (!setCookieHeader) throw new Error("No Set-Cookie header found.");
        const JSESSIONID = setCookieHeader.split(';')[0].split('=')[1];
        return JSESSIONID;
    } catch (err: any) {
        throw new Error([FAILED_AUTH_C, JSESSIONID_CHECK_C, err.message].join(":::"));
    }
};

const getCaptcha = async (JSESSIONID: string): Promise<string> => {
    try {
        const options = {
            ...optionsForFetchingCaptcha,
            headers: { ...headersForFetchingCaptcha, "cookie": `JSESSIONID=${JSESSIONID}` }
        };
        let filePath = '';
        
        if (process.env.NODE_ENV == 'production') { filePath = '/tmp/captcha.png'} else
        filePath = './captcha.png'

        await new Promise<void>((resolve, reject) => {
            https.get(options, (res) => {
                const file = fs.createWriteStream(filePath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close(() => resolve());
                });
            }).on('error', reject);
        });
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        const response = await axios.post("https://tya-text-extract.onrender.com/extract", formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`
            }
        });
        const text = response.data.captchaText;
        if (text == null || text == undefined) throw new Error("Failed to extract text from captcha image");
        return text.trim();
    } catch (err: any) {
        throw new Error([FAILED_AUTH_C, CAPTCHA_CHECK_C, err.message].join(":::"));
    }
};


const authenticate = async (JSESSIONID: string, captcha: string, regNo: string, password: string): Promise<Portal> => {
    try {
        const response = await fetch("https://parent.srmap.edu.in/srmapparentcorner/Login", {
            headers: {
                ...headersForFetchingLogin,
                "content-type": "application/x-www-form-urlencoded",
                "cookie": `JSESSIONID=${JSESSIONID}`,
                "Referer": "https://parent.srmap.edu.in/srmapparentcorner/LoginPage",
            },
            body: `ccode=${captcha}&txtUserName=${regNo}&txtAuthKey=${encodeURIComponent(password)}`,
            method: "POST"
        });
        const responseText = await response.text();
        if (responseText.includes("Welcome")) {
            return {
                url: "https://parent.srmap.edu.in/srmapparentcorner/students/report/studentreportresources.jsp",
                headers: { ...headersForGettingPage, "cookie": `JSESSIONID=${JSESSIONID}` },
            };
        } else if (responseText.includes("Invalid User ID or Password")) {
            throw new Error([INVALID_AUTH_C, CREDENTIALS_CHECK_C, NA_C].join(":::"));
        } else {
            throw new Error([PORTAL_ERROR_C, UNKNOWN_C, NA_C].join(":::"));
        }
    } catch (err) {
        throw err;
    }
};

const getPage = async (portal: Portal, pageId: number): Promise<string> => {
    try {
        const response = await fetch(portal.url, {
            headers: portal.headers,
            body: `ids=${pageId}`,
            method: "POST"
        });
        return response.text();
    } catch (err: any) {
        throw err;
    }
};

const extractProfilePage = async (portal: Portal, pageId: number): Promise<Profile> => {
    try {
        const profilePage = await getPage(portal, pageId);
        const $ = cheerio.load(profilePage);
        const parseDate = (dateStr: string): Date => {
            const [day, month, year] = dateStr.split('-');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = months.indexOf(month);
            return new Date(parseInt(year), monthIndex, parseInt(day));
        };
        const getTextFromRow = (label: string): string => {
            return $(`tr:contains('${label}')`).find('td').last().text().trim();
        };
        const getSemesterNumber = (semesterRoman: string): number => {
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
            return romanNumerals.indexOf(semesterRoman) + 1;
        }
        const profileInfo: Profile = {
            name: getTextFromRow('Student Name'),
            year: getTextFromRow('Academic Year'),
            semester: getSemesterNumber(getTextFromRow('Semester').split(' ')[0]),
            program: getTextFromRow('Program / Section').split('/')[0].trim(),
            section: getTextFromRow('Program / Section').split('/')[1].trim().slice(1, -1),
            dob: parseDate(getTextFromRow('D.O.B. / Gender').split('/')[0].trim()).toLocaleDateString(),
            gender: getTextFromRow('D.O.B. / Gender').split('/')[1].trim(),
        };
        return profileInfo;
    } catch (err: any) {
        throw new Error([FAILED_SCRAPE_C, PROFILE_SCRAPE_C, err.message].join(":::"));
    }
};

function extractAndConcatenateRooms(input: string): string {
    return (input.match(/\(([^()]+)\)/g) || [])
        .map(match => match.replace(/[^a-zA-Z0-9\s]/g, '').trim())
        .filter(Boolean)
        .join(', ');
}

const extractTimetablePage = async (portal: Portal, pageId: number): Promise<{ timetable: Timetable; courses: Array<Course> }> => {
    try {
        const timetablePage = await getPage(portal, pageId);
        const $ = cheerio.load(timetablePage);
        const courses: Array<Course> = [];
        $('tr').filter((_: any, el: any) => $(el).find('td').length === 5).each((_: any, el: any) => {
            const [code, name, ltpc, faculty, classRoom] = $(el).find('td').map((_: any, el: any) => $(el).text().trim()).get();
            courses.push({ code, name, ltpc, faculty, classRoom: extractAndConcatenateRooms(classRoom)});
        });
        const courseCodes = courses.map(course => course.code);
        courseCodes.sort((a, b) => b.length - a.length);
        const sessionTimings: Array<Timing> = []
        $('tr').eq(1).find('td').slice(1,).each((_: any, el: any) => {
            const [startTime, endTime] = $(el).text().trim().split('To').map(time => {
                let [hours, minutes] = time.split(':').map(Number);
                if (hours < 8) hours += 12;
                return { hours, minutes };
            })
            sessionTimings.push({ startTime, endTime });
        })
        const timetable: Timetable = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        };
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $('tr').slice(2, 9).each((dayIndex: number, row: any) => {
            $(row).find('td').slice(1).each((sessionIndex: number, sessionEl: any) => {
                const courseCode: string | undefined = courseCodes.find((code) => $(sessionEl).text().trim().includes(code));
                if (courseCode != undefined) {
                    const sessionInfo: Session = { timing: sessionTimings[sessionIndex], courseCode };
                    timetable[days[dayIndex] as keyof Timetable].push(sessionInfo);
                }
            });
        });
        return { timetable, courses };
    } catch (err: any) {
        throw new Error([FAILED_SCRAPE_C, TIMETABLE_SCRAPE_C, err.message].join(":::"));
    }

}

const extractAttendancePage = async (portal: Portal, pageId: number): Promise<Array<Attendance>> => {
    try {
        const attendancePage = await getPage(portal, pageId);
        const $ = cheerio.load(attendancePage);
        const attendanceInfo: Array<Attendance> = [];
        $('tr').filter((_: any, el: any) => $(el).find('td').length === 10).each((_: any, el: any) => {
            const [
                courseCode, courseName, totalScheduled,
                present, absent, notEntered, presentPercent,
                odml, odmlAppr, percent
            ] = $(el).find('td').map((_: any, el: any) => $(el).text().trim()).get();
            attendanceInfo.push({ courseCode, present: parseInt(present ?? 0), absent: parseInt(absent ?? 0), totalScheduled: parseInt(totalScheduled ?? 0), total: -1, notEntered: parseInt(notEntered ?? 0), odml: parseInt(odml ?? 0) });
        })
        return attendanceInfo;
    } catch (err: any) {
        throw new Error([FAILED_SCRAPE_C, ATTENDANCE_SCRAPE_C, err.message].join(":::"));
    }
}
const setTotalInAttendance = async (
    courseInfo: Array<Course>,
    timetableInfo: Timetable,
    attendanceInfo: Array<Attendance>
): Promise<void> => {
    try {
        const startDateString = await OPS.getSemStartDate();
        const endDateString = await OPS.getSemEndDate();
        console.log(startDateString, endDateString);
        const startDate: Date = new Date(startDateString as string);
        const endDate: Date = new Date(endDateString as string); 
        console.log(startDate, endDate);
        const days: Array<string> = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const countWeekdayOccurrences = (startDate: Date, endDate: Date): Array<number> => {
            const dayCounts = new Array(7).fill(0);
            const totalDays = Math.ceil( (endDate.getTime() - startDate.getTime())  / (1000 * 60 * 60 * 24));
            const startDay = startDate.getDay();
            const fullWeeks = Math.floor(totalDays / 7);
            for (let i = 0; i < 7; i++) {
                dayCounts[i] = fullWeeks;
            }
            for (let i = 0; i <= totalDays % 7; i++) {
                dayCounts[(startDay + i) % 7]++;
            }
            return dayCounts;
        };
        const weekdayOccurrences = countWeekdayOccurrences(startDate, endDate);
        attendanceInfo.forEach(attendance => {
            const courseCode = attendance.courseCode;
            let totalSessions = 0;
            days.forEach((dayName, dayIndex) => {
                const sessionsForDay = timetableInfo[dayName as keyof Timetable].filter(session => session.courseCode === courseCode);
                totalSessions += sessionsForDay.length * weekdayOccurrences[dayIndex];
            });
            attendance.total = totalSessions;
        });
    } catch (err: any) {
        throw new Error([FAILED_SCRAPE_C, ATTENDANCE_SCRAPE_C, err.message].join(":::"));
    }
}


export const scrape = async (regNo: string, password: string, portal: Portal): Promise<ScrapeData | null> => {
    //load json
    // wait for 3 seconds 
    // await new Promise(resolve => setTimeout(resolve, 3000));
    // let file = await JSON.parse(fs.readFileSync("./test_data.json", "utf-8"));
    // return file;
    try {
        const profile: Profile = await extractProfilePage(portal, 1);
        const { timetable, courses }: { timetable: Timetable, courses: Course[] } = await extractTimetablePage(portal, 10);
        const attendances: Attendance[] = await extractAttendancePage(portal, 3);
        await setTotalInAttendance(courses, timetable, attendances);
        return { profile, timetable, attendances, courses } as ScrapeData;
    } catch (err) {
        throw err;
    }
}


export const getPortal = async (regNo: string, password: string): Promise<Portal> => {
    try {
        const JSESSIONID: string = await getJSESSIONID();
        const captcha: string = await getCaptcha(JSESSIONID);
        const portal: Portal = await authenticate(JSESSIONID, captcha, regNo, password);
        return portal;
    } catch (err) {
        throw err;
    }
}