import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, TextBox } from '../../../../../components';
import { DropdownOption } from '../../../../../components/Dropdown';
import styles from './styles.module.scss';

interface Props {
	employeeName: string;
	setEmployeeName: React.Dispatch<React.SetStateAction<string>>;
	logName: string;
	setLogName: React.Dispatch<React.SetStateAction<string>>;
	isDisabled: boolean;
	classOptions: DropdownOption[];
	selectedClassOption?: DropdownOption;
	onClassSelect: (option: DropdownOption) => void;
	isExistingUser: boolean;
	onClearClick: () => void;
}

const NewUserForm: FC<Props> = ({
	employeeName,
	setEmployeeName,
	logName,
	setLogName,
	isDisabled,
	classOptions,
	selectedClassOption,
	onClassSelect,
	isExistingUser,
	onClearClick,
}) => {
	const [t] = useTranslation('common');
	// const [employeeName, setEmployeeName] = useState<string>('');
	// const [logName, setLogName] = useState<string>('');

	const employeeNameChangeHandler = (e: any) => {
		setEmployeeName(e.target.value);
	};

	const logNameChangeHandler = (e: any) => {
		setLogName(e.target.value);
	};

	// const [selectedClassOption, setSelectedClassOption] =
	// 	useState<DropdownOption>();

	return (
		<div className={styles.newUserForm}>
			<div className={styles.field}>
				{/* Uncomment later on */}
				{/* {!isLoading ? (
            <ExistingUserDetailsSection
                list={existingEmployees}
                onClick={existingEmployeeSelectHandler}
            />
        ) : (
            <></>
        )} */}
			</div>
			<div className={styles.section}>
				<div className={styles.field}>
					<TextBox
						label='Employee Name'
						type='text'
						value={employeeName}
						disabled={isDisabled}
						onChange={employeeNameChangeHandler}
					/>
				</div>
				<div className={styles.field}>
					<TextBox
						label='Log Name'
						value={logName}
						type='text'
						disabled={isDisabled}
						onChange={logNameChangeHandler}
					/>
				</div>
			</div>
			<div className={styles.section}>
				<div className={styles.field}>
					<Dropdown
						options={classOptions}
						onSelect={onClassSelect}
						value={selectedClassOption}
						disabled={isDisabled}
					/>
				</div>
			</div>
			{isExistingUser ? (
				<></>
			) : (
				<>
					<div className={styles.section}>
						<div className={styles.field}>
							<TextBox label='Password' type='password' />
						</div>
						<div className={styles.field}>
							<TextBox label='Retype Password' type='password' />
						</div>
					</div>

					<div className={styles.buttonSection}>
						<div className={styles.btn}>
							<Button>Save</Button>
						</div>
						<div>
							<Button onClick={onClearClick}>Clear</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default NewUserForm;
