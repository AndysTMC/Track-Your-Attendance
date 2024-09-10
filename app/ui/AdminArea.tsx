import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setNavigateToAdminControl, verifyAdmin } from "../redux/adminSlice";

export default function AdminArea() {
	const dispatch = useDispatch<AppDispatch>();
	const [hoverActive, setHoverActive] = useState(false);
	const [adminPass, setAdminPass] = useState("");
	const resetAdminPass = () => {
		setAdminPass("");
		dispatch(setNavigateToAdminControl(false));
	};
	const backspaceAdminPass = () => {
		setAdminPass(adminPass.slice(0, -1));
	};
	useEffect(() => {
		if (adminPass.length == 20) {
			dispatch(verifyAdmin({ adminPass }));
		}
	}, [dispatch, adminPass]);
	return (
		<div
			className={`
                w-auto
                fixed bottom-0
                bg-neutral-800
                p-4
                rounded-t-xl
                ${hoverActive ? "opacity-100" : "opacity-25"}
                select-none
            `}
			onMouseEnter={() => setHoverActive(true)}
			onMouseLeave={() => setHoverActive(false)}
		>
			{hoverActive ? (
				<h6 className="text-neutral-200 text-center text-xs bsm:text-xs font-bold mb-2">
					Way to Admin-Control
				</h6>
			) : null}
			<div
				className={`
                w-full
                flex flex-wrap justify-center items-center gap-2
                mb-2
                `}
			>
				{Array.from({ length: 10 }).map((_, i) => {
					return (
						<React.Fragment key={i}>
							<div
								className={`
                                    w-6 h-8
                                    bg-white
                                    text-black
                                    text-center
                                    text-xs
                                    rounded-md
                                    cursor-pointer
                                    hover:bg-neutral-100
                                    active:bg-neutral-300
                                    flex justify-center items-center
                                `}
								onClick={() => setAdminPass(adminPass + i)}
							>
								{i}
							</div>
						</React.Fragment>
					);
				})}
				<div
					className={`
                    flex flex-wrap justify-center items-center gap-2
                `}
				>
					<div
						className={`
                        w-6 h-8
                        bg-white
                        text-black
                        text-center
                        text-xs
                        rounded-md
                        cursor-pointer
                        hover:bg-neutral-100
                        active:bg-neutral-300
                        flex justify-center items-center
                    `}
						onClick={resetAdminPass}
					>
						R
					</div>
					<div
						className={`
                        w-6 h-8
                        bg-white
                        text-black
                        text-center
                        text-xs
                        rounded-md
                        cursor-pointer
                        hover:bg-neutral-100
                        active:bg-neutral-300
                        flex justify-center items-center
                    `}
						onClick={backspaceAdminPass}
					>
						B
					</div>
				</div>
			</div>
		</div>
	);
}
