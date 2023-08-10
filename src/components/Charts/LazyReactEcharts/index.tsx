import * as React from "react";
import { ECharts } from "echarts";
import { Loading } from "../Loading";

const LazyReactEcharts = React.lazy(() => import("echarts-for-react"));

export type ReactEchartsInstance = {
	getEchartsInstance(): ECharts;
};
export const ReactEcharts = (props: any) => (
	<React.Suspense fallback={<Loading />}>
		<LazyReactEcharts {...props} />
	</React.Suspense>
);

export default ReactEcharts;
