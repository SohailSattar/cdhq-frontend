import { FC } from "react";

import styles from "./styles.module.scss";

interface Props {
	postedDate: string;
}

const NewsMeta: FC<Props> = ({ postedDate }) => {
	return <>Dated: {postedDate} </>;
};

export default NewsMeta;
