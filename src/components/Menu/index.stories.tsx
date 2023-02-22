import { Story } from '@storybook/react';
import Menu, { Props as MenuProps }  from '.';


export default {
	title: 'Components/Menu',
	component: Menu,
};

const Template: Story<MenuProps> = (args) => <Menu {...args} />;

export const Primary = Template.bind({});
// Primary.args = {
// 	children: 'Primary',
// };

