import { http } from './http';

export const submitOrder = (order) => http('/api/orders', { method: 'POST', body: order });
