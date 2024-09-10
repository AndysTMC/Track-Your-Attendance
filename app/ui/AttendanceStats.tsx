import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Attendance } from "../utils/hybrid";
import React from "react";
import { get } from "http";
import { getPercent, getPrettierAttendanceStats, isSafe, getSkipsLeft, getODMLConsidered } from "../utils/frontend";
import CopyPaste from "./CopyPaste";
import { IoMdThumbsUp } from "react-icons/io";
import { CgDanger } from "react-icons/cg";


export default function AttendanceStats() {
    const { inQueue, userData, error } = useSelector((state: RootState) => state.user);
    const [attendanceDetails, setAttendanceDetails] = useState<Attendance[]>([])
    useEffect(() => {
        if (userData) { setAttendanceDetails(userData.attendances) }
    }, [userData])
    return (
        <div className={`
            w-full h-auto
            px-4 py-4
            select-none
            `}
        >
            <div className={`
                w-full h-auto
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
                    Attendance Stats
                </div>
                <CopyPaste data={getPrettierAttendanceStats(userData!.attendances)} />
            </div>
            <div className={`
            w-full h-auto
            bg-white
            p-4
            rounded-bl-lg rounded-r-lg
        `}>
                <div className={`
                w-full h-auto
                grid grid-cols-4 gap-2
                auto-cols-auto
                `}
                >
                    <div className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        text-xs bsm:text-sm
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
                        flex justify-center items-center
                    `}
                    >
                        Code
                    </div>
                    <div className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        text-xs bsm:text-sm
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
                        flex justify-center items-center
                    `}
                    >
                        Usable ODML
                    </div>
                    <div className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        text-xs bsm:text-sm
                        text-balance
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
                        flex justify-center items-center
                    `}
                    >
                        Skips Left
                    </div>
                    <div className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        
                        text-xs bsm:text-sm
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
                        flex justify-center items-center
                    `}
                    >
                        {"Status (ODML incl.)"}
                    </div>
                    {
                        attendanceDetails ? (
                            attendanceDetails.map((attendance, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className={`
                                            w-auto h-auto
                                            bg-zinc-200
                                            text-zinc-800 text-center 
                                            text-xs bsm:text-sm
                                            font-bold
                                            col-span-1
                                            rounded-lg
                                            p-2
                                            flex justify-center items-center
                                        `}
                                        >
                                            {attendance.courseCode}
                                        </div>
                                        <div className={`
                                            w-auto h-auto
                                            bg-zinc-100
                                            text-zinc-800 text-center 
                                            text-xs bsm:text-sm
                                            font-medium
                                            col-span-1
                                            rounded-lg
                                            p-2
                                            flex justify-center items-center
                                        `}
                                        >
                                            {getODMLConsidered(attendance)}
                                        </div>
                                        <div className={`
                                            w-auto h-auto
                                            bg-zinc-100
                                            text-zinc-800 text-center 
                                            text-xs bsm:text-sm
                                            font-medium
                                            col-span-1
                                            rounded-lg
                                            p-2
                                            flex justify-center items-center
                                        `}
                                        >
                                            {getSkipsLeft(attendance)}
                                        </div>
                                        <div className={`
                                            w-auto h-auto
                                            bg-zinc-100
                                            text-zinc-800 text-center 
                                            text-xs bsm:text-sm
                                            font-medium
                                            col-span-1
                                            rounded-lg
                                            p-2
                                            flex justify-center items-center
                                        `}
                                        >
                                            {
                                                isSafe(attendance) ? (
                                                    <IoMdThumbsUp className={`
                                                        text-black
                                                        text-2xl
                                                    `} />
                                                ) : (
                                                    <CgDanger className={`
                                                        text-black
                                                        text-2xl
                                                    `} />
                                                )
                                            }
                                        </div>
                                    </React.Fragment>
                                )
                            })

                        ) : (
                            <div className={`
                                w-full h-auto
                                bg-zinc-200
                                text-zinc-800 text-center 
                                text-xs bsm:text-sm
                                font-bold
                                col-span-4
                                rounded-lg
                                p-2
                                flex justify-center items-center
                            `}
                            >
                                No attendance data available
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
