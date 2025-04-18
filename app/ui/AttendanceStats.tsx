import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Attendance } from "../utils/hybrid";
import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

import {
	getPercent,
	getPrettierAttendanceStats,
	getSkipsLeft,
	getSessionsRemain,
	getODMLConsidered,
	getODMLPercent,
	getSessionsToHit75,
} from "../utils/frontend";
import CopyPaste from "./CopyPaste";
import { FaAngleDown } from "react-icons/fa";

export default function AttendanceStats() {
	const config = {
		loader: { load: ["input/asciimath"] },
	};
	const { userData, error } = useSelector((state: RootState) => state.user);
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
		<MathJaxContext config={config}>
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
											{attendance.presentPercent.toFixed(
												2
											) + "%"}
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
											{attendance.odmlPercent.toFixed(2) +
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
											{getSessionsRemain(attendance)}
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
											{`${getSessionsToHit75(
												attendance
											)} (${attendance.notEntered} NE)`}
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
											{attendance.total -
												attendance.totalScheduled}
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
											{`${getSessionsToHit75(
												attendance
											)} (${attendance.notEntered} NE)`}
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
							onClick={() =>
								setShowInstructions(!showInstructions)
							}
						>
							<h2 className="font-bold">
								{showInstructions ? "Close" : "View"}{" "}
								Instructions
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
							<ul className="list-inside flex flex-col gap-y-4">
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
										Course code for the course.
									</div>
								</li>

								<li>
									<strong>Perc.:</strong>
									<div className="text-sm">
										Present percentage for the course.
									</div>
								</li>

								<li>
									<strong>Usable ODML:</strong>
									<div className="text-sm text-pretty">
										The number of on-duty and medical leaves
										you can utilize. It is calculated as the
										lesser value between the total ODs and
										medical leaves you have and 15% of your
										total sessions, which is the maximum
										allowable limit for such leaves.
									</div>
								</li>

								<li>
									<strong>Perc. (ODML incl.):</strong>
									<div className="text-sm text-pretty">
										Present percentage for the course,
										including the ODML leaves you can
										utilize.
									</div>
									<div className="text-sm text-pretty">
										<strong>Mathematically,</strong>
										<div className="text-sm text-pretty mt-2 flex flex-col bsm:flex-row">
											<MathJax className="inline">
												{
													"\\(X = \\mathrm{PresentPercent}\\)"
												}
											</MathJax>
											<MathJax className="inline bsm:ml-1">
												{
													"\\(+ \\frac{\\mathrm{ODML}}{\\mathrm{Total}} \\times 100\\)"
												}
											</MathJax>
										</div>
									</div>
								</li>

								<li>
									<strong>Sess. Remain:</strong>
									<div className="text-sm text-pretty">
										Remaining number of sessions left till
										the end of the semester.
									</div>
									<div className="text-sm text-pretty">
										<strong>Note:</strong> Both holidays and
										special working days have been accounted
										for in this calculation. Also, In the
										calculation, any attendance records that
										are not entered are considered as
										absences.
									</div>
									<div className="text-sm text-pretty">
										<strong>Mathematically,</strong>
										<div className="text-xs text-pretty mt-2 flex flex-col bsm:flex-row">
											<MathJax className="inline">
												{
													"\\(X = \\mathrm{Total} - \\mathrm{Present}\\)"
												}
											</MathJax>
											<MathJax className="inline bsm:ml-1">
												{
													"\\(- \\mathrm{Absent} - \\mathrm{NotEntered}\\)"
												}
											</MathJax>
										</div>
									</div>
								</li>
								<li>
									<strong>Skips Left:</strong>
									<div className="text-sm text-pretty">
										Number of sessions you can skip without
										falling below 75% attendance.
									</div>
									<div className="text-sm text-pretty">
										<strong>Note:</strong> In the
										calculation, any attendance records that
										are not entered are considered as
										absences.
									</div>
									<div className="text-sm text-pretty">
										<strong>Mathematically,</strong>
										<div className="text-xs text-pretty mt-2 flex flex-col bsm:flex-row">
											<MathJax className="inline">
												{
													"\\(X = \\max\\big(0, \\lfloor 0.25 \\times \\text{Total}\\)"
												}
											</MathJax>
											<MathJax className="inline bsm:ml-1">
												{
													"\\(- \\text{Absent} - \\text{NotEntered} \\rfloor\\big)\\)"
												}
											</MathJax>
										</div>
									</div>
								</li>
								<li>
									<strong>To Hit 75%:</strong>
									<div className="text-sm text-pretty">
										Number of consecutive sessions you need
										to attend to increase your current
										attendance percentage to 75%. The value
										in parentheses indicates the number of
										sessions with unrecorded attendance.
									</div>
									<div className="text-sm text-pretty">
										<strong>Note:</strong> Attending these
										sessions does not guarantee that you
										will maintain a 75% attendance rate. If
										you miss sessions after reaching this
										point, your attendance percentage could
										fall below 75%. Also, In the
										calculation, any attendance records that
										are not entered are considered as
										absences.
									</div>
									<div className="text-sm text-pretty">
										<strong>Mathematically,</strong>
										<div className="text-lg text-pretty mt-2 flex flex-col bsm:flex-row">
											<MathJax className="inline">
												{
													"\\(\\frac{\\mathrm{Present} + \\mathrm{ODML} + X}{\\mathrm{Present} + \\mathrm{Absent} + \\mathrm{NotEntered} + X}\\)"
												}
											</MathJax>
											<MathJax className="inline bsm:ml-2">
												{"\\(\\geq \\frac{3}{4}\\)"}
											</MathJax>
										</div>
										<div className="text-xs text-pretty mt-2 mb-2 flex flex-col bsm:flex-row">
											<MathJax className="inline">
												{
													"\\(X \\geq -Present + 3 \\times Absent\\)"
												}
											</MathJax>
											<MathJax className="inline bsm:ml-2">
												{
													"\\(+ 3 \\times NotEntered - 4 \\times ODML\\)"
												}
											</MathJax>
										</div>
										The calculation assumes ODML = 0. If
										ODML is to be included, the general
										formula provided above should be used.
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</MathJaxContext>
	);
}
