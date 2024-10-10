import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { Course } from "../utils/hybrid";
import React from "react";
import CopyPaste from "./CopyPaste";
import { getPrettierCoursesOverview } from "../utils/frontend";

export default function CoursesDB() {
	const { userData, error } = useSelector(
		(state: RootState) => state.user
	);
	const [coursesDetails, setCoursesDetails] = useState<Course[]>([]);
	useEffect(() => {
		if (userData) {
			setCoursesDetails(userData.courses);
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
					Courses Overview
				</div>
				<CopyPaste
					data={getPrettierCoursesOverview(userData!.courses)}
				/>
			</div>
			<div
				className={`
            w-full h-auto
            bg-white
            p-4
            rounded-bl-lg rounded-r-lg
        `}
			>
				<div
					className={`
                w-full 
                ${
					coursesDetails && coursesDetails.length > 3
						? "h-96 bsm:h-52 overflow-y-auto no-scrollbar"
						: "h-auto"
				}
                rounded-xl
                flex flex-col gap-2
                border-t-2 border-b-2 border-zinc-300
                `}
				>
					{coursesDetails.map((course, index) => {
						return (
							<React.Fragment key={index}>
								<div
									className={`
                                        w-full h-auto
                                        p-2
                                        grow-1
                                        grid 
                                        grid-cols-10 gap-2
                                        bg-zinc-200
                                        rounded-xl
                                        text-zinc-800
                                        `}
								>
									<div
										className={`
                                            col-span-10 sm:col-span-3 bsm:col-span-2 md:col-span-1
                                    `}
									>
										<div className="text-ssm">Code</div>
										<div className="text-xs text-pretty font-bold">
											{course.code}
										</div>
									</div>
									<div
										className={`
                                            col-span-10 sm:col-span-7 bsm:col-span-4 md:col-span-3
                                    `}
									>
										<div className="text-ssm">Name</div>
										<div className="text-xs text-pretty font-bold">
											{course.name}
										</div>
									</div>
									<div
										className={`
                                            col-span-10 sm:col-span-10 bsm:col-span-4 md:col-span-2
                                    `}
									>
										<div className="text-ssm">Faculty</div>
										<div className="text-xs text-balance font-bold">
											{course.faculty}
										</div>
									</div>
									<div
										className={`
                                            col-span-10 sm:col-span-2 md:col-span-1
                                    `}
									>
										<div className="text-ssm">Lectures</div>
										<div className="text-xs text-pretty font-bold">
											{course.ltpc.split("-")[0]}
										</div>
									</div>
									<div
										className={`
                                            col-span-10 sm:col-span-2 md:col-span-1
                                    `}
									>
										<div className="text-ssm">
											Tutorials
										</div>
										<div className="text-xs text-pretty font-bold">
											{course.ltpc.split("-")[1]}
										</div>
									</div>
									<div
										className={`
                                            col-span-10 sm:col-span-2 md:col-span-1
                                    `}
									>
										<div className="text-ssm">
											Practicals
										</div>
										<div className="text-xs text-pretty font-bold">
											{course.ltpc.split("-")[2]}
										</div>
									</div>
									<div
										className={`
                                            col-span-10 sm:col-span-2 md:col-span-1
                                    `}
									>
										<div className="text-ssm">Credits</div>
										<div className="text-xs text-pretty font-bold">
											{course.ltpc.split("-")[3]}
										</div>
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</div>
				{coursesDetails && coursesDetails.length > 3 ? (
					<div
						className={`
                                    w-full h-auto
                                    text-center text-xs
                                    text-zinc-600 font-bold
                                    mt-4
                                `}
					>
						Scroll inside to view more
					</div>
				) : null}
			</div>
		</div>
	);
}
