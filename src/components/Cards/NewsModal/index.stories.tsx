import { Story } from '@storybook/react';
import NewsModal, { Props as NewsModalProps }  from '.';


export default {
	title: 'Components/NewsCard',
	component: NewsModal,
};

const Template: Story<NewsModalProps> = (args) => <NewsModal {...args} />;

export const Primary = Template.bind({});
// Primary.args = {
// 	children: 'Primary',
// };

