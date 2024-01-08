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
	onPropertyChange: (checkedValues: string[]) => void;
	isSelectAll: boolean;
}

const CheckBoxSelections = <T extends Record<string, any>>({
	displayNames,
	onPropertyChange,
	isSelectAll,
}: Props<T>) => {
	const [valuesArray, setValuesArray] = useState<any>([]);
	const [checkedValues, setCheckedValues] = useState<string[]>([]);

	useEffect(() => {
		if (!isSelectAll) {
			setCheckedValues([]);
		} else {
			const values = valuesArray.map(
				(x: { value: string; text: string }, index: number) => {
					return x.value;
				}
			);
			setCheckedValues(values);
		}
	}, [isSelectAll, valuesArray]);

	useEffect(() => {
		const computedValuesArray = Object.keys(displayNames)
			.map((key) => {
				const displayName = displayNames[key];
				return (
					displayName && { value: displayName.value, text: displayName.text }
				);
			})
			.filter((value) => value !== undefined);

		setValuesArray(computedValuesArray!);
	}, [displayNames]);

	const handleCheckboxChange = (
		value: string,
		event: ChangeEvent<HTMLInputElement>
	) => {
		const isChecked = event.target.checked;

		setCheckedValues((prevValues) => {
			if (isChecked) {
				return [...prevValues, value];
			} else {
				return prevValues.filter((v) => v !== value);
			}
		});
	};

	useEffect(() => {
		console.log(checkedValues);
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
							checked={isSelectAll ? true : checkedValues.includes(x.value)}
							onChange={(event) => handleCheckboxChange(x.value, event)}
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

// NEW
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
// 				{valuesArray.map(
// 					(x: { value: string; text: string }, index: number) => (
// 						<>
// 							<div
// 								key={x.value}
// 								className="checkbox-item"
// 								style={{ width: "calc(25% - 10px)", marginBottom: "10px" }}>
// 								<Checkbox
// 									label={x.text}
// 									checked={checkedValues.includes(x.value)}
// 									onChange={(event) => handleCheckboxChange(x.value, event)}
// 								/>
// 							</div>
// 							{index !== 0 && (index + 1) % 4 === 0 && (
// 								<div
// 									key={`divider-${index}`}
// 									style={{ width: "100%", height: "0" }}
// 								/>
// 							)}
// 						</>
// 						//   {index !== 0 && (index + 1) % 4 === 0 && (
// 						//     <div key={`divider-${index}`} style={{ width: "100%", height: "0" }} />
// 						//   )}
// 					)
// 				)}
// 			</div>
// 		</ShadowedContainer>
// 	);
// };

// export default CheckBoxSelections;
