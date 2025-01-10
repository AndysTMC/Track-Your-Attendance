import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { addOrRemoveMessage } from "@/app/redux/adminSlice";
import { MdDeleteOutline } from "react-icons/md";

export default function Messages() {
	const dispatch = useDispatch<AppDispatch>();

	const { adminData } = useSelector((state: RootState) => state.admin);

	const [messages, setMessages] = useState<string[]>([]);

	const [formData, setFormData] = useState<{ message: string }>({
		message: "",
	});

	const handleAddMessage = () => {
		if (formData.message === "") return;
		dispatch(
			addOrRemoveMessage({
				add: true,
				message: formData.message,
			})
		);
		setFormData({ message: "" });
	};
	const handleRemoveMessage = (message: string) => {
		if (message == "") return;
		dispatch(
			addOrRemoveMessage({
				add: false,
				message: message,
			})
		);
	};
	useEffect(() => {
		if (adminData && adminData.messages) {
			setMessages(adminData.messages);
		}
	}, [dispatch, adminData]);
	return (
		<div
			className={`
                w-auto h-auto
                select-none
                mx-4
            `}
		>
			<div
				className={`
                    w-max h-auto
                    text-white text-center text-base
                    font-bold
                    rounded-t-lg
                    flex gap-x-0.5 items-center
                `}
			>
				<div
					className={`
                        w-auto h-auto
                        px-2
                        bg-black
                        text-white text-center text-base
                        font-bold
                        rounded-t-lg 
                    `}
				>
					Messages
				</div>
			</div>
			<div
				className={`
                    w-full h-auto
                    bg-zinc-900
                    p-4
                    rounded-bl-lg rounded-r-lg
                    flex 
                    flex-col
                    gap-4
                `}
			>
				<div
					className={`
                        w-full
                        h-auto
                        flex
						flex-col
                        bsm:flex-row
                        gap-4
                    `}
				>
					<div
						className={`
                            w-full flex-grow
                        `}
					>
						<textarea
							placeholder="Enter Message"
							className={`
                                w-full
                                bg-transparent focus:bg-zinc-800
                                text-white text-base
                                font-bold
                                border border-zinc-500
                                rounded-lg
                                p-2
                                min-h-20
                            `}
							value={formData.message}
							onChange={(e) =>
								setFormData({
									...formData,
									message: e.target.value,
								})
							}
						></textarea>
					</div>
					<div
						className={`
                            w-max
                        `}
					>
						<button
							className={`
                            w-max
                            text-black text-base 
                            bg-zinc-50 active:bg-zinc-200
                            font-bold
                            rounded-lg
                            py-2 px-4
                            cursor-pointer
                        `}
							onClick={handleAddMessage}
						>
							Push Message
						</button>
					</div>
				</div>
                <div
					className={`
                        w-full
                        h-auto
                        gap-4
                    `}
				>
                    {messages && messages.length > 0 ? (
							messages.map((messageContent, index) => {
								return (
									<div
										key={index}
										className={`
                                            w-full
                                            h-auto
                                            flex items-center justify-evenly gap-2
                                            mb-1
                                            px-1
                                            `}
									>
										<div
											key={index}
											className={`
                                                w-full h-full
                                                p-1
                                                flex items-center justify-center
                                                border border-zinc-700
                                                text-white text-base
                                                font-bold
                                                rounded-xl
                                                my-1
                                                pointer-events-none
                                            `}
										>
											<div
												className={`
                                                    w-full
                                                    px-4 py-1
                                                    min-h-12
                                                    flex items-center
                                                    text-pretty
                                                `}
											>
												{messageContent}
											</div>
										</div>
										<div
											className={`
                                                    w-auto
                                                    h-auto
                                                    flex items-center justify-center
                                                    rounded-xl
                                                    border border-zinc-500
                                                    hover:bg-zinc-700 active:bg-zinc-600
                                                    p-4
                                                    cursor-pointer
                                                `}
											onClick={() =>
												handleRemoveMessage(messageContent)
											}
										>
											<MdDeleteOutline
												className={`
                                                    text-white
                                                    text-xl
                                                `}
											/>
										</div>
									</div>
								);
							})
						) : adminData ? (
							<div
								className={`
                                    w-full
                                    h-20
                                    flex items-center justify-center
                                    px-4
                                    bg-zinc-800
                                    text-white text-base
                                    font-bold
                                    rounded-xl
                                `}
							>
								No Messages Found
							</div>
						) : (
							<div
								className={`
                                        w-full
                                        h-20
                                        px-4
                                        bg-zinc-800
                                        rounded-xl
                                        animate-pulse
                                    `}
							></div>
						)}
                </div>
			</div>
		</div>
	);
}
