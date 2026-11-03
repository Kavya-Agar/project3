// Groups flat order-item rows (one per drink line) into kitchen tickets.
export function groupIntoTickets(rows) {
  const tickets = new Map();
  for (const row of rows) {
    if (!tickets.has(row.orderId)) {
      tickets.set(row.orderId, {
        orderId: row.orderId,
        source: row.source,
        placedAt: row.placedAt,
        ageSeconds: row.ageSeconds,
        items: [],
      });
    }
    tickets.get(row.orderId).items.push({
      name: row.name,
      quantity: row.quantity,
      toppings: row.toppings ? row.toppings.split(', ') : [],
      iceLevel: row.iceLevel,
      sugarLevel: row.sugarLevel,
    });
  }
  return [...tickets.values()];
}
