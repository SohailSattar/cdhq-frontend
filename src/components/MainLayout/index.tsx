import { FC } from "react";
import { Footer, Menu } from "..";
interface Props {
	children: any;
}

const MainLayout: FC<Props> = ({ children }) => {
	return (
		<>
			<Menu title={"tess"} />
			<div>{children}</div>

			<Footer />
		</>
	);
};

export default MainLayout;
