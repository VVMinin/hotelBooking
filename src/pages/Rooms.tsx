import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {getRooms, setRooms} from '../utils/rooms';
import RoomCard from '../components/RoomCard';
import styles from './Styles.module.css';

const Rooms: React.FC = () => {
	const [rooms, setRoomsState] = useState<any[]>([]);
	const location = useLocation();

	useEffect(() => {
		let currentRooms = getRooms();
		if (currentRooms.length === 0) {
			const defaultRooms = [
				{
					id: '1',
					name: 'Уютный Стандарт',
					price: 2500,
					roomCount: 1,
					description: 'Классический однокомнатный номер с двуспальной кроватью. Идеально подходит для коротких поездок.',
					images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
				{
					id: '2',
					name: 'Просторный Стандарт',
					price: 2800,
					roomCount: 1,
					description: 'Улучшенный однокомнатный номер с большой рабочей зоной и видом на тихий внутренний двор.',
					images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
				{
					id: '3',
					name: 'Семейный Люкс',
					price: 5500,
					roomCount: 2,
					description: 'Двухкомнатный люкс с отдельной гостиной и спальней. Прекрасный выбор для семейного отдыха.',
					images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
				{
					id: '4',
					name: 'Делюкс с балконом',
					price: 4200,
					roomCount: 1,
					description: 'Элегантный номер с панорамными окнами и собственным балконом с видом на парк.',
					images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80']
				},
				{
					id: '5',
					name: 'Номер "Комфорт"',
					price: 3100,
					roomCount: 1,
					description: 'Однокомнатный номер повышенной комфортности с ортопедическим матрасом и выбором подушек.',
					images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
				{
					id: '6',
					name: 'Президентский Пентхаус',
					price: 12000,
					roomCount: 3,
					description: 'Роскошный трехкомнатный пентхаус на последнем этаже с террасой и панорамным видом на город.',
					images: ['https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
				{
					id: '7',
					name: 'Студия',
					price: 3500,
					roomCount: 1,
					description: 'Просторный номер-студия с кухонной зоной и всем необходимым для длительного проживания.',
					images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
				{
					id: '8',
					name: 'Номер для новобрачных',
					price: 6500,
					roomCount: 2,
					description: 'Романтический двухкомнатный номер с джакузи и специальным обслуживанием для молодоженов.',
					images: ['https://images.unsplash.com/photo-1594563703937-fdc640497dcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},


				{
					id: '11',
					name: 'Стандартный Улучшенный',
					price: 2900,
					roomCount: 1,
					description: 'Просторный номер с дополнительной зоной отдыха и современным дизайном.',
					images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},

				{
					id: '13',
					name: 'Стандартный Семейный',
					price: 3200,
					roomCount: 1,
					description: 'Номер с возможностью размещения до 4-х человек. Идеально для небольших семей.',
					images: ['https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80']
				},
				{
					id: '14',
					name: 'Стандартный Комфорт+',
					price: 3300,
					roomCount: 1,
					description: 'Номер с расширенным набором удобств и улучшенной звукоизоляцией.',
					images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},

				{
					id: '16',
					name: 'Люкс "Арт-деко"',
					price: 6800,
					roomCount: 2,
					description: 'Изысканный люкс, оформленный в стиле арт-деко, с уникальной мебелью и произведениями искусства.',
					images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80']
				},
			];
			setRooms(defaultRooms);
			currentRooms = defaultRooms;
		}
		setRoomsState(currentRooms);
	}, [location]);

	return (
		<div className={styles.container}>
			<h1>Доступные номера</h1>
			<div className={styles.grid}>
				{rooms.map(room => (
					<RoomCard
						key={room.id}
						room={room}
					/>
				))}
			</div>
		</div>
	);
};

export default Rooms;
