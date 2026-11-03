import { useState } from 'react';
import { fetchSalesByDay, fetchSummary, fetchTopProducts } from '../../api/reportsApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { useApi } from '../../hooks/useApi';
import { formatMoney } from '../../utils/money';
import BarChart from './BarChart';

const RANGE_OPTIONS = [7, 14, 30, 60];
const DEFAULT_RANGE = 14;

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
    </div>
  );
}

export default function ReportsPanel() {
  const [days, setDays] = useState(DEFAULT_RANGE);
  const summary = useApi(() => fetchSummary(days), [days]);
  const sales = useApi(() => fetchSalesByDay(days), [days]);
  const top = useApi(() => fetchTopProducts(days), [days]);

  const failed = summary.error ?? sales.error ?? top.error;
  if (failed) return <ErrorMessage error={failed} onRetry={() => { summary.reload(); sales.reload(); top.reload(); }} />;
  if (summary.loading || sales.loading || top.loading) return <Loading />;

  return (
    <>
      <div className="panel__toolbar">
        <h2>Sales report</h2>
        <label>Period{' '}
          <select className="range-select" value={days} onChange={(event) => setDays(Number(event.target.value))}>
            {RANGE_OPTIONS.map((range) => <option key={range} value={range}>Last {range} days</option>)}
          </select>
        </label>
      </div>
      <div className="stat-grid">
        <Stat label="Revenue" value={formatMoney(summary.data.revenue)} />
        <Stat label="Orders" value={summary.data.orders.toLocaleString()} />
        <Stat label="Average order" value={formatMoney(summary.data.averageOrder)} />
      </div>
      <section className="panel" aria-labelledby="sales-heading">
        <h2 id="sales-heading">Revenue by day</h2>
        <BarChart title={`Revenue per day over the last ${days} days`}
                  data={sales.data.map((row) => ({ label: row.day, value: row.revenue }))} />
      </section>
      <section className="panel" aria-labelledby="top-heading">
        <h2 id="top-heading">Top selling drinks</h2>
        <table className="data-table">
          <thead><tr><th>Drink</th><th className="num">Units</th><th className="num">Revenue</th></tr></thead>
          <tbody>
            {top.data.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td className="num">{row.units.toLocaleString()}</td>
                <td className="num">{formatMoney(row.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
