import { FC, useCallback, useEffect, useMemo, useState } from "react";

import styles from "./styles.module.scss";
import { APICount } from "../../api/visistors/types";
import { getVisitorsCounter } from "../../api/visistors/get/getVisitorsCounter";
import React from "react";

interface Props {
	initialCounter: APICount;
}

const Counter: FC<Props> = ({ initialCounter }) => {
	const [counter, setCounter] = useState<APICount>();

	const retrieveVisitorCount = useCallback(async () => {
		try {
			const { data } = await getVisitorsCounter();
			setCounter(data);
		} catch (error) {
			console.error("Error fetching visitor counter:", error);
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			retrieveVisitorCount();
		}, 1000); // Adjust the delay time as needed (in milliseconds)

		return () => clearTimeout(timeoutId);
	}, [retrieveVisitorCount]);

	// Convert the count to an array of individual digits
	const countDigits = Array.from(String(counter?.count || 0), Number);

	return (
		<div className={styles.visitorCounter}>
			{/* <h2>Page Visitor Counter</h2> */}
			<div className={styles.counter}>
				{countDigits.map((digit, index) => (
					<div
						key={index}
						className={styles.digitBox}>
						{digit}
					</div>
				))}
			</div>
		</div>
	);
};

export default React.memo(Counter);
