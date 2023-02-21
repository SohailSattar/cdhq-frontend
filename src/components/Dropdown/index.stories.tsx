/* eslint-disable import/no-anonymous-default-export */
import { Story } from '@storybook/react';
import React from 'react';
import { Dropdown, Props as DropdownProps } from '.';

export default {
	title: 'Components/Dropdown',
	component: Dropdown,
};

const Template: Story<DropdownProps> = (args) => <Dropdown {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	placeholder: 'placeholder',

	options: [
		{ label: 'option 1', value: 1 },
		{ label: 'option 2', value: 2 },
	],
};

export const Loading = Template.bind({});
Loading.args = {
	options: [],
	isLoading: true,
};
