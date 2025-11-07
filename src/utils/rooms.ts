import { setItem, getItem } from './storage';

const ROOMS_KEY = 'rooms';

export const getRooms = () => {
  return getItem(ROOMS_KEY) || [];
};

export const setRooms = (rooms: any) => {
  setItem(ROOMS_KEY, rooms);
};

export const addRoom = (room: any) => {
  const rooms = getRooms();
  rooms.push(room);
  setRooms(rooms);
};

export const updateRoom = (updatedRoom: any) => {
  let rooms = getRooms();
  rooms = rooms.map((room: any) => (room.id === updatedRoom.id ? updatedRoom : room));
  setRooms(rooms);
};

export const deleteRoom = (roomId: string) => {
  let rooms = getRooms();
  rooms = rooms.filter((r: any) => r.id !== roomId);
  setRooms(rooms);
};

export const getRoomById = (roomId: string) => {
  const rooms = getRooms();
  return rooms.find((r: any) => r.id === roomId);
};
