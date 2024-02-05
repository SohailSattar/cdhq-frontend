import React, { useEffect, useState, ChangeEvent } from "react";
import { Checkbox } from "..";
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
		{ value: string; text: string }[]
	>([]);

	useEffect(() => {
		if (!isSelectAll) {
			if (checkedValues.length === valuesArray.length) {
				setCheckedValues([]);
			}
		} else {
			const values = valuesArray.map(
				(x: { value: string; text: string }, index: number) => {
					return x;
				}
			);
			setCheckedValues(values);
		}
	}, [checkedValues.length, isSelectAll, valuesArray]);

	useEffect(() => {
		if (displayNames) {
			const computedValuesArray = Object.keys(displayNames)
				.map((key) => {
					const displayName = displayNames[key];
					return (
						displayName && {
							value: displayName.value,
							text: displayName.text,
						}
					);
				})
				.filter((value) => value !== undefined);

			setValuesArray(computedValuesArray!);
		}
	}, [displayNames]);

	const handleCheckboxChange = (
		value: [string, string],
		event: ChangeEvent<HTMLInputElement>
	) => {
		const isChecked = event.target.checked;

		setCheckedValues((prevValues: { value: string; text: string }[]) => {
			if (isChecked) {
				return [...prevValues, { value: value[0], text: value[1] }];
			} else {
				return prevValues.filter((v) => v.value !== value[0]);
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
									: checkedValues.some((obj) => obj.value === x.value)
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
