import { useEffect, useState } from "react";
import { MdOutlineDownload } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";

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

export default function CollectTopBar() {
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

	return (
		<div className="fixed w-full h-auto top-0 flex flex-row justify-end items-center py-4 gap-x-2 px-2">
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
					`}
					onClick={handleInstallClick}
				>
					<h2 className={`text-base bsm:text-lg font-bold`}>
						Download App
					</h2>
					<MdOutlineDownload className={`text-base bsm:text-lg`} />
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
					shadow-lg hover:shadow-neutral-500
                `}
				onClick={() =>
					window.open("https://discord.gg/RDC3bZbZKc", "_blank")
				}
				id="discord"
			>
				<FaDiscord className="text-base bsm:text-2xl" />
				<h2 className="font-bold text-base bsm:text-lg">Support</h2>
			</div>
		</div>
	);
}
