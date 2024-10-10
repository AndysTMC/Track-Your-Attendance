import { useState, useEffect, useCallback } from "react";
import { RxExit } from "react-icons/rx";
import { ImQrcode } from "react-icons/im";
import { ThreeDots } from "react-loading-icons";
import { GrDocumentUpdate } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
	scrape,
	exit,
	setFetchInProgress,
	clearLocalStorageData,
	clearError,
} from "../redux/userSlice";
import Image from "next/image";

export default function AppBar({
	backgroundDim,
	setBackgroundDim,
}: {
	backgroundDim: boolean;
	setBackgroundDim: (dim: boolean) => void;
}) {
	const dispatch = useDispatch<AppDispatch>();
	const maxRefetchCount = Number(process.env.MAX_REFETCH_COUNT || 5) ;
	const {
		userData,
		errorStatusCode,
		fetchInProgress,
	} = useSelector((state: RootState) => state.user);
	const [showQr, setShowQr] = useState(false);
	const refetchUserData = async () => {
		const regNo = localStorage.getItem("TYASRMAPREGNO") ?? null;
		const dKey = localStorage.getItem("TYASRMAPDKEY") ?? null;
		if (!regNo || !dKey) {
			handleExit();
			return;
		}
		if (userData && userData.scrapingInfo.refetchCount < 5) {
			dispatch(scrape({ regNo, password: null, dKey, refetch: true }));
		} else {
			dispatch(scrape({ regNo, password: null, dKey, refetch: false }));
		}
		
	};
	const handleRefetchClick = () => {
		if (!userData) return;
		dispatch(setFetchInProgress(true));
		refetchUserData();
	};
	const handleExit = useCallback(() => {
		dispatch(clearLocalStorageData());
		dispatch(exit());
	}, [dispatch]);
	
	useEffect(() => {
		if (
			errorStatusCode != null &&
			[400, 401, 503].includes(errorStatusCode)
		) {
			handleExit();
		}
	}, [
		dispatch,
		fetchInProgress,
		errorStatusCode,
		handleExit
	]);
	return (
		<div className="fixed w-full h-auto bottom-0 flex flex-col items-center">
			<div
				className={`
                    w-full p-2 flex items-center justify-center bg-transparent
                    `}
			>
				<div
					className={`
                        w-auto h-auto
                        bg-black 
                        rounded-lg ${!showQr ? "bsm:rounded-full" : ""}
                        flex flex-col items-center justify-center
                        select-none
                        shadow-lg shadow-zinc-700
                         overflow-y-auto
                        `}
				>
					{showQr ? (
						<div
							className={`
                                w-52 h-52 bsm:w-64 bsm:h-64
                                my-3.5 bsm:my-7 transition-all duration-500
                            `}
						>
							<Image
								src="/LTSQR.png"
								alt="QR"
								fill={false}
								layout="responsive"
								width={225}
								height={225}
							/>
						</div>
					) : null}
					{showQr ? <hr className="w-full text-white"></hr> : null}
					<div
						className={`
                        h-16 bsm:h-16 flex items-center justify-center gap-x-2 bsm:gap-x-4
                    `}
					>
						<div
							className={`
                            w-auto
                            h-12 bsm:h-12
                            px-2 
                            ms-2
                            bg-white flex text-center items-center justify-center text-black
                            rounded-lg bsm:rounded-full
                            `}
						>
							<h1
								className={`
                                font-black 
                                text-base bsm:text-lg
                                `}
							>
								TYA
							</h1>
						</div>
						<div
							className={`
                            w-auto
                            h-12 bsm:h-12
                            px-2 bsm:px-4 pt-2
                            ${
								!showQr
									? "bg-transparent hover:bg-zinc-900"
									: "bg-zinc-900"
							}
                            flex flex-col
                            items-center justify-center text-black
                            rounded-lg bsm:rounded-full
                            cursor-pointer
                            `}
							onClick={() => {
								setBackgroundDim(!backgroundDim);
								setShowQr(!showQr);
							}}
						>
							<ImQrcode
								className={`
                                text-white
                                text-lg
                                `}
							/>
							<h2 className="text-white text-ssm">Share</h2>
						</div>
						{fetchInProgress ? (
							<div
								className={`
                                w-auto
                                h-12 bsm:h-12
                                px-2 bsm:px-4 pt-2
                                bg-transparent
                                flex flex-col
                                items-center justify-center text-black
                                rounded-lg bsm:rounded-full
                                cursor-wait
                                `}
							>
								<div className="flex items-center justify-center gap-x-1 mb-0.5">
									<ThreeDots 
										className={`
											w-6
											h-4
										`}
									/>
								</div>
								<h2 className="text-white text-ssm">
									Fetching
								</h2>
							</div>
						) : (
							<div
								className={`
                                w-auto
                                h-12 bsm:h-12
                                px-2 bsm:px-4 pt-2
                                bg-transparent hover:bg-zinc-900
                                flex flex-col
                                items-center justify-center text-black
                                rounded-lg bsm:rounded-full
                                cursor-pointer
                                `}
								onClick={handleRefetchClick}
							>
								<GrDocumentUpdate
									className={`
                                    text-white
                                    text-lg
                                    `}
								/>
								<h2 className="text-white text-ssm">
									{userData && userData.scrapingInfo.refetchCount < maxRefetchCount
										? "Refetch: " + (maxRefetchCount - userData.scrapingInfo.refetchCount)
										: "\u00A0N-Fetch\u00A0"
									}
								</h2>
							</div>
						)}
						<div
							className={`
                            w-auto
                            h-12 bsm:h-11
                            px-2 bsm:px-4 pt-2
                            me-2
                            bg-transparent hover:bg-zinc-900
                            flex flex-col
                            items-center justify-center text-black
                            rounded-lg bsm:rounded-full
                            cursor-pointer
                            `}
							title="Exit"
							onClick={handleExit}
						>
							<RxExit
								className={`
                                text-white
                                text-xl
                                `}
							/>
							<h2 className="text-white text-ssm">Exit</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
