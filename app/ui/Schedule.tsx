import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { MdSwipeRight } from "react-icons/md";
import { MdSwipeLeft } from "react-icons/md";
import { FaCircleChevronRight } from "react-icons/fa6";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { getCurrentDayIndex, days, DayOfWeek, getSessionDetails, FSession, getPrettierSchedule } from '../utils/frontend';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Timetable, Session } from '../utils/hybrid';
import ScheduleSCard from './ScheduleSCard';
import { FSMethods } from '../utils/frontend';
import CopyPaste from './CopyPaste';
import useEveryTime from '../hooks/EveryTime';


export default function Schedule() {
    const { inQueue, userData, error } = useSelector((state: RootState) => state.user);
    const [todayIndex, setTodayIndex] = useState(getCurrentDayIndex())
    const [dayIndex, setDayIndex] = useState(getCurrentDayIndex());
    const [todayScheduleDetails, setTodayScheduleDetails] = useState<Array<FSession> | null>(null)
    const handleDayIndexChange = (direction: number) => {
        setDayIndex((7 + dayIndex + direction) % 7)
    }
    const handlers = useSwipeable({
        onSwipedLeft: () => handleDayIndexChange(1),
        onSwipedRight: () => handleDayIndexChange(-1),
        preventScrollOnSwipe: false,
        trackTouch: true,
        trackMouse: true,
    });
    const { setActive } = useEveryTime(() => setTodayIndex(getCurrentDayIndex), 86400000)
    useEffect(() => {
        if (!userData) return;
        const dayName: DayOfWeek = days[dayIndex] as DayOfWeek;
        const timetable: Timetable = userData.timetable;
        const sessions = timetable[dayName];
        const tempScheduleDetails: Array<FSession> = sessions.map((session: Session) => getSessionDetails(userData.courses, session));
        setTodayScheduleDetails(tempScheduleDetails);
    }, [userData, dayIndex])
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
                        bg-black
                        text-white text-center text-base
                        font-bold
                        rounded-t-lg
                    `}
                >
                    Schedule
                </div>
                <CopyPaste data={todayScheduleDetails ? getPrettierSchedule(todayScheduleDetails): ""} />
            </div>
            <div className={`
                    w-auto h-auto
                    bg-white
                    flex flex-col items-center justify-center
                    rounded-bl-lg rounded-r-lg
                    p-4
                `}
            >
                <div className={`
                        w-full h-auto
                        flex
                        items-center justify-center
                        gap-x-2
                `}
                >
                    <div className={`
                            w-auto h-auto
                            flex items-center justify-center
                            cursor-pointer
                        `}
                        onClick={() => handleDayIndexChange(-1)}
                    >
                        <FaCircleChevronLeft className={`
                            w-8
                            h-8
                            text-black
                            bg-white
                        `} />
                    </div>
                    <div {...handlers} className={`
                            w-9/12 h-auto
                            bg-black active:bg-zinc-900
                            flex items-center justify-between
                            px-4 py-2
                            rounded-full
                            cursor-pointer
                        `}
                    >
                        <div className={`
                                w-4 h-4
                                text-neutral-300
                            `}
                        >
                            <MdSwipeLeft />
                        </div>
                        <h3 className={`
                                justify-self-center
                                text-xs sm:text-base
                            `}
                        >
                            {(todayIndex == dayIndex) ? 'TODAY' : days[dayIndex].toUpperCase()}
                        </h3>
                        <div className={`
                                w-4 h-4
                                text-neutral-300
                            `}
                        >
                            <MdSwipeRight />
                        </div>


                    </div>
                    <div className={`
                            w-auto h-auto
                            flex items-center justify-center
                            cursor-pointer
                        `}
                        onClick={() => handleDayIndexChange(1)}
                    >
                        <FaCircleChevronRight className={`
                            w-8
                            h-8
                            text-black
                            bg-white
                        `} />
                    </div>
                </div>
                <div className={`
                        w-full h-auto
                        text-black
                        pt-4
                    `}
                >
                    {
                        !todayScheduleDetails || todayScheduleDetails.length == 0 ? (
                            <div className={`
                                    w-full h-auto
                                    bg-zinc-100
                                    p-4
                                    text-center
                                    text-black text-base font-bold
                                    rounded-lg
                                `}
                            >
                                No sessions are scheduled on this day
                            </div>
                        ) : (
                            <div className={`
                                    w-full h-auto
                                `}
                            >
                                {
                                    todayScheduleDetails.length <= 3 ? (
                                        todayScheduleDetails.map((fSession: FSession, index) => {
                                            const durationString = FSMethods.getDurationString(fSession.startTime, fSession.endTime);
                                            return <ScheduleSCard
                                                key={index}
                                                sessionNo={index + 1}
                                                courseName={fSession.courseName}
                                                durationString={durationString}
                                                room={fSession.room}
                                                faculty={fSession.faculty}
                                                courseCode={fSession.courseCode}
                                                ltpc={fSession.ltpc}
                                            />
                                        })
                                    ) : (
                                        <div className={`
                                                w-full h-auto
                                                flex flex-col justify-center gap-y-4
                                            `}
                                        >
                                            <div className={`
                                                w-full 
                                                h-96 bsm:h-72 lg:h-48
                                                overflow-y-scroll
                                                gap-y-4 gap-x-4
                                                rounded-xl
                                                no-scrollbar
                                                border-t-2 border-b-2 border-neutral-200
                                            `}
                                            >
                                                {
                                                    todayScheduleDetails.map((fSession: FSession, index) => {
                                                        const durationString = FSMethods.getDurationString(fSession.startTime, fSession.endTime);
                                                        return <ScheduleSCard
                                                            key={index}
                                                            sessionNo={index + 1}
                                                            courseName={fSession.courseName}
                                                            durationString={durationString}
                                                            room={fSession.room}
                                                            faculty={fSession.faculty}
                                                            courseCode={fSession.courseCode}
                                                            ltpc={fSession.ltpc}
                                                        />
                                                    })

                                                }
                                            </div>
                                            <div className={`
                                                        w-full h-auto
                                                        text-center text-xs
                                                        text-neutral-600 font-bold

                                                    `}
                                            >
                                                Scroll inside to view more
                                            </div>
                                        </div>


                                    )
                                }
                            </div>

                        )
                    }
                </div>
            </div>
        </div>
    )
}