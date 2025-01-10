import { useRouter } from "next/navigation";
import { RxExit } from "react-icons/rx";
import Holidays from "./Holidays";
import SpecialWorkingDays from "./SpecialWorkingDays";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { clearAdminError, fetchAdminData } from "@/app/redux/adminSlice";
import useEveryTime from "@/app/hooks/EveryTime";
import Properties from "./Properties";
import { Snackbar } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Messages from "./Messages";

export default function AdminControl() {
	const dispatch = useDispatch<AppDispatch>();
	const {
		adminData,
		isAdminStateUpdating,
		adminError: error,
		adminErrorStatusCode: errorStatusCode,
	} = useSelector((state: RootState) => state.admin);
	const router = useRouter();
	const [isAnimating, setIsAnimating] = useState(false);
	const getAdminData = () => {
		if (!adminData) dispatch(fetchAdminData());
	};
	const { setActive: setGettingData } = useEveryTime(getAdminData, 3000);
	useEffect(() => {
		if (!adminData) setGettingData(true);
		else setGettingData(false);
	}, [adminData, setGettingData]);
	const handleExit = async () => {
		router.replace("/");
	};
	const handleClose = () => dispatch(clearAdminError());
	useEffect(() => {
		if (isAdminStateUpdating) {
			setIsAnimating(true);
			setTimeout(() => {
				setIsAnimating(false);
			}, 1000);
		}
	}, [isAdminStateUpdating]);
	return (
		<div
			className={`
            w-full h-full
            overflow-y-auto no-scrollbar
            pt-16
        `}
		>
			<div
				className={`
                w-full h-16
                bg-zinc-900
                flex items-center justify-center
                collect-bg
                text-balance
                fixed top-0 z-10
            `}
			>
				<h1
					className={`
                        text-white
                        text-lg md:text-2xl
                        font-black
                        text-balance
                    `}
				>
					TYA Admin-Control
				</h1>
				<div
					className={`
                            absolute right-4
                        `}
				>
					<RxExit
						className={`
                                text-white
                                text-xl
                                cursor-pointer
                            `}
						onClick={handleExit}
					/>
				</div>
			</div>
			<div
				className={`
                w-auto h-auto
                flex flex-col gap-y-4
                py-4
            `}
			>
				<Holidays />
				<SpecialWorkingDays />
				<Properties />
				<Messages />
			</div>

			<AnimatePresence>
				{isAnimating && (
					<motion.div
						className="w-full py-1 bg-white flex items-center justify-center text-balance fixed bottom-0 z-10 pointer-events-none"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.5 }}
						style={{
							visibility: isAnimating ? "visible" : "hidden",
						}}
					>
						<p className="text-black text-sm font-black text-balance">
							•••Updating Information•••
						</p>
					</motion.div>
				)}
			</AnimatePresence>
			<Snackbar
				open={error != null}
				autoHideDuration={5000}
				onClose={handleClose}
				message={error}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				color="white"
			/>
		</div>
	);
}
