import {
	FC,
	JSXElementConstructor,
	ReactElement,
	useCallback,
	useMemo,
} from "react";
import clsx from "clsx";

import Select, {
	CommonProps,
	components,
	GroupTypeBase,
	OptionTypeBase,
} from "react-windowed-select";
import { mergeProps, compose, Id } from "../../utils";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useTranslation } from "react-i18next";

import style from "./styles.module.scss";

export interface DropdownOption {
	value: Id;
	label: string;
	meta?: any;
}

export interface Props {
	label?: string;
	options: DropdownOption[];
	value?: DropdownOption;
	onSelect: (option: DropdownOption) => void;
	onInputChange?: (value: string) => void;
	isLoading?: boolean;
	isSearchable?: boolean;
	bordered?: boolean;
	blurred?: boolean;
	placeHolderFontSize?: string;
	iconStyle?: CSSProperties;
	placeholder?: string;
	className?: string;
	clearable?: boolean;
	backgroundColor?: string;
	optionsBackgroundColor?: string;
	disabled?: boolean;
	reference?: any;
}

const radius = (base: any) =>
	mergeProps(base, {
		borderRadius: "6px",
		border: "1px solid transparent",
		height: "32px", //'48px'
		minHeight: "32px",
	});

const arabicStyle = (base: any) =>
	mergeProps(base, {
		direction: "rtl",
	});

const radiusBordered = (base: any) =>
	mergeProps(base, {
		borderRadius: "0",
		border: "none",
		// border: '1px solid rgba(150, 151, 167, 0.3)',,
		borderBottom: "1px solid #000000",
		height: "32px", //'48px',
		minHeight: "32px",
	});

const hidden = (base: any) => mergeProps(base, { display: "none" });
const blackColor = (base: any) => mergeProps(base, { color: "#000" });

export const Dropdown: FC<Props> = ({
	label = "",
	options,
	onSelect,
	onInputChange,
	value,
	bordered = true,
	blurred = false,
	placeHolderFontSize = null,
	isLoading,
	isSearchable = true,
	iconStyle,
	placeholder,
	className,
	clearable = true,
	backgroundColor = "rgb(255 255 255)",
	optionsBackgroundColor = "rgb(255 255 255)",
	disabled,
	reference,
}) => {
	const [t] = useTranslation("common");
	const zIndexFunc = (base: any) => mergeProps(base, { zIndex: 0 });
	const zIndexFunc2 = (base: any) => mergeProps(base, { zIndex: 5 });
	const fontStyle = useMemo(
		() => (base: any) =>
			mergeProps(base, {
				// fontFamily: 'Spartan',
				fontSize: placeHolderFontSize ? placeHolderFontSize : "16px",
				textTransform: "capitalize",
				// color: "blue",
			}),
		[placeHolderFontSize]
	);
	const customDropdownIcon = {
		DropdownIndicator: (
			props: JSX.IntrinsicAttributes &
				CommonProps<OptionTypeBase, boolean, GroupTypeBase<OptionTypeBase>> & {
					children: ReactElement<any, string | JSXElementConstructor<any>>;
					innerProps: any;
					isFocused: boolean;
					isRtl: boolean;
					isDisabled: boolean;
				}
		) => (
			<components.DropdownIndicator {...props}>
				<components.DownChevron style={iconStyle} />
			</components.DropdownIndicator>
		),
	};
	const background = useCallback(
		(base: any) => mergeProps(base, { background: backgroundColor }),
		[backgroundColor]
	);

	const styles = useMemo(
		() => ({
			// control: compose(arabicStyle),
			singleValue: fontStyle, // Apply custom style to the single value (selected option) text
		}),
		[fontStyle]
	);

	return (
		<>
			{label !== "" && <label className={style.label}>{label}</label>}
			<Select
				ref={reference}
				className={clsx("react-select-container", className, "dropdown")}
				classNamePrefix="react-select"
				options={options}
				placeholder={
					placeholder || t("dropdown.select", { framework: "React" })
				}
				onInputChange={onInputChange}
				isLoading={isLoading}
				isClearable={clearable}
				onChange={onSelect}
				isSearchable={isSearchable}
				value={value}
				components={customDropdownIcon}
				styles={styles}
				isDisabled={disabled}
			/>
		</>
	);
};

export default Dropdown;
