import { MenuItem, Order } from '../types';

const MENU_STORAGE_KEY = 'pos-menu-items';
const ORDERS_STORAGE_KEY = 'pos-orders';

export const getMenuItems = (): MenuItem[] => {
  const stored = localStorage.getItem(MENU_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveMenuItems = (items: MenuItem[]): void => {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  return stored ? JSON.parse(stored).map((order: any) => ({
    ...order,
    createdAt: new Date(order.createdAt)
  })) : [];
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const generateOrderId = (): string => {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-6);
  return `DH${timestamp}`;
};