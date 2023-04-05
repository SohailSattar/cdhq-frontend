import { FC } from "react";

import styles from "./styles.module.scss";

interface Props {
	src: string;
}

const CellThumbnailImage: FC<Props> = ({ src }) => {
	return <img src={src} alt="thumbnail" className={styles.image} />;
};

export default CellThumbnailImage;
