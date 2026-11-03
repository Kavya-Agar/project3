import { Router } from 'express';
import { SERVER } from '../config.js';
import { completeTicket, getTicket, listOpenTickets } from '../services/kitchenService.js';
import { ORDER_EVENTS, subscribe } from '../services/orderEvents.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';

const router = Router();

router.get('/orders', asyncHandler(async (req, res) => res.json(await listOpenTickets())));

router.patch(
  '/orders/:id/complete',
  asyncHandler(async (req, res) => {
    const orderId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(orderId)) throw badRequest('Invalid order id');
    await completeTicket(orderId);
    res.status(204).end();
  }),
);

const sendEvent = (res, type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);

// Server-Sent Events: pushes new and completed tickets to every open kitchen screen.
router.get('/stream', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();

  const unsubscribeCreated = subscribe(ORDER_EVENTS.CREATED, async ({ orderId }) => {
    const ticket = await getTicket(orderId).catch(() => null);
    if (ticket) sendEvent(res, ORDER_EVENTS.CREATED, ticket);
  });
  const unsubscribeCompleted = subscribe(ORDER_EVENTS.COMPLETED, (data) =>
    sendEvent(res, ORDER_EVENTS.COMPLETED, data),
  );
  const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), SERVER.SSE_HEARTBEAT_MS);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribeCreated();
    unsubscribeCompleted();
  });
});

export default router;
