import { motion } from "framer-motion";

const BouncyText = () => {
	const textVariants = {
		initial: { y: 0 },
		animate: {
			y: [0, -10, 0], // Bounce effect
			transition: {
				y: {
					repeat: Infinity,
					duration: 0.5,
				},
			},
		},
	};
	return (
		<motion.div
			variants={textVariants}
			initial="initial"
			animate="animate"
			style={{
				fontSize: "24px",
				fontWeight: "bold",
				color: "#3498db", // Set your preferred text color
			}}>
			Bouncy Text
		</motion.div>
	);
};

export default BouncyText;
