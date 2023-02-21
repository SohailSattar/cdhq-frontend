import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from '@mui/material';
import { ChangeEvent, FC } from 'react';

interface RadioItem {
	value: string;
	label: string;
}

interface Props {
	label?: string;
	value?: string;
	radioItems: RadioItem[];
	onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
	reference?: any;
}

const RadioButton: FC<Props> = ({
	label,
	value,
	radioItems,
	onChange,
	reference,
}) => {
	// const radioChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	onChange((event.target as HTMLInputElement));
	// };

	return (
		<FormControl>
			{label && (
				<FormLabel id='demo-radio-buttons-group-label'>{label}</FormLabel>
			)}
			<RadioGroup
				value={value}
				onChange={onChange}
				row
				aria-labelledby='demo-row-radio-buttons-group-label'
				name='row-radio-buttons-group'
				ref={reference}>
				{radioItems.map((item, index) => (
					<FormControlLabel
						value={item.value}
						control={<Radio />}
						label={item.label}
						key={index}
					/>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default RadioButton;
