import { ChangeEventHandler, FC } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";

import { useStore } from "../../utils/store";

import styles from "./styles.module.scss";

import "./styles.css";

type InputType = "text" | "password" | "number";
type Variant = "standard" | "filled" | "outlined";

export interface Props {
	label?: string;
	name?: string;
	value?: string;
	type: InputType;
	multiline?: boolean;
	maxRows?: number;
	variant?: Variant;
	disabled?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onKeyDown?: any;
	reference?: any;
	autocomplete?: string;
}

const TextBox: FC<Props> = ({
	label,
	name,
	value,
	type,
	variant = "standard",
	multiline = false,
	maxRows = 4,
	disabled,
	onChange,
	onKeyDown,
	reference,
	autocomplete = "",
}) => {
	const language = useStore((state) => state.language);
	const theme = createTheme({
		direction: "rtl", // Both here and <body dir="rtl">
	});

	const cacheRtl = createCache({
		key: "muirtl",
		stylisPlugins: [prefixer, rtlPlugin],
	});

	const cacheLtr = createCache({
		key: "muiltr",
		stylisPlugins: [prefixer],
	});
	return (
		<div className={styles.textbox}>
			{" "}
			<CacheProvider value={language !== "ar" ? cacheRtl : cacheLtr}>
				<ThemeProvider theme={theme}>
					<FormControl
						fullWidth
						sx={{ m: 1 }}>
						<TextField
							name={name}
							label={label}
							multiline={multiline}
							maxRows={maxRows}
							variant={variant}
							type={type}
							value={value}
							onChange={onChange}
							onKeyDown={onKeyDown}
							disabled={disabled}
							ref={reference}
							autoComplete={autocomplete}
						/>
						{/* <FormHelperText id='component-error-text' className={styles.error}>
					Error
				</FormHelperText> */}
					</FormControl>
				</ThemeProvider>
			</CacheProvider>
		</div>
	);
};

export default TextBox;
