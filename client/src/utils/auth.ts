import { User } from '../types';

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
