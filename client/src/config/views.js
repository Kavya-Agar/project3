// Interface views reachable from the Portal Hub. `component` is resolved by
// App.jsx, so a view appears as soon as its file exists.
export const VIEWS = [
  {
    key: 'manager',
    path: '/manager',
    label: 'Manager Dashboard',
    description: 'Menu, sales reports and inventory',
    component: './views/manager/ManagerView.jsx',
    requiresAuth: true,
  },
  {
    key: 'cashier',
    path: '/cashier',
    label: 'Cashier Screen',
    description: 'Ring up customer orders',
    component: './views/cashier/CashierView.jsx',
  },
  {
    key: 'kiosk',
    path: '/kiosk',
    label: 'Customer Kiosk',
    description: 'Self-service ordering',
    component: './views/kiosk/KioskView.jsx',
  },
  {
    key: 'kitchen',
    path: '/kitchen',
    label: 'Kitchen Display',
    description: 'Live order tickets',
    component: './views/kitchen/KitchenView.jsx',
  },
];
