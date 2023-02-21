import { FC } from 'react';

import styles from './styles.module.scss';

interface Props {
	imagePath: string;
}

const ImageLogo: FC<Props> = ({ imagePath }) => {
	return (
		<header className={styles.imageLogo}>
			<div className='logo-wrapper'>
				<img src={imagePath} className={styles.imgFluid} alt='MOI Logo' />
			</div>
		</header>
	);
};

export default ImageLogo;
