-- Kitchen routing: orders start 'open' and are marked 'completed' from the
-- kitchen display. Historical orders default to completed.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'completed';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'cashier';
CREATE INDEX IF NOT EXISTS idx_orders_open ON orders(order_time) WHERE status = 'open';
