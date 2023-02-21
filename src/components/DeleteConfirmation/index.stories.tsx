import { Story } from '@storybook/react';
import DeleteConfirmation, { Props as DeleteConfirmationProps } from '.';

export default {
	title: 'Components/DeleteConfirmation',
	component: DeleteConfirmation,
};

const Template: Story<DeleteConfirmationProps> = (args) => (
	<DeleteConfirmation {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
