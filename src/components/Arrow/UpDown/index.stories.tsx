import type { Meta, StoryObj } from "@storybook/react";
import UpDownArrow from ".";

const meta = {
	title: "components/Arrows/UpDown",
	component: UpDownArrow,
} satisfies Meta<typeof UpDownArrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		onUpClick: () => {
			console.log("Up Clicked");
		},
		onDownClick: () => {
			console.log("Down Clicked");
		},
	},
};
