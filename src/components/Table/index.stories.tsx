/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Column } from 'react-table';
import { Table } from '.';

export default {
	title: 'Components/Table',
	component: Table,
};

interface HorseExample {
	rank: number;
	horse: string;
	age: number;
	gender: string;
}

const columns: Column<HorseExample>[] = [
	{
		Header: 'Rank',
		accessor: (p) => p.rank,
	},
	{
		Header: 'Age',
		accessor: (p) => p.horse,
	},
	{
		Header: 'Horse',
		accessor: (p) => p.age,
	},
	{
		Header: 'Gender',
		accessor: (p) => p.gender,
		Cell: ({ value }: any) => <div>{value} 😆 </div>,
	},
];

const data: HorseExample[] = [
	{
		rank: 1,
		horse: 'horse 1',
		age: 10,
		gender: 'Male',
	},
	{ rank: 2, horse: 'horse 2', age: 16, gender: 'Male' },
];

export const Primary = () => <Table columns={columns} data={data} />;

export const Expandable = () => (
	<Table
		columns={columns}
		data={data}
		renderSubComponent={(row) => (
			<pre
				style={{
					fontSize: '10px',
				}}>
				<code>{JSON.stringify(row, null, 2)}</code>
			</pre>
		)}
	/>
);
