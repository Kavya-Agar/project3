import { fetchOptions } from '../../api/optionsApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { VENDOR_NAME } from '../../config/constants';
import { useApi } from '../../hooks/useApi';
import { useKitchenTickets } from '../../hooks/useKitchenTickets';
import TicketCard from './TicketCard';
import './kitchen.css';

const SECONDS_PER_MINUTE = 60;

export default function KitchenView() {
  const { tickets, loading, error, complete, retry } = useKitchenTickets();
  const options = useApi(fetchOptions);

  if (error) return <ErrorMessage error={error} onRetry={retry} />;
  if (loading || options.loading) return <Loading />;

  const oldest = tickets.reduce((max, ticket) => Math.max(max, ticket.ageSeconds), 0);
  const drinkCount = tickets.reduce((sum, t) => sum + t.items.reduce((s, item) => s + item.quantity, 0), 0);

  return (
    <div className="kitchen">
      <header className="kitchen__header">
        <h1>{VENDOR_NAME} · Kitchen</h1>
        <div className="kitchen__stats" aria-live="polite">
          <span>{tickets.length} open orders</span>
          <span>{drinkCount} drinks</span>
          <span>Oldest {Math.floor(oldest / SECONDS_PER_MINUTE)} min</span>
        </div>
      </header>
      <main id="main">
        {tickets.length === 0 ? (
          <p className="kitchen__empty" role="status">All caught up. New orders appear here instantly.</p>
        ) : (
          <div className="kitchen__grid">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.orderId} ticket={ticket} sugarLevels={options.data.sugarLevels}
                          onComplete={complete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
