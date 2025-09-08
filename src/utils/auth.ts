import { User } from '../types';

const AUTH_STORAGE_KEY = 'pos-current-user';

// Tài khoản mặc định
const defaultUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    role: 'admin',
    name: 'Quản lý'
  },
  {
    id: 'employee-1',
    username: 'nhanvien',
    role: 'employee',
    name: 'Nhân viên'
  }
];

const defaultPasswords: Record<string, string> = {
  'admin': 'admin123',
  'nhanvien': 'nv123'
};

export const login = (username: string, password: string): User | null => {
  const user = defaultUsers.find(u => u.username === username);
  if (user && defaultPasswords[username] === password) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isEmployee = (user: User | null): boolean => {
  return user?.role === 'employee';
};