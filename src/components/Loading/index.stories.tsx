import { Story } from '@storybook/react';
import Loading, { Props as LoadingProps } from '.';

export default {
	title: 'Components/Loading',
	component: Loading,
};

const Template: Story<LoadingProps> = (args: LoadingProps) => (
	<Loading {...args} />
);

export const SimpleLoader = Template.bind({});
SimpleLoader.args = {
	color: '#000000',
};

export const WithText = Template.bind({});
WithText.args = {
	color: '#000000',
	text: 'Loading',
};
