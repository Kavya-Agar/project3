import { useEffect, useState } from 'react';
import { fetchCashiers } from '../../api/employeesApi';
import { fetchMenu } from '../../api/menuApi';
import { fetchOptions } from '../../api/optionsApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { VENDOR_NAME } from '../../config/constants';
import { useApi } from '../../hooks/useApi';
import { useOrderCart } from '../../hooks/useOrderCart';
import CustomizeDialog from './CustomizeDialog';
import OrderTicket from './OrderTicket';
import ProductGrid from './ProductGrid';
import './cashier.css';

const ORDER_SOURCE = 'cashier';

export default function CashierView() {
  const menu = useApi(fetchMenu);
  const options = useApi(fetchOptions);
  const cashiers = useApi(fetchCashiers);
  const cart = useOrderCart(ORDER_SOURCE);

  const [category, setCategory] = useState(null);
  const [cashierId, setCashierId] = useState('');
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (options.data && !category) setCategory(options.data.categories[0]);
    if (cashiers.data?.length && !cashierId) setCashierId(String(cashiers.data[0].employeeId));
  }, [options.data, cashiers.data, category, cashierId]);

  const failed = menu.error ?? options.error ?? cashiers.error;
  if (failed) return <ErrorMessage error={failed} onRetry={() => { menu.reload(); options.reload(); cashiers.reload(); }} />;
  if (menu.loading || options.loading || cashiers.loading || !category) return <Loading />;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const { orderId } = await cart.checkout({ employeeId: Number(cashierId) });
      setNotice(`Order #${orderId} sent to the kitchen.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cashier">
      <header className="cashier__header">
        <h1>{VENDOR_NAME} · Cashier</h1>
        <label>Cashier{' '}
          <select value={cashierId} onChange={(event) => setCashierId(event.target.value)}>
            {cashiers.data.map((cashier) => (
              <option key={cashier.employeeId} value={cashier.employeeId}>{cashier.name}</option>
            ))}
          </select>
        </label>
      </header>
      <main className="cashier__menu" id="main">
        <ProductGrid products={menu.data} categories={options.data.categories} activeCategory={category}
                     onCategoryChange={setCategory} onSelect={setSelected} />
      </main>
      <OrderTicket cart={cart} sugarLevels={options.data.sugarLevels} submitting={submitting}
                   notice={notice} error={error} onSubmit={handleSubmit} />
      {selected && (
        <CustomizeDialog product={selected} options={options.data}
                         onCancel={() => setSelected(null)}
                         onAdd={(line) => { cart.addLine(line); setNotice(null); setSelected(null); }} />
      )}
    </div>
  );
}
