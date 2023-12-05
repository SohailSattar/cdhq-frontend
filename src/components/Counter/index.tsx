import { FC, useCallback, useEffect, useMemo, useState } from "react";

import styles from "./styles.module.scss";
import { APICount } from "../../api/visistors/types";
import { getVisitorsCounter } from "../../api/visistors/get/getVisitorsCounter";
import React from "react";

interface Props {}

const Counter: FC<Props> = ({}) => {
	const [counter, setCounter] = useState<APICount | undefined>(undefined);

	const fetchCount = useCallback(async () => {
		const { data } = await getVisitorsCounter();
		if (data) {
			setCounter(data);
		}
	}, []);

	useEffect(() => {
		fetchCount();
	}, []);

	// useEffect(() => {
	// 	// Simulate a page visit by incrementing the count on component mount
	// 	setCount((prevCount) => prevCount + 1);
	// }, []);

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
