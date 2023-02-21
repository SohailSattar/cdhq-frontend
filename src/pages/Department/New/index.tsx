import { SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DepartmentForm } from '../../../components';
import { DropdownOption } from '../../../components/Dropdown';
import Layout from '../container/Layout';

const NewDepartmentPage = () => {
	const [t] = useTranslation('common');

	const [id, setId] = useState('');
	const [name, setName] = useState('');
	const [nameEnglish, setNameEnglish] = useState('');
	const [selectedLevelOption, setSelectedLevelOption] =
		useState<DropdownOption>();
	const [fullName, setFullName] = useState('');
	const [fullNameEnglish, setFullNameEnglish] = useState('');
	const [selectedEmirate, setSelectedEmirate] = useState<DropdownOption>();

	const departmentSaveClickHandler = () => {};

	return (
		<DepartmentForm
			id={id}
			setId={setId}
			name={name}
			setName={setName}
			nameEnglish={nameEnglish}
			setNameEnglish={setNameEnglish}
			selectedLevelOption={selectedLevelOption!}
			setSelectedLevelOption={setSelectedLevelOption!}
			fullName={fullName}
			setFullName={setFullName}
			fullNameEnglish={fullNameEnglish}
			setFullNameEnglish={setFullNameEnglish}
			actionButtonText={t('button.save', { framework: 'React' })}
			onActionClick={departmentSaveClickHandler}
			selectedEmirate={selectedEmirate!}
			setSelectedEmirate={setSelectedEmirate}
		/>
	);
};

export default NewDepartmentPage;
