import { http } from './http';

export const fetchMenu = () => http('/api/menu');
export const fetchFullMenu = () => http('/api/menu/all');
export const createMenuItem = (item) => http('/api/menu', { method: 'POST', body: item });
export const updateMenuItem = (id, item) => http(`/api/menu/${id}`, { method: 'PUT', body: item });
