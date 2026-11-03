import { http } from './http';

export const fetchInventory = () => http('/api/inventory');
export const restockItem = (id) => http(`/api/inventory/${id}/restock`, { method: 'POST' });
