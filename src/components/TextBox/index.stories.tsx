import { Story } from '@storybook/react';
import TextBox, { Props as TextBoxProps } from '.';

export default {
	title: 'Components/TextBox',
	component: TextBox,
};

const Template: Story<TextBoxProps> = (args: any) => <TextBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

// export const Primary = () => <Footer />;
