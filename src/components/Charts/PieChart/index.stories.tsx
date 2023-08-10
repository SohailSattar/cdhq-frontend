import { Story } from "@storybook/react";
import React from "react";
import { PieChart, ChartProps } from ".";

export default {
	title: "Components/Charts/PieChart",
	component: PieChart,
};

const Template: Story<ChartProps> = (args) => <PieChart {...args} />;

const onSliceSelected = (e: any) => {
	console.log(e);
	alert(e.value);
};

const CHART_TITLE = {
	fontFamily: "Spartan",
	fontWeight: "bold",
	fontSize: "14px",
	lineHeight: 24,
};

const dataset = [
	{ value: 25, name: "a", color: "red" },
	{ value: 50, name: "b", color: "green" },
	{ value: 13, name: "c", color: "blue" },
	{ value: 12, name: "d", color: "yellow" },
];

const legendProps = {
	bottom: 0,
	padding: 10,
	itemWidth: 13,
	itemHeight: 13,
	itemGap: 10,
};

const tooltipFormatter = (item: any) => {
	const valueLabel = item.name || "";
	const value = item.value;
	const percent = item.percent;
	return [`<b>${valueLabel}</b>`, `${item.marker} ${value} (${percent}%)`].join(
		"<br>"
	);
};

export const Primary = Template.bind({});
Primary.args = {
	titleText: "Week Days",
	titleTextStyle: CHART_TITLE,
	legendProps: legendProps,
	tooltipFormatter: tooltipFormatter,
	data: dataset,
	events: { click: onSliceSelected },
};
