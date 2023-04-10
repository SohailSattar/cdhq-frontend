import { Story } from "@storybook/react";
import { ChangeEvent } from "react";
import ImageSelector, { Props as ImageSelectorProps } from ".";

export default {
	title: "Components/ImageSelector",
	component: ImageSelector,
};

const Template: Story<ImageSelectorProps> = (args) => (
	<ImageSelector {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
	imageSrc: "http://localhost/AppFiles/F6110/image/honor/HON_248.png",
	onImageChange: () => {},
	onImageUpdate: () => {},
	hideUploadButton: true,
};
