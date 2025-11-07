import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getBookingsByUserId, deleteBooking } from '../utils/bookings';
import { getCurrentUser } from '../utils/auth';
import styles from './Styles.module.css';

const Bookings: React.FC = () => {
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserBookings(getBookingsByUserId(currentUser.username));
    } else {
      setUserBookings([]);
    }
  }, [location]);

  const handleDeleteBooking = (bookingId: string) => {
    deleteBooking(bookingId);
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserBookings(getBookingsByUserId(currentUser.username));
    }
  };

  const currentUser = getCurrentUser();
  if (!currentUser) {
    return <div className={styles.container}>Пожалуйста, войдите в систему, чтобы просмотреть свои бронирования.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Мои бронирования</h1>
      {userBookings.length === 0 ? (
        <p>У вас пока нет бронирований.</p>
      ) : (
        <div className={styles.grid}>
          {userBookings.map(booking => (
            <div key={booking.id} className={styles.card}>
              <h3>{booking.roomName}</h3>
              <p>Заезд: {booking.checkIn}</p>
              <p>Выезд: {booking.checkOut}</p>
              <p>Количество человек: {booking.numPeople}</p>
              <button onClick={() => handleDeleteBooking(booking.id)}>Удалить бронь</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
