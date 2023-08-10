import React, { FC } from "react";
import { ReactEcharts } from "../LazyReactEcharts";

import { Icon, LegendType } from "../types";

export interface SeriesItem {
	value: number;
	name: string;
	color: string;
}

export interface ChartProps {
	//title
	showTitle?: boolean;
	titleText?: string;
	titleLeft?: string;
	titleTop?: string;
	titleRight?: string;
	titleBottom?: string;
	titleTextStyle?: {};
	titleProps?: {};
	//legend
	showLegend?: boolean;
	legendType?: LegendType;
	legendTextStyle?: {};
	legendIcon?: Icon;
	legendProps?: {};
	//tooltip
	showTooltip?: boolean;
	tooltipFormatter?: (value: any) => string;
	tooltipProps?: {};
	//series
	showSeriesDataLabel?: boolean;
	data: Array<SeriesItem>;
	seriesItemStyle?: {};
	showSeriesDataLabelLine?: boolean;
	radius?: string;
	seriesDataLabelProps?: {};
	seriesDataLabelFormatter?: (value: any) => string;
	seriesItemStyleEmphasisProps?: {};
	//
	notMergeProp?: boolean;
	lazyUpdate?: boolean;
	className?: string;
	style?: {};
	events?: {};
}

export const PieChart: FC<ChartProps> = ({
	//title
	showTitle = true,
	titleText,
	titleLeft = "auto",
	titleTop = "auto",
	titleRight = "auto",
	titleBottom = "auto",
	titleTextStyle = {},
	titleProps = {},
	//legend
	showLegend = true,
	legendType = "plain",
	legendTextStyle = {},
	legendIcon = "circle",
	legendProps = {},
	//tooltip
	showTooltip = true,
	tooltipFormatter,
	tooltipProps,
	//series
	data,
	seriesItemStyle,
	showSeriesDataLabel = true,
	showSeriesDataLabelLine = true,
	radius = "55%",
	seriesDataLabelProps,
	seriesDataLabelFormatter,
	seriesItemStyleEmphasisProps,
	notMergeProp = true,
	lazyUpdate = true,
	events = {},
	//
	className,
	style,
}) => {
	const option = {
		title: {
			show: showTitle,
			text: titleText,
			left: titleLeft,
			top: titleTop,
			right: titleRight,
			bottom: titleBottom,
			textStyle: titleTextStyle,
			...titleProps,
		},
		legend: showLegend
			? {
					show: true,
					type: legendType,
					textStyle: legendTextStyle,
					icon: legendIcon,
					...legendProps,
			  }
			: { show: false },
		tooltip: {
			show: showTooltip,
			formatter: tooltipFormatter,
			...tooltipProps,
		},
		series: [
			{
				type: "pie",
				itemStyle: seriesItemStyle,
				radius: radius,
				data: data.map((s) => ({
					...s,
					itemStyle: {
						color: s.color,
					},
					label: {
						show: showSeriesDataLabel,
						...seriesDataLabelProps,
						formatter: seriesDataLabelFormatter,
					},
					labelLine: {
						show: showSeriesDataLabelLine,
					},
				})),
				emphasis: {
					...seriesItemStyleEmphasisProps,
				},
			},
		],
	};

	return (
		<ReactEcharts
			className={className}
			style={style}
			option={option}
			onEvents={events}
			notMerge={notMergeProp}
			lazyUpdate={lazyUpdate}
		/>
	);
};

export default PieChart;
