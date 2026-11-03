import { useCallback, useEffect, useState } from 'react';
import { completeTicket, fetchOpenTickets, openTicketStream } from '../api/kitchenApi';

const CLOCK_TICK_MS = 1000;
const RESYNC_MS = 30_000;
const CREATED_EVENT = 'order.created';
const COMPLETED_EVENT = 'order.completed';

// Live list of open kitchen tickets: loaded once, kept current by server-sent
// events, resynced periodically, and aged locally every second.
export function useKitchenTickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const resync = useCallback(async () => {
    try {
      setTickets(await fetchOpenTickets());
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    resync();
    const stream = openTicketStream();
    stream.addEventListener(CREATED_EVENT, (event) => {
      const ticket = JSON.parse(event.data);
      setTickets((current) => (current.some((t) => t.orderId === ticket.orderId) ? current : [...current, ticket]));
    });
    stream.addEventListener(COMPLETED_EVENT, (event) => {
      const { orderId } = JSON.parse(event.data);
      setTickets((current) => current.filter((ticket) => ticket.orderId !== orderId));
    });
    const resyncTimer = setInterval(resync, RESYNC_MS);
    const clock = setInterval(
      () => setTickets((current) => current.map((ticket) => ({ ...ticket, ageSeconds: ticket.ageSeconds + 1 }))),
      CLOCK_TICK_MS,
    );
    return () => {
      stream.close();
      clearInterval(resyncTimer);
      clearInterval(clock);
    };
  }, [resync]);

  const complete = useCallback(async (orderId) => {
    await completeTicket(orderId);
    setTickets((current) => current.filter((ticket) => ticket.orderId !== orderId));
  }, []);

  return { tickets, loading, error, complete, retry: resync };
}
