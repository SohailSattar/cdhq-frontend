import { Story } from '@storybook/react';
import NewsBar from '.';

export default {
	title: 'Components/NewsBar',
	component: NewsBar,
};

const Template: Story = (args: any) => <NewsBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

// export const Primary = () => <Footer />;
