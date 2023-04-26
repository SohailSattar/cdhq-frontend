import type { Meta, StoryObj } from "@storybook/react";
import NewsBar, { NewsItem } from ".";
import { Id } from "../../../utils";

const meta = {
	title: "components/Bars/NewsBar",
	component: NewsBar,
} satisfies Meta<typeof NewsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const data: NewsItem = { id: 1, src: "x", title: "News 1", body: "adsadasa" };

// const list: APINews[] = [
// 	{
// 		id: 1,
// 		title: "News 1",
// 		imageName: "",
// 		shortSummary: "ad asdsada",
// 		newsDate: new Date("2021-10-27T13:19:23"),
// 	},
// 	{
// 		id: 2,
// 		title: "News 2",
// 		imageName: "",
// 		shortSummary: "ad asdsada",
// 		newsDate: new Date("2021-10-27T13:19:23"),
// 	},
// 	{
// 		id: 3,
// 		title: "News 3",
// 		imageName: "",
// 		shortSummary: "ad asdsada",
// 		newsDate: new Date("2021-10-27T13:19:23"),
// 	},
// 	{
// 		id: 4,
// 		title: "News 5",
// 		imageName: "",
// 		shortSummary: "ad asdsada",
// 		newsDate: new Date("2021-10-27T13:19:23"),
// 	},
// ];

export const Primary: Story = {
	args: {
		data: data,
	},
};
