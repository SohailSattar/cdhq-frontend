import React, { FC } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

export interface Props
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	isPrimary?: boolean;
	children: string | React.ReactNode;
	className?: string;
	isRound?: boolean;
	isGradient?: boolean;
	withIcon?: boolean;
	isCritical?: boolean;
	withIconTransparent?: boolean;
	tooltip?: string;
}

const Button: FC<Props> = ({
	isPrimary,
	className,
	children,
	isRound = false,
	isGradient = false,
	withIcon = false,
	isCritical = false,
	withIconTransparent = false,
	disabled = false,
	tooltip,
	...buttonProps
}) => {
	const classes = clsx(
		styles.button,
		isPrimary && styles.primary,
		className,
		isRound && styles.roundButton,
		isGradient && styles.gradiant,
		withIcon && styles.withIcon,
		isCritical && styles.critical,
		withIconTransparent && styles.withIconTransparent,
		disabled && styles.disabled
	);
	return (
		<button
			className={classes}
			{...buttonProps}
			title={tooltip}>
			{children}
		</button>
	);
};

export default Button;
