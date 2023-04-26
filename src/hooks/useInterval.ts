import { useEffect, useRef } from "react";

export const useInterval = (callback: any, delay: any) => {
	const intervalRef = useRef<any>();
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (typeof delay === "number") {
			intervalRef.current = window.setInterval(
				() => callbackRef.current(),
				delay
			);

			// Clear interval if the components is unmounted or the delay changes:
			return () => window.clearInterval(intervalRef.current);
		}
	}, [delay]);

	return intervalRef;
};
