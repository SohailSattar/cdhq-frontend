import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Column } from 'react-table';
import { APIProject } from '../../../../../api/projects/types';

import {
	Button,
	Dropdown,
	Pagination,
	RedirectButton,
	SearchBox,
	ShadowedContainer,
	Table,
	TotalCount,
} from '../../../../../components';
import { DropdownOption } from '../../../../../components/Dropdown';
import { useStore } from '../../../../../utils/store';
import { ProjectTable } from '../../types';

import * as RoutePath from '../../../../../RouteConfig';

import styles from './styles.module.scss';

interface Props {
	totalCount: number;
	pageSize: number;
	data: APIProject[];
	onProjectSearch: (keyword: string) => void;
	onPageChange: (pageNumber: number) => void;
	onPageViewSelectionChange: (option: DropdownOption) => void;
}

const ProjectsListTable: FC<Props> = ({
	totalCount,
	pageSize,
	data,
	onProjectSearch,
	onPageChange,
	onPageViewSelectionChange,
}) => {
	const [t] = useTranslation('common');
	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const [currentPage, setCurrentPage] = useState(1);

	const id = t('project.id', { framework: 'React' });
	const projectName = t('project.name', { framework: 'React' });
	const projectNameAr = t('project.nameArabic', { framework: 'React' });
	const projectNameEng = t('project.nameEnglish', { framework: 'React' });

	//Actions
	const actions = t('global.actions', { framework: 'React' });
	const detail = t('button.detail', { framework: 'React' });

	const columns: Column<ProjectTable>[] = [
		{
			Header: id,
			accessor: (p) => p.id,
		},
		{
			Header: projectName,
			accessor: (p) => p.name,
		},
		{
			Header: projectNameAr,
			accessor: (p) => p.nameArabic,
		},
		{
			Header: projectNameEng,
			accessor: (p) => p.nameEnglish,
		},
		{
			Header: 'Group',
			accessor: (p) => p.group?.nameArabic,
		},
		{
			Header: 'Group [English]',
			accessor: (p) => p.group?.nameEnglish,
		},
		{
			Header: actions,
			accessor: (p) => p.id,
			Cell: ({ value }: any) => (
				<div className={styles.action}>
					<div className={styles.btnDiv}>
						<RedirectButton
							label={detail}
							redirectTo={`${RoutePath.PROJECT}/${value}`}
							style={{ height: '20px', fontSize: '12px' }}
						/>
					</div>
				</div>
			),
		},
	];

	const pageChangeHandler = (page: number) => {
		setCurrentPage(page);
		onPageChange(page);
	};

	const pageViewOptions: DropdownOption[] = [
		{ label: '10', value: 10 },
		{ label: '15', value: 15 },
		{ label: '20', value: 20 },
		{ label: '25', value: 25 },
		{ label: '30', value: 30 },
		{ label: '35', value: 35 },
		{ label: '40', value: 40 },
		{ label: '45', value: 45 },
		{ label: '50', value: 50 },
	];

	const pageViewSelectionChangeHandler = (option: DropdownOption) => {
		onPageViewSelectionChange(option);
	};

	return (
		<div className={styles.projectsTable}>
			<SearchBox onClick={onProjectSearch} />
			<div className={styles.detailBar}>
				<div className={language !== 'ar' ? styles.info : styles.infoLTR}>
					<TotalCount label='Projects Count' count={totalCount} />
				</div>
				<div
					className={
						language !== 'ar' ? styles.selection : styles.selectionLTR
					}>
					<ShadowedContainer className={styles.box}>
						<Dropdown
							options={pageViewOptions}
							onSelect={pageViewSelectionChangeHandler}
							placeholder={t('pagination.projectsPerPage', {
								framework: 'React',
							})}
						/>
					</ShadowedContainer>
				</div>
			</div>
			<Table
				columns={columns}
				data={data}
				noRecordsText={t('table.noProject', { framework: 'React' })}
			/>
			<div>
				<Pagination
					className={styles.paginationBar}
					currentPage={currentPage}
					totalCount={totalCount}
					pageSize={pageSize}
					onPageChange={(page) => pageChangeHandler(page)}
				/>
			</div>
		</div>
	);
};

export default ProjectsListTable;
