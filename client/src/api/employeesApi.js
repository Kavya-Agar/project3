import { http } from './http';

export const fetchCashiers = () => http('/api/employees');
