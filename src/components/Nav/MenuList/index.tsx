import { FC } from "react";
import NavMenuItem from "../MenuItem";

interface APIMenuItem {
	title: string;
	link: string;
	items?: APIMenuItem[];
}

interface Props {
	data: APIMenuItem[];
}

const NavMenuList: FC<Props> = ({ data }) => {
	return (
		<>
			{data.map((x, index) => (
				<NavMenuItem
					title={x.title}
					link={x.link}
					items={x.items}
					key={index}
				/>
			))}
		</>
	);
};

export default NavMenuList;
