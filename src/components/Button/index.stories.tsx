import { Story } from '@storybook/react';
import Button, { Props as ButtonProps } from '.';

export default {
	title: 'Components/Button',
	component: Button,
};

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	children: 'Primary',
};

export const RoundButton = Template.bind({});
RoundButton.args = {
	isRound: true,
	children: 'Round Button',
};

export const RoundGradiant = Template.bind({});
RoundGradiant.args = {
	isRound: true,
	isGradient: true,
	children: 'Round Gradiant',
};
