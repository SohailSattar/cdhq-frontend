import { motion } from "framer-motion";
import styles from "./styles.module.scss";

const loadingVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: 0.5 } },
	exit: { opacity: 0, transition: { duration: 0.5 } },
};

const Loader = () => {
	return (
		<motion.div
			// initial={{ opacity: 0 }}
			// animate={{ opacity: 1 }}
			// exit={{ opacity: 0 }}
			variants={loadingVariants}
			initial="initial"
			animate="animate"
			exit="exit">
			<div className={styles.loader}></div>
		</motion.div>
	);
};

export default Loader;
