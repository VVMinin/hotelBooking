export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
    localStorage.removeItem(key);
    return null;
  }
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
