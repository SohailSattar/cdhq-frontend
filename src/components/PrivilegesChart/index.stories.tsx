import { Story } from '@storybook/react';
import PrivilegesChart, { Props as PrivilegesChartProps } from '.';
import { APIPrivilege } from '../../api/privileges/type';

export default {
	title: 'Components/PrivilegesChart',
	component: PrivilegesChart,
};

const Template: Story<PrivilegesChartProps> = (args) => (
	<PrivilegesChart {...args} />
);

const data: APIPrivilege[] = [];

export const Primary = Template.bind({});
Primary.args = {
	data: data,
};
