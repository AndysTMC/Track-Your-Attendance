import { useEffect, useState } from "react";
import { MdOutlineDownload } from "react-icons/md";

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

export default function DownloadApp() {
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
		<div className="fixed w-full h-auto top-0 flex flex-col items-center py-4">
			{deferredPrompt ? (
				<div
					className={`
          w-auto absolute right-4
          flex flex-row items-center justify-center gap-x-2
          bg-white
          text-black
          rounded-full
          py-1 px-4
          shadow-lg hover:shadow-neutral-400
          cursor-pointer
        `}
					onClick={handleInstallClick}
				>
					<h2 className={`text-base bsm:text-xl font-bold`}>
						Download App
					</h2>
					<MdOutlineDownload className={`text-lg bsm:text-2xl`} />
				</div>
			) : null}
		</div>
	);
}
