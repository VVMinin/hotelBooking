import { setItem, getItem } from './storage';

const BOOKINGS_KEY = 'bookings';

export const getBookings = () => {
  return getItem(BOOKINGS_KEY) || [];
};

export const setBookings = (bookings: any) => {
  setItem(BOOKINGS_KEY, bookings);
};

export const addBooking = (booking: any) => {
  const bookings = getBookings();
  bookings.push(booking);
  setBookings(bookings);
};

export const deleteBooking = (bookingId: string) => {
  let bookings = getBookings();
  bookings = bookings.filter((b: any) => b.id !== bookingId);
  setBookings(bookings);
};

export const getBookingsByUserId = (userId: string) => {
  const bookings = getBookings();
  return bookings.filter((b: any) => b.userId === userId);
};
