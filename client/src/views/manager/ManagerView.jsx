import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { VENDOR_NAME } from '../../config/constants';
import InventoryPanel from './InventoryPanel';
import MenuManager from './MenuManager';
import ReportsPanel from './ReportsPanel';
import './manager.css';

const TABS = [
  { key: 'reports', label: 'Reports', Panel: ReportsPanel },
  { key: 'menu', label: 'Menu', Panel: MenuManager },
  { key: 'inventory', label: 'Inventory', Panel: InventoryPanel },
];

export default function ManagerView() {
  const { user, signOut } = useAuth();
  const [activeKey, setActiveKey] = useState(TABS[0].key);
  const { Panel } = TABS.find((tab) => tab.key === activeKey);

  return (
    <div className="manager">
      <header className="manager__header">
        <h1>{VENDOR_NAME} · Manager Dashboard</h1>
        {user && (
          <div className="manager__user">
            <span>{user.name}</span>
            <button className="btn" type="button" onClick={signOut}>Sign out</button>
          </div>
        )}
      </header>
      <main className="manager__body" id="main">
        <div className="tabs" role="tablist" aria-label="Dashboard sections">
          {TABS.map((tab) => (
            <button key={tab.key} type="button" role="tab" aria-selected={tab.key === activeKey}
                    onClick={() => setActiveKey(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div role="tabpanel"><Panel /></div>
      </main>
    </div>
  );
}
