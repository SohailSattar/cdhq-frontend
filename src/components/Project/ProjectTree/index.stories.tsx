import { Story } from '@storybook/react';
import ProjectTree, { Props as ProjectTreeProps } from '.';

export default {
	title: 'Components/ProjectTree',
	component: ProjectTree,
};

const Template: Story<ProjectTreeProps> = (args) => <ProjectTree {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
