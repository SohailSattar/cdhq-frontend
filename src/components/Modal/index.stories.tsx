import { Story } from '@storybook/react';
import Modal from '.';

export default {
	title: 'Components/Modal',
	component: Modal,
};

const a = () => {};
const data = {
	image:
		'https://images.squarespace-cdn.com/content/v1/5cf5590d552e110001aeae46/1565069411153-K9V2CHNNWTKEZBPVJQ43/ke17ZwdGBToddI8pDm48kHgKuPRg5WMep4gbqIPsFchZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PI4ULaFZXJdIqjqTzo5y7x3ek9e-f-ZuYeEw5P0h33OzYKMshLAGzx4R3EDFOm1kBS/IMG_1235.jpg',
	betTitle: 'bet65 Park Kyneton',
	title: 'Monday Racing',
	date: 'Friday, 29th January 2021',
	gateTime: 'Gates open at 11:00',
	location: 'LOT JJ Victoria Cross Parade',
	list: [
		{
			title: 'Fashionables Sail Shades Maiden Plate',
			length: '1590M',
			time: '7:00am',
			gate: 'MDN-SW',
		},
		{
			title: 'Fashionables Sail Shades Maiden Plate',
			length: '1590M',
			time: '7:00am',
			gate: 'MDN-SW',
		},
		{
			title: 'Fashionables Sail Shades Maiden Plate',
			length: '1590M',
			time: '7:00am',
			gate: 'MDN-SW',
		},
	],
};

const Template: Story = (args) => (
	<Modal isOpen={true} onClose={a} {...args}>
		Hello
	</Modal>
);

export const Primary = Template.bind({});
Primary.args = {};
