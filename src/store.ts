import { User } from './types';

export const saveUser = (user: User, token: string): void => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const clearUser = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isLoggedIn = (): boolean => {
  return !!getToken() && !!getUser();
};
