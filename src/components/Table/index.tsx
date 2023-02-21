import clsx from 'clsx';
import React, {
	MutableRefObject,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	useMemo,
} from 'react';
// import { Table as RTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
// import './responsive-table.scss';
import { Column, useExpanded, useTable, useSortBy } from 'react-table';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { ReactComponent as DownIcon } from './down.svg';
import { ReactComponent as RightIcon } from './right.svg';

import styles from './styles.module.scss';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { useStore } from '../../utils/store';
// import { Tooltip } from '..';
interface TableProps<T extends object> {
	columns: Column<any>[];
	data: T[];
	renderSubComponent?: (row: T) => ReactNode;
	className?: string;
	noRecordsText: string;
	headerBackground?: string;
	headerColor?: string;
	headerPadding?: string;
	rowColor?: string;
	rowHeight?: string;
	rowSpacing?: string;
	fontSize?: string;
	onRowClick?: (row: T) => void;
	isPrintable?: Boolean;
	reference?: MutableRefObject<null>;
	onSort?: (columnId: string, isSorted: boolean) => void;
	columnsToHide?: string[];
}
type Props<T extends object> = PropsWithChildren<TableProps<T>>;

const expandColumn = {
	id: 'expander',
	expander: true,
	Cell: ({ row }: any) => (
		<span {...row.getToggleRowExpandedProps()}>
			{row.isExpanded ? (
				<DownIcon style={{ width: 10, fill: 'black', stroke: 'black' }} />
			) : (
				<RightIcon style={{ width: 10, fill: 'black', stroke: 'black' }} />
			)}
		</span>
	),
	width: 5,
};

Table.defaultProps = {
	noRecordsText: 'No records found',
	headerBackground: '#141f33',
	headerColor: '#fff',
	rowColor: 'rgba(0, 0, 0, 0.04)',
	headerPadding: '6px 12px',
	fontSize: '12px',
	columnsToHide: [],
	// rowHeight: '16px',
};
export function Table<T extends object>(props: Props<T>): ReactElement {
	const language = useStore((state) => state.language);

	const columns = useMemo(
		() =>
			props.renderSubComponent
				? [...props.columns, expandColumn]
				: props.columns,
		[props.columns, props.renderSubComponent]
	);
	const data = useMemo(() => props.data, [props.data]);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down(767));

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		visibleColumns,
	} = useTable(
		{
			columns,
			data,
			initialState: { hiddenColumns: props.columnsToHide },
		},
		useSortBy,
		useExpanded
	);

	const columnHeadersLength = headerGroups.map(
		(headerGroup) => headerGroup.headers.length
	);
	const maxColCount = Math.max(...columnHeadersLength);

	return (
		<div className={clsx(styles.tableWrapper, props.className)}>
			<table
				{...getTableProps()}
				className={styles.table}
				cellSpacing='0'
				cellPadding='0'
				style={{ borderSpacing: `0 ${props.rowSpacing}` }}
				ref={props.reference}>
				<thead
					className={clsx(
						styles.tableHead,
						language === 'ar' && styles.tableHeadLTR
					)}>
					<tr {...headerGroups[0].getHeaderGroupProps()}>
						{headerGroups[0].headers.map((column: any) => {
							const sortByToggleProps = column.getSortByToggleProps({
								...column.getSortByToggleProps(),
								onClick: () => {
									if (column.isSortedDesc === undefined) {
										column.isSortedDesc = false;
									}

									props.onSort && props.onSort(column.id, column.isSortedDesc);
									column.toggleSortBy(!column.isSortedDesc);
								},
							});

							return (
								<th
									{...column.getHeaderProps(sortByToggleProps)}
									style={{
										color: props.headerColor,
										padding: props.headerPadding,
										background: props.headerBackground,
									}}>
									{!(column as any).tooltip && column.render('Header')}
								</th>
							);
						})}
						{props.isPrintable && <th>Print</th>}
					</tr>
				</thead>

				<tbody {...getTableBodyProps()} className={styles.tableBody}>
					{!rows.length && (
						<tr
							className={clsx(
								styles.tableRow,
								language === 'ar' && styles.tableRowLTR
							)}
							style={{ background: props.rowColor }}>
							<td className={styles.noRecordsRow} colSpan={maxColCount}>
								{props.noRecordsText}
							</td>
						</tr>
					)}
					{rows.map((row) => {
						prepareRow(row);
						return (
							<React.Fragment key={row.getRowProps().key}>
								<tr
									{...row.getRowProps()}
									className={clsx(
										styles.tableRow,
										language === 'ar' && styles.tableRowLTR
									)}
									style={{
										background: props.rowColor,
										height: props.rowHeight,
									}}
									onClick={() =>
										props.onRowClick && props.onRowClick(row.original)
									}>
									{row.cells.map((cell, index) => {
										return (
											<td
												// {props.isPrintable && index === row.cells.length ? }
												style={{
													fontSize: props.fontSize,
												}}
												{...cell.getCellProps([
													{ className: styles[(cell.column as any).className] },
												])}
												onClick={(e) => {
													if (index === row.cells.length - 1)
														e.stopPropagation();
												}}>
												<>{cell.render('Cell')}</>
											</td>
										);
									})}
								</tr>

								{(row as any).isExpanded && props.renderSubComponent && (
									<tr
										className={clsx(
											styles.tableRow,
											language === 'ar' && styles.tableRowLTR,
											styles.subRow
										)}>
										<td
											colSpan={visibleColumns.length}
											style={{ background: props.rowColor }}
											className={styles.nested}>
											{props.renderSubComponent(row.original)}
										</td>
									</tr>
								)}
							</React.Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
