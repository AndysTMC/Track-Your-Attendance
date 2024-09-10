import { useEffect, useRef, useState } from "react";

export default function useEveryTime(
	action: () => void,
	timespan: number = 1000
) {
	const [active, setActive] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (active) {
			intervalRef.current = setInterval(() => {
				if (document.visibilityState === "visible") {
					action();
				}
			}, timespan);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [action, active, timespan]);

	return { setActive };
}
