import clsx from "clsx";
import React, {
	MutableRefObject,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	useEffect,
	useMemo,
} from "react";
// import { Table as RTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
// import './responsive-table.scss';
//
// import { Column, useExpanded, useTable, useSortBy } from "react-table";
import {
	Column,
	ColumnDef,
	ColumnFiltersState,
	RowData,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ReactComponent as DownIcon } from "./down.svg";
import { ReactComponent as RightIcon } from "./right.svg";
import { useStore } from "../../utils/store";
// import { Tooltip } from '..';

import styles from "./styles.module.scss";
import ShadowedContainer from "../ShadowedContainer";
import Dropdown, { DropdownOption } from "../Dropdown";
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
	onColumnFiltersChange?: React.Dispatch<
		React.SetStateAction<ColumnFiltersState>
	>;
}
type Props<T extends object> = PropsWithChildren<TableProps<T>>;

const expandColumn = {
	id: "expander",
	expander: true,
	Cell: ({ row }: any) => (
		<span {...row.getToggleRowExpandedProps()}>
			{row.isExpanded ? (
				<DownIcon style={{ width: 10, fill: "black", stroke: "black" }} />
			) : (
				<RightIcon style={{ width: 10, fill: "black", stroke: "black" }} />
			)}
		</span>
	),
	width: 5,
};

Table.defaultProps = {
	noRecordsText: "No records found",
	headerBackground: "#141f33",
	headerColor: "#fff",
	rowColor: "rgba(0, 0, 0, 0.04)",
	headerPadding: "6px 12px",
	// fontSize: "12px",
	columnsToHide: [],
	// rowHeight: '16px',
	onColumnFiltersChange: () => {},
};
export function Table<T extends object>(props: Props<T>): ReactElement {
	const language = useStore((state) => state.language);

	// Define initial filter values here
	const initialFilterValues: ColumnFiltersState = [
		// Example: Set initial filter value for activeStatusId column
		{ id: "activeStatusId", value: "1" }, // Set the initial value as per your requirement
		// Add more initial filter values as needed for other columns
	];

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const handleColumnFiltersChange = (
		newColumnFilters: React.SetStateAction<ColumnFiltersState>
	) => {
		// console.log(newColumnFilters);
		setColumnFilters(newColumnFilters);
		if (props.onColumnFiltersChange) {
			props.onColumnFiltersChange(newColumnFilters!);
		}
	};

	const columns = useMemo(
		() =>
			props.renderSubComponent
				? [...props.columns, expandColumn]
				: props.columns,
		[props.columns, props.renderSubComponent]
	);
	const data = useMemo(() => props.data, [props.data]);

	// const {
	// 	getTableProps,
	// 	getTableBodyProps,
	// 	headerGroups,
	// 	rows,
	// 	prepareRow,
	// 	visibleColumns,
	// } = useReactTable(
	// 	{
	// 		columns,
	// 		data,
	// 		initialState: { hiddenColumns: props.columnsToHide },
	// 	},
	// 	getSortedRowModel: getSortedRowModel(),
	// 	useExpanded
	// );

	const tableInstance = useReactTable({
		columns: columns,
		data: data,
		filterFns: {},
		state: {
			columnFilters,
		},
		onColumnFiltersChange: props.onColumnFiltersChange,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), //client side filtering
		getSortedRowModel: getSortedRowModel(),

		// getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
	});

	// UNCOMMENT
	// const columnHeadersLength = getHeaderGroups().map(
	// 	(headerGroup) => headerGroup.headers.length
	// );
	// const maxColCount = Math.max(...columnHeadersLength);

	return (
		<ShadowedContainer className={clsx(styles.tableWrapper, props.className)}>
			<div className="p-2">
				<table
					className={styles.table}
					cellSpacing="0"
					cellPadding="0">
					<thead
						className={clsx(
							styles.tableHead,
							language === "ar" && styles.tableHeadLTR
						)}>
						{tableInstance.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											style={{
												color: props.headerColor,
												padding: props.headerPadding,
												background: props.headerBackground,
											}}>
											{header.isPlaceholder ? null : (
												<>
													<div
														{...{
															className: header.column.getCanSort()
																? "cursor-pointer select-none"
																: "",
															onClick: () => {
																if (header.column.getIsSorted() === undefined) {
																	header.column.toggleSorting(); //.isSortedDesc = false;
																}

																props.onSort &&
																	props.onSort(
																		header.column.id,
																		Boolean(header.column.getIsSorted())
																	);
																header.column.toggleSorting();
															},
														}}
														className={styles.heading}>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: " 🔼",
															desc: " 🔽",
														}[header.column.getIsSorted() as string] ?? null}
													</div>
													{header.column.getCanFilter() ? (
														<div>
															<Filter column={header.column} />
														</div>
													) : null}
												</>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody className={styles.tableBody}>
						{!tableInstance.getRowModel().rows.length && (
							<tr
								className={clsx(
									styles.tableRow,
									language === "ar" && styles.tableRowLTR
								)}
								style={{ background: props.rowColor }}>
								<td
									className={styles.noRecordsRow}
									// colSpan={maxColCount}
								>
									{props.noRecordsText}
								</td>
							</tr>
						)}
						{tableInstance.getRowModel().rows.map((row) => {
							return (
								<tr
									key={row.id}
									className={clsx(
										styles.tableRow,
										language === "ar" && styles.tableRowLTR
									)}
									style={{
										background: props.rowColor,
										height: props.rowHeight,
									}}>
									{row.getVisibleCells().map((cell) => {
										return (
											<td
												key={cell.id}
												style={{
													fontSize: props.fontSize,
												}}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="h-2" />
				{/* <div className="flex items-center gap-2">
					<button
						className="border rounded p-1"
						onClick={() => tableInstance.setPageIndex(0)}
						disabled={!tableInstance.getCanPreviousPage()}>
						{"<<"}
					</button>
					<button
						className="border rounded p-1"
						onClick={() => tableInstance.previousPage()}
						disabled={!tableInstance.getCanPreviousPage()}>
						{"<"}
					</button>
					<button
						className="border rounded p-1"
						onClick={() => tableInstance.nextPage()}
						disabled={!tableInstance.getCanNextPage()}>
						{">"}
					</button>
					<button
						className="border rounded p-1"
						onClick={() =>
							tableInstance.setPageIndex(tableInstance.getPageCount() - 1)
						}
						disabled={!tableInstance.getCanNextPage()}>
						{">>"}
					</button>
					<span className="flex items-center gap-1">
						<div>Page</div>
						<strong>
							{tableInstance.getState().pagination.pageIndex + 1} of{" "}
							{tableInstance.getPageCount()}
						</strong>
					</span>
					<span className="flex items-center gap-1">
						| Go to page:
						<input
							type="number"
							defaultValue={tableInstance.getState().pagination.pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								tableInstance.setPageIndex(page);
							}}
							className="border p-1 rounded w-16"
						/>
					</span>
					<select
						value={tableInstance.getState().pagination.pageSize}
						onChange={(e) => {
							tableInstance.setPageSize(Number(e.target.value));
						}}>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option
								key={pageSize}
								value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
				<div>{tableInstance.getPrePaginationRowModel().rows.length} Rows</div> */}
				{/* <div>
					<button onClick={() => rerender()}>Force Rerender</button>
				</div>
				<div>
					<button onClick={() => refreshData()}>Refresh Data</button>
				</div>*/}
				{/* <pre>
					{JSON.stringify(
						{ columnFilters: tableInstance.getState().columnFilters },
						null,
						2
					)}
				</pre> */}
			</div>
			{/* <table
				// {...getTableProps()}
				className={styles.table}
				cellSpacing="0"
				cellPadding="0"
				style={{ borderSpacing: `0 ${props.rowSpacing}` }}
				ref={props.reference}>
				<thead
					className={clsx(
						styles.tableHead,
						language === "ar" && styles.tableHeadLTR
					)}>
					<tr>
						{tableInstance.getColumn().map((column) => {
							const sortByToggleProps = column.getSortByToggleProps({
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
									}}
									key={column.id}>
									{!(column as any).tooltip && column.render("header")}
								</th>
							);
						})}
						{props.isPrintable && <th>Print</th>}
					</tr>
				</thead>

				<tbody
					{...getTableBodyProps()}
					className={styles.tableBody}>
					{!rows.length && (
						<tr
							className={clsx(
								styles.tableRow,
								language === "ar" && styles.tableRowLTR
							)}
							style={{ background: props.rowColor }}>
							<td
								className={styles.noRecordsRow}
								colSpan={maxColCount}>
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
										language === "ar" && styles.tableRowLTR
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
												<>{cell.render("Cell")}</>
											</td>
										);
									})}
								</tr>

								{(row as any).isExpanded && props.renderSubComponent && (
									<tr
										className={clsx(
											styles.tableRow,
											language === "ar" && styles.tableRowLTR,
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
			</table> */}
		</ShadowedContainer>
	);
}

console.log("asdsad");

function Filter({ column }: { column: Column<any, unknown> }) {
	const [columnFilterValue, setColumnFilterValue] = React.useState(
		column.getFilterValue()
	);

	useEffect(() => {
		setColumnFilterValue(column.getFilterValue());
	}, [column]);

	const variant = column.columnDef.meta ?? {};

	const selectHandler = (option: DropdownOption) => {
		if (option) {
			column.setFilterValue(option.value.toString());
		} else {
			if ("defaultOption" in variant) {
				var defaultOption = variant?.defaultOption as DropdownOption;
				column.setFilterValue(defaultOption!.value!);
			} else {
				column.setFilterValue("");
			}
		}
	};

	if ("filterVariant" in variant) {
		switch (variant!.filterVariant) {
			case "range": {
				const [minValue, maxValue] = (columnFilterValue as [
					number,
					number
				]) ?? ["", ""];
				const handleChange = (value: number, index: number) => {
					column.setFilterValue((old: [number, number]) => [
						index === 0 ? value : old?.[0],
						index === 1 ? value : old?.[1],
					]);
				};

				return (
					<div>
						<div className="flex space-x-2">
							<DebouncedInput
								type="number"
								value={minValue}
								onChange={(value) => handleChange(Number(value), 0)}
								placeholder="Min"
								className="w-24 border shadow rounded"
							/>
							<DebouncedInput
								type="number"
								value={maxValue}
								onChange={(value) => handleChange(Number(value), 1)}
								placeholder="Max"
								className="w-24 border shadow rounded"
							/>
						</div>
						<div className="h-1" />
					</div>
				);
			}
			case "select": {
				let options: DropdownOption[] = [];

				if ("options" in variant) {
					options = variant?.options as DropdownOption[];
				}

				return (
					<Dropdown
						options={options}
						onSelect={selectHandler}
					/>
					// <select
					// 	onChange={(e) => column.setFilterValue(e.target.value)}
					// 	value={columnFilterValue?.toString()}>
					// 	<option value="">All</option>
					// 	<option value="complicated">complicated</option>
					// 	<option value="relationship">relationship</option>
					// 	<option value="single">single</option>
					// </select>
				);
			}
			default: {
				console.log("hereee????");
				return (
					<DebouncedInput
						className="w-36 border shadow rounded"
						onChange={(value) => column.setFilterValue(value)}
						placeholder="Search..."
						type="text"
						value={(columnFilterValue as [number, number])?.[1] ?? ""}
					/>
				);
			}
		}
	} else {
		return (
			<DebouncedInput
				className="w-36 border shadow rounded"
				onChange={(value) => column.setFilterValue(value)}
				placeholder="Search..."
				type="text"
				value={(columnFilterValue as [number, number])?.[1] ?? ""}
			/>
		);
	}
}

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}

export default Table;
