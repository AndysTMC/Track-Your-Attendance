import { useState, useEffect, useCallback } from "react";
import { teko } from "../fonts";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "../redux/store";
import {
	clearError,
	clearLocalStorageData,
	exit,
	getMessages,
	scrape,
	setData,
	setError,
	setFetchInProgress,
} from "../redux/userSlice";
import { BsFillPeopleFill } from "react-icons/bs";
import { UserData, generateChecksum } from "@/app/utils/hybrid";
import axios from "axios";
import { FaCircleCheck } from "react-icons/fa6";
import Snackbar from "@mui/material/Snackbar";
import AdminArea from "./AdminArea";
import { setNavigateToAdminControl } from "../redux/adminSlice";
import CollectTopBar from "./CollectTopBar";
import useEveryTime from "../hooks/EveryTime";
import { BsInfo } from "react-icons/bs";
import Link from "next/link";
import { ThreeDots } from "react-loading-icons";

const getDataLocal = async (): Promise<Object | null> => {
	try {
		let userDataLocalString: string | null =
			localStorage.getItem("TYASRMAPUDATA") ?? null;
		let regNo: string | null =
			localStorage.getItem("TYASRMAPREGNO") ?? null;
		let holidaysString = localStorage.getItem("TYASRMAPHDATA") ?? null;
		let specialWorkingDaysString =
			localStorage.getItem("TYASRMAPSWDATA") ?? null;
		if (
			userDataLocalString &&
			regNo &&
			holidaysString &&
			specialWorkingDaysString
		) {
			let userData = JSON.parse(userDataLocalString);
			let holidays = JSON.parse(holidaysString);
			let specialWorkingDays = JSON.parse(specialWorkingDaysString);
			let checksum = generateChecksum(
				JSON.stringify({ userData, holidays, specialWorkingDays })
			);
			let response = await axios.post(
				"/api/verify",
				{ regNo, checksum },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.data.isValid) {
				return { userData, holidays, specialWorkingDays };
			}
		}
		return null;
	} catch (err: any) {
		return null;
	}
};

export default function Collect() {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { userData, error, errorStatusCode, fetchInProgress } = useSelector(
		(state: RootState) => state.user
	);
	const { adminError, adminErrorStatusCode, navigateToAdminControl } =
		useSelector((state: RootState) => state.admin);
	const [regNo, setRegNo] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState("verify");
	const handleClose = () => dispatch(clearError());

	const [showAnnouncements, setShowAnnouncements] = useState(false);

	// const fetchUserData = async () => {
	// 	let dKey = localStorage.getItem("TYASRMAPDKEY") ?? null;
	// 	if (
	// 		userData ||
	// 		(errorStatusCode && [400, 401, 500, 503].includes(errorStatusCode))
	// 	) {
	// 		setMode("normal");
	// 		dispatch(clearLocalStorageData());
	// 		dispatch(clearError());
	// 	} else {
	// 		if (dKey == null || errorStatusCode == 200) {
	// 			dispatch(
	// 				scrape({ regNo, password, dKey: null, refetch: false })
	// 			);
	// 		} else {
	// 			dispatch(
	// 				scrape({ regNo, password: null, dKey, refetch: false })
	// 			);
	// 		}
	// 	}
	// };

	const fetchUserData = useCallback(async () => {
		let dKey = localStorage.getItem("TYASRMAPDKEY") ?? null;
		if (
			userData ||
			(errorStatusCode && [400, 401, 500, 503].includes(errorStatusCode))
		) {
			setMode("normal");
			dispatch(clearLocalStorageData());
			dispatch(clearError());
		} else {
			if (dKey == null || errorStatusCode == 200) {
				dispatch(
					scrape({ regNo, password, dKey: null, refetch: false })
				);
			} else {
				dispatch(
					scrape({ regNo, password: null, dKey, refetch: false })
				);
			}
		}
	}, [userData, errorStatusCode, regNo, password, dispatch]);

	useEffect(() => {
		if (navigateToAdminControl && mode == "normal") {
			router.replace("/admin");
		}
	}, [navigateToAdminControl, router, mode]);

	useEffect(() => {
		if (mode === "verify") {
			dispatch(setNavigateToAdminControl(false));
			const verifyUserData = async () => {
				const dataLocal = await getDataLocal();
				if (dataLocal) {
					dispatch(setData(dataLocal));
				} else {
					setMode("normal");
					dispatch(clearLocalStorageData());
				}
			};
			verifyUserData();
		}
	}, [dispatch, mode, userData, error]);

	useEffect(() => {
		if (fetchInProgress) {
			setMode("fetch");
			fetchUserData();
		}
		if (
			errorStatusCode !== null &&
			[400, 401, 500, 503].includes(errorStatusCode)
		) {
			setMode("normal");
		}
	}, [fetchInProgress, errorStatusCode, fetchUserData]);

	const validateUsername = (username: string): boolean => {
		if (username.length < 12)
			throw new Error("Registration Number is too short");
		if (!username.startsWith("AP"))
			throw new Error("Registration Number should start with AP");
		return true;
	};

	const validatePassword = (password: string): boolean => {
		if (password.length < 8) throw new Error("Password is too short");
		return true;
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			validateUsername(regNo);
			validatePassword(password);
		} catch (err: any) {
			dispatch(setError(err.message));
			return;
		}
		dispatch(setFetchInProgress(true));
	};

	return (
		<div
			className={`w-full h-full min-h-max flex flex-col items-center justify-center ${showAnnouncements ? 'bg-black' : 'collect-bg'} overflow-hidden`}
		>
			{mode != "verify" ? (
				<CollectTopBar
					showAnnouncements={showAnnouncements}
					setShowAnnouncements={setShowAnnouncements}
				/>
			) : null}
			<div
				className={`
                        max-h-full overflow-y-auto
                        w-9/12 bsm:w-7/12 lg:w-5/12 xl:w-4/12
                        rounded-lg
                        flex flex-col items-center justify-start
                        select-none
                        py-20
                        no-scrollbar
						${showAnnouncements ? "pointer-events-none opacity-5" : "pointer-events-auto"}
                `}
			>
				<div className="w-full flex items-center justify-center p-4">
					<h1
						className={`
                        w-full text-center text-white
                        text-5xl bsm:text-6xl font-bold
                        ${teko.className}
                    `}
					>
						TYA
					</h1>
				</div>

				<hr className="w-11/12 border-gray-300 dark:border-gray-700" />
				{mode == "normal" ? (
					<form
						onSubmit={(e) => handleSubmit(e)}
						className="w-full px-8 bsm:px-14 md:px-20 py-3 flex flex-col items-center gap-y-4"
					>
						<div className="w-full">
							<label
								htmlFor="username"
								className={`
                            block text-sm text-gray-500 light:text-gray-300 select-none
                        `}
							>
								Registration No.
							</label>
							<input
								type="text"
								value={regNo}
								onChange={(e) => setRegNo(e.target.value)}
								placeholder="APXXXXXXXXXXX"
								autoComplete="username"
								className={`
                                block mt-2 w-full
                                placeholder-gray-500/50
                                rounded-lg border border-gray-400 
                                bg-white 
                                text-sm bsm:text-base
                                px-5 py-2.5
                                text-gray-600
                                focus:outline-none focus:outline-transparent
                                focus:border-gray-200 
                                focus:ring focus:ring-gray-300 focus:ring-opacity-45
                                transition-all
                        `}
							/>
						</div>

						<div className="w-full">
							<label
								htmlFor="password"
								className={`
                            block text-sm text-gray-500 light:text-gray-300 select-none
                        `}
							>
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="******"
								autoComplete="current-password"
								className={`
                                block mt-2 w-full
                                placeholder-gray-500/50
                                rounded-lg border border-gray-400 
                                bg-white 
                                text-sm bsm:text-base
                                px-5 py-2.5
                                text-gray-600
                                focus:outline-none focus:outline-transparent
                                focus:border-gray-200 
                                focus:ring focus:ring-gray-300 focus:ring-opacity-45
                                transition-all
                        `}
							/>
						</div>
						<div
							className={`
                            italic text-xs text-gray-500
                            flex items-start justify-center
                            gap-x-2
                            `}
						>
							<div
								className={`
                                    w-4 h-4 bg-white rounded-full
                                    flex items-center justify-center
                                `}
							>
								<BsInfo className="w-4 h-4" />
							</div>
							<div>
								{
									"Use the same credentials you use to login to SRMAP's Parent Portal"
								}
							</div>
						</div>
						<div
							className={`
                            text-xs text-gray-500
                            `}
						>
							{"By continuing, you acknowledge and accept our "}
							<Link
								href="/terms-of-service"
								className={`
                                text-gray-100 hover:text-gray-300
                                `}
							>
								{"Terms of Service "}
							</Link>
							and
							<Link
								href="/privacy-policy"
								className={`
                                text-gray-100 hover:text-gray-300
                                `}
							>
								{" Privacy Policy"}
							</Link>
							.
						</div>
						<button
							className={`
                        w-24 h-10
                        bg-white 
                        hover:outline hover:outline-gray-800 hover:outline-4
                        active:scale-95 transition-all
                        text-black
                        rounded-full
                        font-bold
                        select-none
                        cursor-pointer
                    `}
						>
							Track
						</button>
					</form>
				) : mode == "fetch" ? (
					<div className="w-full p-2 bsm:p-8 flex flex-row items-center justify-center text-base text-white bsm:text-xl gap-x-2 select-none">
						<div className="h-10 flex flex-row items-center gap-x-2 animate-pulse">
							<ThreeDots
								stroke="#98ff98"
								strokeOpacity={0.125}
								speed={0.75}
								className={`
									w-8 bsm:w-10
									h-8 bsm:h-10
								`}
							/>
						</div>
						<h3>Fetching</h3>
					</div>
				) : mode == "verify" ? (
					<div className="w-full p-8 flex flex-row items-center justify-center text-xl text-white gap-x-2 select-none">
						<FaCircleCheck className="w-5 h-5" />
						<h3>Verifying</h3>
					</div>
				) : null}
			</div>
			<Snackbar
				open={
					error != null &&
					errorStatusCode != null &&
					[400, 401, 500, 503].includes(errorStatusCode)
				}
				autoHideDuration={5000}
				onClose={handleClose}
				message={error}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				color="white"
			/>
			{mode == "normal" ? <AdminArea showAnnouncements={showAnnouncements} /> : null}
		</div>
	);
}
