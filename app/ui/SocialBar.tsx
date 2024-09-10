import { useEffect, useRef } from "react";
import { FaDiscord } from "react-icons/fa";

export default function SocialBar() {
	return (
		<div
			className={`
            w-full h-auto
            flex flex-row justify-end items-center
            `}
		>
			<div
				className={`
                w-max
                flex flex-row justify-end items-center gap-x-2
                px-4 pt-2
                rounded-bl-lg
            `}
			>
				<div
					className={`
                    flex flex-row justify-center items-center gap-x-2
                    bg-black rounded-full
					hover:bg-zinc-800
                    px-4 py-1
                    cursor-pointer
                `}
					onClick={() =>
						window.open("https://discord.gg/PfZC3bp5", "_blank")
					}
					id="discord"
				>
					<FaDiscord className="text-3xl text-white" />
					<h2 className="text-white font-bold text-lg">Support</h2>
				</div>
			</div>
		</div>
	);
}
