import React, { useState, useEffect } from "react";
import $ from "jquery";

const NewsTicker: React.FC = () => {
	const [news, setNews] = useState<string[]>([
		"1111",
		"2222",
		"3333",
		"444",
		"555",
		"6666",
		"4477888",
		"4324537453745",
		"45374453",
		"453453",
		"42453543",
	]);

	useEffect(() => {
		const interval = setInterval(() => {
			const lastNewsDiv = $("#newsParent .newsDiv").last();
			lastNewsDiv
				.css({ "background-color": "#DDD" })
				.hide()
				.prependTo("#newsParent")
				.slideDown("slow");
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			id="newsParent"
			style={{
				maxHeight: "400px",
				border: "2px red solid",
				overflow: "hidden",
			}}>
			{news.map((item, index) => (
				<div
					key={index}
					className="newsDiv"
					style={{
						height: "100px",
						border: "2px #CCC solid",
						backgroundColor: index === 0 ? "#DDD" : "inherit",
					}}>
					{item}
				</div>
			))}
		</div>
	);
};

export default NewsTicker;
