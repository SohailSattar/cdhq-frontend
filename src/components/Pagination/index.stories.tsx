import { Story } from '@storybook/react';
import Pagination, { Props as PaginationProps } from '.';

export default {
	title: 'Components/Pagination',
	component: Pagination,
};

const Template: Story<PaginationProps> = (args) => <Pagination {...args} />;
export const Primary = Template.bind({});
Primary.args = {
	className: 'pagination-bar',
	currentPage: 1,
	totalCount: 50,
	pageSize: 50,
	onPageChange: (page) => console.log(page),
};
