import { API_BASE } from '../config/constants';
import { http } from './http';

export const fetchOpenTickets = () => http('/api/kitchen/orders');
export const completeTicket = (orderId) => http(`/api/kitchen/orders/${orderId}/complete`, { method: 'PATCH' });
export const openTicketStream = () => new EventSource(`${API_BASE}/api/kitchen/stream`);
