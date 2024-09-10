import { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { LuClipboardPaste } from "react-icons/lu";

export default function CopyPaste({ data }: { data: string }) {
	const [copied, setCopied] = useState(false);
	const fallbackCopyTextToClipboard = (text: string): void => {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.left = "-9999px";
		document.body.appendChild(textarea);
		textarea.select();
		try {
			const successful = document.execCommand("copy");
			if (successful) {
				setCopied(true);
			} else {
				setCopied(false);
			}
		} catch (err) {
			setCopied(false);
		}
		document.body.removeChild(textarea);
	};
	const handleCopy = (): void => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(data)
				.then(() => {
					setCopied(true);
				})
				.catch(() => {
					fallbackCopyTextToClipboard(data);
				});
		} else {
			fallbackCopyTextToClipboard(data);
		}
		setCopied(true);
	};

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 1000);
		}
	}, [copied]);
	return (
		<div
			className={`
            w-auto h-auto
        `}
		>
			{!copied ? (
				<MdContentCopy
					className="text-black text-lg cursor-pointer"
					onClick={handleCopy}
				/>
			) : (
				<LuClipboardPaste className="text-black text-lg cursor-pointer" />
			)}
		</div>
	);
}
