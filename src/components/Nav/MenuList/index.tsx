import { FC } from "react";
import NavMenuItem from "../MenuItem";
import { APIMenuItem } from "../../../api/menu/types";
import { useStore } from "../../../utils/store";

interface Props {
	data: APIMenuItem[];
}

const NavMenuList: FC<Props> = ({ data }) => {
	const language = useStore((state) => state.language);

	return (
		<>
			{data.map((x, index) => (
				<NavMenuItem
					title={language !== "ar" ? x.name : x.nameEnglish}
					items={x.children}
					key={index}
				/>
			))}
		</>
	);
};

export default NavMenuList;
