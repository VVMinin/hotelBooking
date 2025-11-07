import { setItem, getItem, removeItem } from './storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const getUsers = () => {
    return getItem(USERS_KEY) || [];
}

export const setUsers = (users: any) => {
    try {
        setItem(USERS_KEY, users);
    } catch (e: any) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            console.error("Ошибка: Превышен лимит localStorage. Не удалось сохранить пользователей.", e);
            alert("Ошибка: Превышен лимит хранилища браузера. Пожалуйста, очистите Local Storage (F12 -> Application -> Local Storage) и перезагрузите страницу.");
        } else {
            console.error("Ошибка при сохранении пользователей:", e);
        }
    }
}

export const registerUser = (user: any) => {
  const users = getUsers();
  const existingUser = users.find((u: any) => u.username === user.username);
  if (existingUser) {
    throw new Error('Пользователь с таким именем уже существует');
  }
  users.push(user);
  setUsers(users);
};

export const loginUser = (credentials: any) => {
  const users = getUsers();
  const user = users.find((u: any) => u.username === credentials.username && credentials.password === u.password);
  if (!user) {
    throw new Error('Неверные учетные данные');
  }
  setItem(CURRENT_USER_KEY, user);
  return user;
};

export const logoutUser = () => {
  removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  return getItem(CURRENT_USER_KEY);
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const updateUser = (username: string, updatedData: any) => {
  let users = getUsers();
  const userIndex = users.findIndex((u: any) => u.username === username);
  if (userIndex === -1) {
    throw new Error("Пользователь не найден.");
  }
  const originalRole = users[userIndex].role;
  users[userIndex] = { ...users[userIndex], ...updatedData, role: originalRole };
  setUsers(users);
};

export const deleteUser = (username: string) => {
  let users = getUsers();
  users = users.filter((u: any) => u.username !== username);
  setUsers(users);
};
