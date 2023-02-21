import { Story } from '@storybook/react';

import Accordion, { Props as AccordionProps } from '.';

export default {
	title: 'Components/Accordion',
	component: Accordion,
};

const Template: Story<AccordionProps> = (args) => <Accordion {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	title: 'View Awards',
	opened: true,
	children: <h1>hello accordion!</h1>,
};
