"use client";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import AdminControl from "./ui/AdminControl";

export default function Page() {
	return (
		<Provider store={store}>
			<main className="w-screen h-screen bg-zinc-800 no-scrollbar overflow-y-auto">
				<AdminControl />
			</main>
		</Provider>
	);
}
