export default function ScheduleSCard({
	sessionNo,
	courseName,
	durationString,
	room,
	faculty,
	courseCode,
	ltpc,
}: {
	sessionNo: number;
	courseName: string;
	durationString: string;
	room: string;
	faculty: string;
	courseCode: string;
	ltpc: string;
}) {
	return (
		<div
			className={`
            w-auto h-auto
            rounded-xl
            mb-2
            flex 
            bg-zinc-200
            `}
		>
			<div
				className={`
                w-5 h-auto
                grow-0
                flex items-center justify-center
                text-ssm font-semibold text-zinc-800
                `}
			>
				{sessionNo}
			</div>
			<div
				className={`
                w-full h-auto
                p-2
                grow-1
                grid 
                grid-cols-10 gap-2
                bg-zinc-100
                rounded-r-xl
                `}
			>
				<div
					className={`
                    text-black
                    col-span-10 sm:col-span-10 bsm:col-span-5 md:col-span-4 lg:col-span-3
            `}
				>
					<div className="text-ssm">Course Name</div>
					<div className="text-xs text-pretty">{courseName}</div>
				</div>
				<div
					className={`
                    text-black
                    col-span-10 sm:col-span-6 bsm:col-span-3 md:col-span-2 lg:col-span-2
            `}
				>
					<div className="text-ssm">Duration{" (hh:mm)"}</div>
					<div className="text-xs text-pretty">{durationString}</div>
				</div>
				<div
					className={`
                    text-black
                    col-span-10 sm:col-span-4 bsm:col-span-2 md:col-span-1
            `}
				>
					<div className="text-ssm">Room</div>
					<div className="text-xs text-pretty">{room}</div>
				</div>
				<div
					className={`
                    text-black
                    col-span-10 bsm:col-span-5 md:col-span-3 lg:col-span-2
            `}
				>
					<div className="text-ssm">Faculty</div>
					<div className="text-xs text-balance">{faculty}</div>
				</div>
				<div
					className={`
                    text-black
                    col-span-10 sm:col-span-6 bsm:col-span-3 md:col-span-4 lg:col-span-1
            `}
				>
					<div className="text-ssm">Course Code</div>
					<div className="text-xs text-pretty">{courseCode}</div>
				</div>
				<div
					className={`
                    text-black
                    col-span-10 sm:col-span-4 bsm:col-span-2 md:col-span-2 lg:col-span-1
            `}
				>
					<div className="text-ssm">L-T-P-C</div>
					<div className="text-xs text-pretty">{ltpc}</div>
				</div>
			</div>
		</div>
	);
}
