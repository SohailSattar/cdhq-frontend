import { Story } from '@storybook/react';
import Footer from '.';

export default {
	title: 'Components/Footer',
	component: Footer,
};

const Template: Story = (args: any) => <Footer {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

// export const Primary = () => <Footer />;
