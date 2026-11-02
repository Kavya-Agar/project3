-- Orders and order items use plain INT keys; sequences let concurrent
-- cashier and kiosk requests allocate ids safely.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'orders_order_id_seq') THEN
    EXECUTE format('CREATE SEQUENCE orders_order_id_seq START %s',
                   (SELECT COALESCE(MAX(order_id), 0) + 1 FROM orders));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'order_items_order_item_id_seq') THEN
    EXECUTE format('CREATE SEQUENCE order_items_order_item_id_seq START %s',
                   (SELECT COALESCE(MAX(order_item_id), 0) + 1 FROM order_items));
  END IF;
END $$;
