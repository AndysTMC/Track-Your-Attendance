import { teko } from "@/app/fonts";

export default function Page() {
	return (
		<main
			className={`
            w-screen h-screen overflow-y-auto
            bg-white
            px-4 bsm:px-24 md:px-36 lg:px-48 xl:px-60 2xl:px-72
            pt-20
            pb-10
            font-${teko}
            no-scrollbar
        `}
		>
			<div
				className={`
                h-auto w-full
                flex flex-col justify-start
                rounded-r-full
            `}
			>
				<div
					className={`
                    text-3xl bsm:text-4xl md:text-5xl 
                    text-black
                    font-bold
                    mb-4
                `}
				>
					Privacy Policy
				</div>
				<div
					className={`
                    h-auto w-full
                `}
				>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						1. Introduction
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						This Privacy Policy explains how TYA collects, uses, and
						protects your personal information. By using TYA, you
						consent to the data practices described in this policy.
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						2. Information We Collect
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-10
                        mb-2
                    `}
					>
						<ul className={`ml-5`}>
							<li className="list-disc">
								<span className="font-bold">
									From SRM-AP Academic Portal:
								</span>
								<ul className={`ml-5`}>
									<li className={`list-disc`}>
										Student Personal Information: Name,
										Registration Number, Academic year,
										Institution, Semester, Program, Section,
										Date of Birth, Gender.
									</li>
									<li className={`list-disc`}>
										Time Table: Schedule of classes from
										Monday to Sunday, 9 AM to 5:30 PM.
									</li>
									<li className={`list-disc`}>
										Courses: Course Code, Course Name,
										L-T-P-C, Faculty Name, Classroom Name.
									</li>
									<li className={"list-disc"}>
										Attendance: Presents, Absents, Total
										Scheduled, Attendance Not Entered, OD/ML
										Taken.
									</li>
								</ul>
							</li>
							<li className="list-disc">
								<span className="font-bold">
									From Amended Academic Calendar:
								</span>
								<ul className={`ml-5`}>
									<li className="list-disc">
										Semester Start and End Dates
									</li>
									<li className="list-disc">Holidays</li>
									<li className="list-disc">
										Other relevant academic dates
									</li>
								</ul>
							</li>
						</ul>
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						3. How We Collect Information
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						<ul className={`ml-5`}>
							<li className="list-disc">
								<span className="font-bold">
									Automated Mechanism:
								</span>{" "}
								We use an automated mechanism to collect
								information from the SRM-AP academic portal. We
								do not publicly disclose the specifics of this
								mechanism.
							</li>
							<li className="list-disc">
								<span className="font-bold">
									Amended Academic Calendar:
								</span>{" "}
								We obtain the Amended Academic Calendar directly
								from SRM University-AP.
							</li>
						</ul>
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						4. How We Use Information
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						<ul className={`ml-5`}>
							<li className="list-disc">
								<span className="font-bold">
									Personal Information:
								</span>{" "}
								We use your personal information for
								verification purposes to ensure the data
								displayed in the app is relevant to you.
							</li>
							<li className="list-disc">
								<span className="font-bold">Time Table:</span>{" "}
								We use your time table information to display
								ongoing sessions, upcoming sessions, and your
								daily schedule in an interactive manner.
							</li>
							<li className="list-disc">
								<span className="font-bold">Attendance:</span>{" "}
								We use your attendance data to calculate and
								display important metrics such as present
								percentage.
							</li>
						</ul>
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						5. Data Sharing
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						We do not share your personal information with any third
						parties. All data is stored securely in our database.
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						6. Data Storage and Security
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						<ul className={`ml-5`}>
							<li className="list-disc">
								<span className="font-bold">Database:</span> We
								maintain a dedicated database to store all
								collected data.
							</li>
							<li className="list-disc">
								<span className="font-bold">Encryption:</span>{" "}
								We store your SRM-AP credentials in an encrypted
								format.
							</li>
							<li className="list-disc">
								<span className="font-bold">
									Enhanced Protection:
								</span>{" "}
								We are committed to implementing additional user
								data protection measures in the future
							</li>
						</ul>
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						7. Your Rights
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						<ul className={`ml-5`}>
							<li className="list-disc">
								<span className="font-bold">Access:</span> You
								have the right to access the data displayed in
								the app, which is sourced from the SRM-AP
								academic portal and the Amended Academic
								Calendar.
							</li>
							<li className="list-disc">
								<span className="font-bold">Contact:</span> You
								can reach out to us via the{" "}
								<a
									href="https://discord.gg/RDC3bZbZKc"
									className="text-black underline font-bold"
									target="_blank"
								>
									TYA Support Discord server
								</a>{" "}
								for any privacy-related inquiries.
							</li>
						</ul>
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        font-bold
                        mb-1
                    `}
					>
						8. Changes to this Privacy Policy
					</div>
					<div
						className={`
                        h-auto w-auto
                        text-base bsm:text-lg md:text-xl
                        text-black
                        text-pretty
                        ml-5
                        mb-2
                    `}
					>
						We may update this Privacy Policy from time to time. We
						will notify you of any significant changes through the
						app or other communication channels.
					</div>
				</div>
			</div>
		</main>
	);
}
