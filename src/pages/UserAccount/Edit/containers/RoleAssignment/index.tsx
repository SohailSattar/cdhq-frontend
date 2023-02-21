import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, ShadowedContainer } from '../../../../../components';
import { DropdownOption } from '../../../../../components/Dropdown';

interface Props {
	roleOptions: DropdownOption[];
	onRoleSelect: (option: DropdownOption) => void;
	selectedRoleOption?: DropdownOption;
	onRoleAssignmentButtonClick: (e: any) => void;
}

const RoleAssignment: FC<Props> = ({
	roleOptions,
	onRoleSelect,
	selectedRoleOption,
	onRoleAssignmentButtonClick,
}) => {
	const [t] = useTranslation('common');

	return (
		<div>
			<ShadowedContainer>
				<div>
					<Dropdown
						options={roleOptions}
						onSelect={onRoleSelect}
						value={selectedRoleOption}
					/>
				</div>
			</ShadowedContainer>
			<ShadowedContainer>
				<Button onClick={onRoleAssignmentButtonClick}>
					{t('button.assign', { framework: 'React' })}
				</Button>
			</ShadowedContainer>
		</div>
	);
};

export default RoleAssignment;
