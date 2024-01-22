// import React, { useEffect, useState, ChangeEvent } from "react";
// import { Checkbox, ShadowedContainer } from "..";
// import { PropertyDisplayNames } from "../../api";

// import "./styles.css";

// interface Props<T> {
// 	displayNames: PropertyDisplayNames<T>;
// 	onPropertyChange: (checkedValues: string[]) => void;
// }

// const CheckBoxSelections = <T extends Record<string, any>>({
// 	displayNames,
// 	onPropertyChange,
// }: Props<T>) => {
// 	const [valuesArray, setValuesArray] = useState<any>([]);
// 	const [checkedValues, setCheckedValues] = useState<string[]>([]);

// 	useEffect(() => {
// 		const computedValuesArray = Object.keys(displayNames)
// 			.map((key) => {
// 				const displayName = displayNames[key];
// 				return (
// 					displayName && { value: displayName.value, text: displayName.text }
// 				);
// 			})
// 			.filter((value) => value !== undefined);

// 		setValuesArray(computedValuesArray!);
// 	}, [displayNames]);

// 	const handleCheckboxChange = (
// 		value: string,
// 		event: ChangeEvent<HTMLInputElement>
// 	) => {
// 		const isChecked = event.target.checked;

// 		setCheckedValues((prevValues) => {
// 			if (isChecked) {
// 				return [...prevValues, value];
// 			} else {
// 				return prevValues.filter((v) => v !== value);
// 			}
// 		});
// 	};

// 	useEffect(() => {
// 		onPropertyChange(checkedValues);
// 	}, [checkedValues, onPropertyChange]);

// 	return (
// 		<ShadowedContainer>
// 			<div className="checkbox-container">
// 				{valuesArray.map((x: { value: string; text: string }) => (
// 					<div
// 						key={x.value}
// 						className="checkbox-item">
// 						<Checkbox
// 							label={x.text}
// 							checked={checkedValues.includes(x.value)}
// 							onChange={(event) => handleCheckboxChange(x.value, event)}
// 						/>
// 					</div>
// 				))}
// 			</div>
// 		</ShadowedContainer>
// 	);
// };

// export default CheckBoxSelections;

/// UNCOMMENT
import React, { useEffect, useState, ChangeEvent } from "react";
import { Checkbox, ShadowedContainer } from "..";
import { PropertyDisplayNames } from "../../api";

import "./styles.css";

interface Props<T> {
	displayNames: PropertyDisplayNames<T>;
	onPropertyChange: (checkedValues: { [key: string]: string }[]) => void;
	isSelectAll: boolean;
}

const CheckBoxSelections = <T extends Record<string, any>>({
	displayNames,
	onPropertyChange,
	isSelectAll,
}: Props<T>) => {
	const [valuesArray, setValuesArray] = useState<any>([]);
	const [checkedValues, setCheckedValues] = useState<
		{ [key: string]: string }[]
	>([]);

	useEffect(() => {
		if (!isSelectAll) {
			setCheckedValues([]);
		} else {
			const values = valuesArray.map(
				(x: { value: string; text: string }, index: number) => {
					return x;
				}
			);
			console.log(values);
			setCheckedValues(values);
		}
	}, [isSelectAll, valuesArray]);

	// console.log(checkedValues);

	useEffect(() => {
		const computedValuesArray = Object.keys(displayNames)
			.map((key) => {
				const displayName = displayNames[key];
				return (
					displayName && { value: displayName.value, text: displayName.text }
				);
			})
			.filter((value) => value !== undefined);

		console.log(computedValuesArray);
		setValuesArray(computedValuesArray!);
	}, [displayNames]);

	const handleCheckboxChange = (
		value: [string, string],
		event: ChangeEvent<HTMLInputElement>
	) => {
		const isChecked = event.target.checked;

		console.log(value, isChecked);

		setCheckedValues((prevValues: { [key: string]: string }[]) => {
			if (isChecked) {
				return [...prevValues, { [value[0]]: value[1] }];
			} else {
				console.log(prevValues.filter((v) => Object.keys(v)[0] !== value[0]));
				console.log(prevValues);

				return prevValues.filter((v) => Object.keys(v)[0] !== value[0]);
			}
		});
		// setCheckedValues((prevValues: { [key: string]: string }[]) => {

		// });
	};

	// console.log(checkedValues);

	useEffect(() => {
		onPropertyChange(checkedValues);
	}, [checkedValues, onPropertyChange]);

	return (
		<div className="checkbox-container">
			{valuesArray.map((x: { value: string; text: string }, index: number) => (
				<React.Fragment key={x.value}>
					<div
						className="checkbox-item"
						// style={{ width: "calc(25% - 10px)", marginBottom: "10px" }}
					>
						<Checkbox
							label={x.text}
							checked={
								isSelectAll
									? true
									: checkedValues.some((obj) => Object.keys(obj)[0] === x.value)
							}
							onChange={(event) =>
								handleCheckboxChange([x.value, x.text], event)
							}
						/>
					</div>
					{/* {(index + 1) % 4 === 0 && (
								<div
									key={`divider-${index}`}
									style={{ width: "100%", height: "0" }}
								/>
							)} */}
				</React.Fragment>
			))}
		</div>
	);
};

export default CheckBoxSelections;
