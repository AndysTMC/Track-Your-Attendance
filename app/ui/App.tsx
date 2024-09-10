import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import Collect from "./Collect";
import Display from "./Display";

export default function App() {
	const dispatch = useDispatch<AppDispatch>();
	const { inQueue, userData, error } = useSelector(
		(state: RootState) => state.user
	);

	if (userData) {
		return <Display />;
	} else {
		return <Collect />;
	}
}
