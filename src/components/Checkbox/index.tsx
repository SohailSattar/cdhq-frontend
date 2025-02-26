import { ChangeEvent, FC } from "react";
import { Checkbox as CheckboxComponent } from "@mui/material";

import styles from "./styles.module.scss";

interface Props {
	id?: string;
	label: string;
	checked?: boolean;
	disabled?: boolean;
	onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const Checkbox: FC<Props> = ({
	id,
	label,
	checked = false,
	disabled = false,
	onChange,
}) => {
	const props = { inputProps: { "aria-label": label } };

	return (
		<div>
			<CheckboxComponent
				{...props}
				checked={checked}
				disabled={disabled}
				sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
				onChange={onChange}
				id={id!}
			/>
			{label}
		</div>
	);
};

export default Checkbox;
