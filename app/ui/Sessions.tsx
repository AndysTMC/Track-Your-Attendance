import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Course, Session, Timetable } from "../utils/hybrid";
import { FTime, FSession, FSMethods, getLiveTime, getSessionIndex, getCurrentDayOfWeek, getSessionDetails, DayOfWeek, getPrettierSessions } from "../utils/frontend";
import CopyPaste from "./CopyPaste";
import useEveryTime from "../hooks/EveryTime";

export default function Sessions() {
    const { inQueue, userData, error } = useSelector((state: RootState) => state.user)
    const [sessionMode, setSessionMode] = useState('ongoing')
    const [sessionDetails, setSessionDetails] = useState<FSession | null>(null)
    const [onGoingSessionIndex, setOnGoingSessionIndex] = useState(-1)
    const [upcomingSessionIndex, setUpcomingSessionIndex] = useState(-1)
    const [curTime, setCurTime] = useState(getLiveTime().toJSON());
    const [curFTime, setCurFTime] = useState(getLiveTime().toJSON() as { hours: number, minutes: number });
    useEffect(() => {
        const interval = setInterval(() => {
            const liveTime = getLiveTime();
            if (curFTime != liveTime.toJSON() as { hours: number, minutes: number }) setCurFTime(curTime as { hours: number, minutes: number });
            setCurTime(liveTime.toJSON());
        }, 1000);
        return () => { clearInterval(interval); };
    }, [curTime, curFTime]);
    const getNoSessionsMessage = (): string => {
        if (userData === null) return 'No data available';
        const todaySessions = userData.timetable[getCurrentDayOfWeek()];
        if (todaySessions.length === 0) return 'Today is session-free';
        if (upcomingSessionIndex == -1 && onGoingSessionIndex) return "Everything's wrapped up";
        else if (onGoingSessionIndex == -1) return 'No active sessions at the moment';
        return "Everything's going to be wrapped up just right.";
    }
    const updateSessionIndices = () => {
        if (!userData || (sessionDetails && sessionDetails.timeLeft > 0)) return;
        const dayName: DayOfWeek = getCurrentDayOfWeek();
        const timetable: Timetable = userData.timetable;
        const currentDaySessions = timetable[dayName];
        const OGSI = getSessionIndex(currentDaySessions, 'ongoing');
        const UCSI = getSessionIndex(currentDaySessions, 'upcoming');
        setOnGoingSessionIndex(OGSI);
        setUpcomingSessionIndex(UCSI);
    }
    const updateSessionDetails = () => {
        if (!userData) return;
        const dayName: DayOfWeek = getCurrentDayOfWeek();
        const timetable: Timetable = userData.timetable;
        const currentDaySessions = timetable[dayName];
        let sessionIndex = sessionMode === 'ongoing' ? onGoingSessionIndex : upcomingSessionIndex;
        if (sessionIndex === -1) {
            setSessionDetails(null);
        } else {
            const session = currentDaySessions[sessionIndex];
            const sd = getSessionDetails(userData.courses, session);
            setSessionDetails(sd);
        }
    }
    const { setActive:setSecondActive } = useEveryTime(updateSessionIndices)
    const { setActive:setMinuteActive } = useEveryTime(updateSessionDetails, 60000)
    useEffect(() => {
        return () => { setSecondActive(false), setMinuteActive(false) }
    }, [setSecondActive, setMinuteActive])
    useEffect(updateSessionIndices, [sessionDetails, userData]);
    useEffect(updateSessionDetails, [onGoingSessionIndex, upcomingSessionIndex, sessionMode, userData]);
    useEffect(() => {
        if (!sessionDetails) return;
        if (sessionMode === 'upcoming') return;
        const interval = setInterval(() => {
            const currentFTime = getLiveTime();
            setSessionDetails(prevDetails => {
                if (!prevDetails) return null;
                return {
                    ...prevDetails,
                    timeLeft: FTime.getSecDiff(currentFTime, prevDetails.endTime)
                };
            });
        }, 1000);
        return () => { clearInterval(interval); };
    }, [sessionDetails, sessionMode, userData]);
    return (
        <div className={`
            w-auto h-auto
            px-4 pb-4
            select-none
            `}
        >
            <div className={`
                w-max h-auto
                text-white text-center text-base
                font-bold
                rounded-t-lg
                flex gap-x-0.5 items-center
            `}
            >
                <div className={`
                w-auto h-auto
                px-2
                ${sessionMode === 'ongoing' ? 'bg-black' : 'bg-zinc-700'}
                text-white text-center text-base
                font-bold
                rounded-t-lg 
                cursor-pointer
                `} onClick={() => setSessionMode('ongoing')}
                >
                    Ongoing
                </div>
                <div className={`
                w-auto h-auto
                px-2
                ${sessionMode === 'upcoming' ? 'bg-black' : 'bg-zinc-700'}
                text-white text-center text-base
                font-bold
                rounded-t-lg 
                cursor-pointer
                `} onClick={() => setSessionMode('upcoming')}
                >
                    Upcoming
                </div>
                <CopyPaste data={sessionDetails ? getPrettierSessions(sessionDetails): ""} />
            </div>
            <div className={`
            w-auto h-auto
            bg-white
            p-4
            rounded-bl-lg rounded-r-lg
        `}>
                {
                    sessionDetails === null ? (
                        <div className={`
                            w-full h-auto
                            bg-zinc-100
                            p-4
                            text-black text-center text-base font-bold
                            rounded-lg
                            `}>
                            {getNoSessionsMessage()}
                        </div>
                    ) : (
                        <div className={`
                            grid 
                            grid-cols-10 gap-2
                            `}>
                            <div className={`
                                    text-black
                                    col-span-10 sm:col-span-6 bsm:col-span-6 md:col-span-4 lg:col-span-2
                                `}>
                                <div className='text-ssm'>Course Name</div>
                                <div className='text-sm text-pretty'>{sessionDetails.courseName}</div>
                            </div>
                            <div className={`
                                    text-black
                                    col-span-10 sm:col-span-4 bsm:col-span-4 md:col-span-3 lg:col-span-1
                                `}>
                                <div className='text-ssm'>Course Code</div>
                                <div className='text-sm text-nowrap'>{sessionDetails.courseCode}</div>
                            </div>
                            <div className={`
                                    text-black
                                    col-span-10 md:col-span-3 lg:col-span-2
                                `}>
                                <div className='text-ssm'>Faculty</div>
                                <div className='text-sm text-balance'>{sessionDetails.faculty}</div>
                            </div>
                            <div className={`
                                    text-black
                                    col-span-10 sm:col-span-6 bsm:col-span-1 md:col-span-2 lg:col-span-1
                                `}>
                                <div className='text-ssm'>Room</div>
                                <div className='text-sm text-nowrap'>{sessionDetails.room}</div>
                            </div>
                            <div className={`
                                    text-black
                                    col-span-10 sm:col-span-4 bsm:col-span-2 lg:col-span-1
                                `}>
                                <div className='text-ssm'>L-T-P-C</div>
                                <div className='text-sm text-nowrap'>{sessionDetails.ltpc}</div>
                            </div>

                            <div className={`
                                    text-black
                                    col-span-10 sm:col-span-6 bsm:col-span-3 md:col-span-3 lg:col-span-2
                                `}>
                                <div className='text-ssm'>Duration{" (H:M, 24h)"}</div>
                                <div className='text-sm text-nowrap'>{FSMethods.getDurationString(sessionDetails.startTime, sessionDetails.endTime)}</div>
                            </div>
                            {
                                sessionMode === 'ongoing' ? (
                                    <div className={`
                                            text-black
                                            col-span-10 sm:col-span-4 bsm:col-span-2 lg:col-span-1
                                        `}>
                                        <div className='text-ssm'>Time Left {" (H:M:S)"}</div>
                                        <div className='text-sm text-nowrap animate-bounce'>{FSMethods.getTimeLeftString(sessionDetails.timeLeft)}</div>
                                    </div>
                                ) : null
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}