import { useCallback, useEffect, useState } from "react";
import { getFooterMenuList } from "../../api/menu/get/getFooterMenuList";
import { APIMenuItem } from "../../api/menu/types";

import styles from "./styles.module.scss";
import { useStore } from "../../utils/store";

const FooterExternalLinks = () => {
	const language = useStore((state) => state.language);

	const [menuItems, setMenuItems] = useState<APIMenuItem[]>([]);

	const fetchDetails = useCallback(async () => {
		const { data } = await getFooterMenuList();

		if (data) {
			setMenuItems(data);
		}
	}, []);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	return (
		<div className={styles.linksContainer}>
			{menuItems.map((item, index) => (
				<div
					key={index}
					className={`${styles.itemContainer} ${
						index % 4 === 3 ? styles.lastItemInRow : ""
					}`}>
					<a
						href={item.linkPath}
						className={styles.item}>
						{language !== "ar" ? item.name : item.nameEnglish}
					</a>
				</div>
			))}
		</div>
		// <div className={styles.linksContainer}>
		// 	{menuItems.map((item) => (
		// 		<div className={styles.itemContainer}>
		// 			<a
		// 				href={item.linkPath}
		// 				className={styles.item}>
		// 				{language !== "ar" ? item.name : item.nameEnglish}
		// 			</a>
		// 		</div>
		// 	))}
		// </div>
	);
};

export default FooterExternalLinks;
