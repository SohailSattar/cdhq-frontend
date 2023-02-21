import { Story } from '@storybook/react';
import SearchBox, { Props as SearchBoxProps } from '.';

export default {
	title: 'Components/SearchBox',
	component: SearchBox,
};

const Template: Story<SearchBoxProps> = (args) => <SearchBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	onClick(value: string) {},
};
