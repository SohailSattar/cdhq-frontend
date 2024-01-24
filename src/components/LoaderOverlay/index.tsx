import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { FC } from "react";

const loadingVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: 0.5 } },
	exit: { opacity: 0, transition: { duration: 0.5 } },
};

interface Props {
	loading: boolean;
	children: any;
}

const LoaderOverlay: FC<Props> = ({ loading, children }) => {
	return (
		<div className={styles.overlayContainer}>
			{loading && (
				<motion.div
					className={styles.loader}
					variants={loadingVariants}
					initial="initial"
					animate="animate"
					exit="exit">
					<div className={styles.loaderInner}></div>
				</motion.div>
			)}
			{children}
		</div>
	);
};

export default LoaderOverlay;
