import { useEffect, useState } from "react";
import { MdOutlineDownload } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import { AppDispatch, RootState } from "../redux/store";
import { getMessages } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

declare global {
	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}
}

export default function CollectTopBar({
	showAnnouncements,
	setShowAnnouncements,
}: {
	showAnnouncements: boolean;
	setShowAnnouncements: (show: boolean) => void;
}) {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			const promptEvent = e as BeforeInstallPromptEvent;
			setDeferredPrompt(promptEvent);
		};
		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt
		);
		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
		};
	}, []);

	const handleInstallClick = () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then((choiceResult: any) => {
				setDeferredPrompt(null);
			});
		}
	};

	const { messages = [], messagesReceived } = useSelector(
		(state: RootState) => state.user
	);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!messagesReceived) {
			dispatch(getMessages());
		}
	}, [dispatch, messagesReceived]);

	return (
		<div
			className={`fixed w-full ${
				showAnnouncements ? "h-2/3" : "h-max"
			} top-0 justify-end items-center opacity-100`}
		>
			<div className="flex flex-row flex-wrap gap-x-2 gap-y-2 justify-end items-center py-4 px-2">
				{deferredPrompt ? (
					<div
						className={`
					w-auto
					flex flex-row items-center justify-center gap-x-2
					bg-white
					text-black
					rounded-full
					py-1 px-4
					shadow-lg hover:shadow-neutral-500
					cursor-pointer
					${showAnnouncements ? "opacity-5" : "opacity-100"}
					`}
						onClick={handleInstallClick}
					>
						<h2 className={`text-base bsm:text-lg font-bold`}>
							Download App
						</h2>
						<MdOutlineDownload
							className={`text-base bsm:text-lg`}
						/>
					</div>
				) : null}
				<div
					className={`
                    flex flex-row justify-center items-center gap-x-2
                    bg-white
					text-black
					rounded-full
					py-1 px-4
                    cursor-pointer
					select-none
					shadow-lg hover:shadow-neutral-500
					${showAnnouncements ? "opacity-5" : "opacity-100"}
                `}
					onClick={() =>
						window.open("https://discord.gg/RDC3bZbZKc", "_blank")
					}
					id="discord"
				>
					<FaDiscord className="text-base bsm:text-2xl" />
					<h2 className="font-bold text-base bsm:text-lg">Support</h2>
				</div>
				{messages.length > 0 ? (
					<div
						className={`
                    flex flex-row justify-center items-center gap-x-2
					bg-white
                    ${showAnnouncements ? "opacity-75" : "opacity-100"}
					text-black
					rounded-full
					py-1 px-4
                    cursor-pointer
					select-none
					shadow-lg hover:shadow-neutral-500
                `}
						onClick={() => setShowAnnouncements(!showAnnouncements)}
						id="announcements"
					>
						<TfiAnnouncement className="text-base bsm:text-2xl" />
						<h2 className="font-bold text-base bsm:text-lg">
							Announcements
						</h2>
					</div>
				) : null}
			</div>
			<div className="w-full h-full flex flex-row justify-end py-2 px-2">
				{showAnnouncements ? (
					<div
						className={`
				w-full md:w-4/5 lg:w-3/5 xl:w-1/2
				max-h-full
				h-max
				bg-transparent
				rounded-lg
				shadow-lg
				border-2 border-zinc-600
				overflow-y-auto
				thin-scrollbar
			`}
					>
						<AnimatePresence>
							{messages.map((message, index) => (
								<motion.div
									key={message + index}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{
										duration: 0.25,
										delay: index * 0.1,
									}}
									className={`
							flex flex-col gap-y-2
							px-4 py-2
							bg-zinc-800
							mb-1
						`}
								>
									<p className="text-base text-white">
										{message}
									</p>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				) : null}
			</div>
		</div>
	);
}
