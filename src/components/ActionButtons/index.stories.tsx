import { Story } from '@storybook/react';
import AcionButtons, { Props as ButtonProps } from '.';

export default {
	title: 'Components/ActionButtons',
	component: AcionButtons,
};

const Template: Story<ButtonProps> = (args) => <AcionButtons {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    // onEdit: () => {alert("Edit")}
};