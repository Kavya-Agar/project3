import { useCallback, useMemo, useState } from 'react';
import { submitOrder } from '../api/ordersApi';

let nextLineId = 1;

// Shared cart for the cashier and kiosk screens. Lines come from useDrinkConfig.
export function useOrderCart(source) {
  const [lines, setLines] = useState([]);

  const addLine = useCallback(
    (line) => setLines((current) => [...current, { ...line, lineId: nextLineId++ }]),
    [],
  );
  const removeLine = useCallback(
    (lineId) => setLines((current) => current.filter((line) => line.lineId !== lineId)),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines],
  );
  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);

  // Resolves with { orderId, total } and empties the cart on success.
  const checkout = useCallback(
    async (extra = {}) => {
      const items = lines.map(({ productId, quantity, toppings, iceLevel, sugarLevel }) => ({
        productId, quantity, toppings, iceLevel, sugarLevel,
      }));
      const result = await submitOrder({ source, items, ...extra });
      setLines([]);
      return result;
    },
    [lines, source],
  );

  return { lines, total, itemCount, addLine, removeLine, clear, checkout };
}
