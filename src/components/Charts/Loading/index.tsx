import { FC } from "react";
import "./index.module.scss";

interface Props {
	color?: string;
	text?: string;
}

export const Loading: FC<Props> = ({ color = "#fff", text = "" }) => (
	<span
		className="loading"
		style={{ color }}>
		{text}
	</span>
);

export default Loading;
