import { FunctionComponent, useState } from 'react';
import clsx from 'clsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 } from 'uuid';

import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as MinusIcon } from './icons/minus.svg';

import styles from './styles.module.scss';
import './animation.scss';

export interface Props {
	title: string;
	opened?: boolean;
	className?: string;
	children: any;
}

const Accordian: FunctionComponent<Props> = ({
	title,
	children,
	className,
	opened = false,
}) => {
	const [open, setOpen] = useState(opened);
	const id = v4();

	return (
		<div className={clsx(styles.accordion, className)}>
			<div
				className={clsx(styles.accordionHeader)}
				onClick={() => setOpen(!open)}>
				<div className={styles.accordionActionIcon}>
					{open ? <MinusIcon /> : <PlusIcon />}
				</div>
				<p className={styles.accordionTitle}>{title}</p>
				<hr className={styles.line} />
			</div>

			<TransitionGroup>
				<CSSTransition
					classNames='content'
					timeout={{ enter: 500, exit: 500 }}
					key={id}>
					<div className={styles.accordionContent}>{open && children}</div>
				</CSSTransition>
			</TransitionGroup>
		</div>
	);
};

export default Accordian;
