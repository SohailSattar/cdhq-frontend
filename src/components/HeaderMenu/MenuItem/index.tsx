import { FC } from 'react';
import { ItemMenu } from '../../types';

interface Props {
	data: ItemMenu;
}

const MenuItem: FC<Props> = ({ data }) => {
	return (
		<li className='nav-item'>
			<a className='nav-links' href={data.url}>
				{data.name}
			</a>
			{data.subItems?.map(
				(item, index) =>
					// <a href='#'>
					item.name
				// </a>
			)}
		</li>
	);
};

export default MenuItem;
