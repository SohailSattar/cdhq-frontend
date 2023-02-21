import { Story } from '@storybook/react';
import PasswordBox, { Props as PasswordBoxProps } from '.';

export default {
	title: 'Components/PasswordBox',
	component: PasswordBox,
};

const Template: Story<PasswordBoxProps> = (args) => <PasswordBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	onClick: (text: string) => {
		alert(text);
	},
};
