import { Story } from '@storybook/react';
import Loader from '.';

export default {
	title: 'Components/Loader',
	component: Loader,
};

const Template: Story = () => <Loader />;

export const SimpleLoader = Template.bind({});
