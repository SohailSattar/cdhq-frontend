import { Story } from "@storybook/react";
import NewsCard, { Props as NewsCardProps } from ".";

export default {
	title: "Components/NewsCard",
	component: NewsCard,
};

const Template: Story<NewsCardProps> = (args) => <NewsCard {...args} />;

// export const Primary = Template.bind({});
// Primary.args = {
// 	children: 'Primary',
// };
