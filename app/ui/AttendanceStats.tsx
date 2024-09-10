import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Attendance } from "../utils/hybrid";
import React from "react";
import {
	getPercent,
	getPrettierAttendanceStats,
	getSkipsLeft,
	getODMLConsidered,
	getODMLPercent,
	getSessionsToHit75,
} from "../utils/frontend";
import CopyPaste from "./CopyPaste";
import { FaAngleDown } from "react-icons/fa";

export default function AttendanceStats() {
	const { inQueue, userData, error } = useSelector(
		(state: RootState) => state.user
	);
	const [attendanceDetails, setAttendanceDetails] = useState<Attendance[]>(
		[]
	);
	const [showInstructions, setShowInstructions] = useState<boolean>(false);
	useEffect(() => {
		if (userData) {
			setAttendanceDetails(userData.attendances);
		}
	}, [userData]);
	return (
		<div
			className={`
            w-full h-auto
            px-4 py-4
            select-none
            `}
		>
			<div
				className={`
                w-full h-auto
                text-white text-center text-base
                font-bold
                rounded-t-lg
                flex gap-x-0.5 items-center
            	`}
			>
				<div
					className={`
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
				<CopyPaste
					data={getPrettierAttendanceStats(userData!.attendances)}
				/>
			</div>
			<div
				className={`
				w-full h-auto
				bg-white
				p-4
				rounded-bl-lg rounded-r-lg
				flex flex-col gap-y-2
				`}
			>
				<div
					className={`
					w-full h-auto
					grid grid-cols-4 lg:grid-cols-7 gap-2
					auto-cols-auto
					`}
				>
					<div
						className={`
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
					<div
						className={`
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
						Perc.
					</div>
					<div
						className={`
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
						Usable ODML
					</div>
					<div
						className={`
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
						{"Perc. (ODML incl.)"}
					</div>
					<div
						className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        text-xs bsm:text-sm
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
						hidden
                        lg:flex justify-center items-center
                    	`}
					>
						Sess. Remain
					</div>
					<div
						className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        text-xs bsm:text-sm
                        text-balance
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
                        hidden
                        lg:flex justify-center items-center
                    	`}
					>
						Skips Left
					</div>
					<div
						className={`
                        w-auto h-auto
                        bg-black
                        text-white text-center 
                        text-xs bsm:text-sm
                        font-bold
                        col-span-1
                        rounded-lg
                        p-2
                        hidden
                        lg:flex justify-center items-center
                    	`}
					>
						To Hit 75%
					</div>
					{attendanceDetails ? (
						attendanceDetails.map((attendance, index) => {
							return (
								<React.Fragment key={index}>
									<div
										className={`
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
									<div
										className={`
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
										{getPercent(attendance).toFixed(2) +
											"%"}
									</div>
									<div
										className={`
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
									<div
										className={`
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
										{getODMLPercent(attendance).toFixed(2) +
											"%"}
									</div>
									<div
										className={`
											w-auto h-auto
											bg-zinc-100
											text-zinc-800 text-center 
											text-xs bsm:text-sm
											font-medium
											col-span-1
											rounded-lg
											p-2
											hidden
											lg:flex justify-center items-center
										`}
									>
										{attendance.total - attendance.totalScheduled}
									</div>
									<div
										className={`
											w-auto h-auto
											bg-zinc-100
											text-zinc-800 text-center 
											text-xs bsm:text-sm
											font-medium
											col-span-1
											rounded-lg
											p-2
											hidden
											lg:flex justify-center items-center
										`}
									>
										{getSkipsLeft(attendance)}
									</div>
									<div
										className={`
											w-auto h-auto
											bg-zinc-100
											text-zinc-800 text-center 
											text-xs bsm:text-sm
											font-medium
											col-span-1
											rounded-lg
											p-2
											hidden
											lg:flex justify-center items-center
										`}
									>
										{getSessionsToHit75(attendance)}
									</div>
								</React.Fragment>
							);
						})
					) : (
						<div
							className={`
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
					)}
				</div>
				<div
					className={`
					w-full h-auto
					grid grid-cols-4 gap-2
					auto-cols-auto
					lg:hidden
					`}
				>
					<div
						className={`
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
					<div
						className={`
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
						Sess. Remain
					</div>
					<div
						className={`
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
					<div
						className={`
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
						To Hit 75%
					</div>
					{attendanceDetails ? (
						attendanceDetails.map((attendance, index) => {
							return (
								<React.Fragment key={index}>
									<div
										className={`
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
									<div
										className={`
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
										{attendance.total - attendance.totalScheduled}
									</div>
									<div
										className={`
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
									<div
										className={`
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
										{getSessionsToHit75(attendance)}
									</div>
								</React.Fragment>
							);
						})
					) : (
						<div
							className={`
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
					)}
				</div>
				<div
					className={`
					w-full h-auto
					`}
				>
					<div
						className={`
						w-full
						flex flex-col
						justify-center items-center
						py-2
						text-white
						bg-zinc-700 hover:bg-zinc-600
						rounded-t-lg
						${!showInstructions ? "rounded-b-lg" : ""}
						cursor-pointer
						`}
						onClick={() => setShowInstructions(!showInstructions)}
					>
						<h2 className="font-bold">
							{showInstructions ? "Close" : "View"} Instructions
						</h2>
					</div>
					<div
						className={`
						w-full
						${showInstructions ? "block" : "hidden"}
						py-4 px-8
						text-white
						bg-zinc-800
						rounded-b-lg
						`}
					>
						<ul className="list-inside flex flex-col gap-y-2">
							<li>
								<div className="text-sm">
									<strong>
										A session is of 55 minutes duration.
									</strong>
								</div>
							</li>
							<li>
								<strong>Code:</strong>
								<div className="text-sm">
									Course code for the course
								</div>
							</li>

							<li>
								<strong>Perc.:</strong>
								<div className="text-sm">
									Present percentage for the course
								</div>
							</li>

							<li>
								<strong>Usable ODML:</strong>
								<div className="text-sm text-pretty">
									The number of on-duty and medical leaves you
									can utilize. It is calculated as the lesser
									value between the total ODs and medical
									leaves you have and 15% of your total
									sessions, which is the maximum allowable
									limit for such leaves.
								</div>
							</li>

							<li>
								<strong>Perc. (ODML incl.):</strong>
								<div className="text-sm text-pretty">
									Present percentage for the course,
									including the ODML leaves you can utilize.
								</div>
							</li>

							<li>
								<strong>Sess. Remain:</strong>
								<div className="text-sm text-pretty">
									Remaining number of sessions left till the end
									of the semester.
								</div>
								<div className="text-sm text-pretty">
									<strong>Note:</strong> Both holidays and
									special working days have been accounted for
									in this calculation. Also, In the calculation,
									any attendance records that are not entered
									are considered as absences.
								</div>
							</li>
							<li>
								<strong>Skips Left:</strong>
								<div className="text-sm text-pretty">
									Number of sessions you can skip without
									falling below 75% attendance.
								</div>
								<div className="text-sm text-pretty">
									<strong>Note:</strong> In the calculation,
									any attendance records that are not entered
									are considered as absences.
								</div>
							</li>
							<li>
								<strong>To Hit 75%:</strong>
								<div className="text-sm text-pretty">
									Number of consecutive sessions you must
									attend to raise your current attendance
									percentage to 75%.
								</div>
								<div className="text-sm text-pretty">
									<strong>Note:</strong> Attending these
									sessions does not guarantee that you will
									maintain a 75% attendance rate. If you miss
									sessions after reaching this point, your
									attendance percentage could fall below 75%.
									Also, In the calculation, any attendance
									records that are not entered are considered as
									absences.
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
