import { FC } from 'react';
import { ItemMenu } from '../../types';
import MenuItem from '../MenuItem';

interface Props {
	data: ItemMenu[];
}

const MenuList: FC<Props> = ({ data }) => {
	return (
		<div className='collapse navbar-collapse' id='main_nav'>
			<ul className='navbar-nav'>
				{data.map((item, index) => (
					<MenuItem data={item} key={index} />
				))}
			</ul>
			{/* <ul className='navbar-nav '>
				<li className='nav-item'>
					<a className="nav-links" routerLink="../administration/users/1">نظام المشرفين</a>
				</li>
			</ul>
			<ul className='navbar-nav '>
				<li className='nav-item'>
					<a className="nav-links" routerLink="../administration/projects"> إدارة المشاريع</a>
				</li>
			</ul> */}
		</div>
	);
};

export default MenuList;
