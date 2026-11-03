-- Kiosk orders need an employee row to satisfy orders.employee_id.
INSERT INTO employees (employee_id, name, hours, pay_per_hour, role)
VALUES (0, 'Self-Service Kiosk', 0, 0, 'Kiosk')
ON CONFLICT (employee_id) DO NOTHING;
