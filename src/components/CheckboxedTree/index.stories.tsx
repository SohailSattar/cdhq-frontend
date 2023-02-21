import { Story } from '@storybook/react';
import CheckboxedTree, { Props as CheckboxedTreeProps } from '.';

export default {
	title: 'Components/CheckboxedTree',
	component: CheckboxedTree,
};


const nodes2 = [
	{
		value: 'mars',
		label: 'Mars',
		children: [
			{ value: 'phobos', label: 'Phobos' },
			{ value: 'deimos', label: 'Deimos' },
		],
	},
	{
		value: 'eath',
		label: 'Earth',
		children: [
			{ value: 'water', label: 'Water' },
			{ value: 'mountain', label: 'Mountain' },
			{
				value: 'eath1',
				label: 'Earth1',
				children: [
					{ value: 'water1', label: 'Water1' },
					{ value: 'mountain1', label: 'Mountain1' },
				],
			},
		],
	},
];

const Template: Story<CheckboxedTreeProps> = (args) => (
	<CheckboxedTree {...args} />
);

export const Primary = Template.bind({});
Primary.args = {direction:"rtl",
nodes:nodes2};
