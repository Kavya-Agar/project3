import { http } from './http';

export const fetchSummary = (days) => http(`/api/reports/summary?days=${days}`);
export const fetchSalesByDay = (days) => http(`/api/reports/sales-by-day?days=${days}`);
export const fetchTopProducts = (days) => http(`/api/reports/top-products?days=${days}`);
