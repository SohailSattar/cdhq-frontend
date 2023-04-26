import type { Meta, StoryObj } from "@storybook/react";
import NewsCaorousal, { Props as NewsCaorousalProps } from ".";
import { APINews } from "../../api/news/types";

const meta = {
	title: "components/NewsCaorousal",
	component: NewsCaorousal,
} satisfies Meta<typeof NewsCaorousal>;

export default meta;
type Story = StoryObj<typeof meta>;

const list: APINews[] = [
	{
		id: 1,
		title: "News 1",
		imageName: "",
		shortSummary: "ad asdsada",
		newsDate: new Date("2021-10-27T13:19:23"),
	},
	{
		id: 2,
		title: "News 2",
		imageName: "",
		shortSummary: "ad asdsada",
		newsDate: new Date("2021-10-27T13:19:23"),
	},
	{
		id: 3,
		title: "News 3",
		imageName: "",
		shortSummary: "ad asdsada",
		newsDate: new Date("2021-10-27T13:19:23"),
	},
	{
		id: 4,
		title: "News 4",
		imageName: "",
		shortSummary: "ad asdsada",
		newsDate: new Date("2021-10-27T13:19:23"),
	},
];

export const Primary: Story = {
	args: {
		list: list,
	},
};
