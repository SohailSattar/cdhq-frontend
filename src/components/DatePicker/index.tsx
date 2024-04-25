import React, { FC } from "react";
import clsx from "clsx";
import arLocale from "date-fns/locale/ar";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles, Theme } from "@material-ui/core";
import { FormLabel } from "@mui/material";

import "./styles.css";
import styles from "./index.module.scss";
import { useStore } from "../../utils/store";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		// fontFamily: "Ubuntu",
		fontStyle: "normal",
		fontWeight: "normal",
		fontSize: "10px!important",
		lineHeight: "13px",
		display: "flex",
		// alignItems: "center",
		width: "100%", //"180px",
		color: "#000",

		"& .MuiOutlinedInput-root": {
			borderRadius: 4,
			"&.Mui-focused fieldset": {
				borderColor: "#000",
			},
		},

		"& .MuiIconButton-root": {
			color: "#C4C4C4",
			width: "24px",
			height: "24px",
		},

		"& .MuiOutlinedInput-notchedOutline": {
			color: "#C4C4C4",
			// borderBottom: "1px solid #C4C4C4",
			// borderRadius: "4px",
		},

		"& .MuiInputBase-root": {
			// fontFamily: "Ubuntu",
			fontSize: "16px",
		},

		"& .MuiInputBase-input": {
			color: "#000",
		},
		"& .PrivateNotchedOutline-root-2": {
			borderColor: "#000",
			border: "none",
			borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
			// borderRadius: "4px",
		},

		"& .MuiOutlinedInput-input": {
			padding: "8px",
		},

		"& .MuiPickersToolbar-toolbar": {
			backgroundColor: "red !important",
		},
	},
}));

const DateSelector = (props: any) => {
	const language = useStore((state) => state.language);

	const { date, onChange, dateFormat = "dd MMMM yyyy" } = props;
	const { root } = useStyles();

	// const changeHandler = (date: any) => {
	// 	setdate(date);
	// };

	return (
		<div className={styles.DateSelector}>
			{props?.labeltext && (
				<FormLabel
					style={{ color: "black" }}
					className={styles.title}>
					{props?.labeltext}
				</FormLabel>
			)}
			<MuiPickersUtilsProvider
				utils={DateFnsUtils}
				locale={language !== "ar" ? arLocale : null}>
				<div>
					<KeyboardDatePicker
						autoOk
						variant="inline"
						inputVariant="outlined"
						className={root}
						format={dateFormat}
						value={date}
						InputAdornmentProps={{ position: "start" }}
						onChange={onChange}
						//disablePast={true}
						{...props}
					/>
				</div>
			</MuiPickersUtilsProvider>
		</div>
	);
};

export default DateSelector;
