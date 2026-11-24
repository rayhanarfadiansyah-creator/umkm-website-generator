CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_one_paid_per_order
ON payments(order_id)
WHERE status = 'paid';

CREATE TRIGGER IF NOT EXISTS trg_payment_paid_guard
BEFORE UPDATE OF status ON payments
WHEN NEW.status = 'paid'
BEGIN
  SELECT RAISE(ABORT, 'Order tidak valid untuk pembayaran')
  WHERE NOT EXISTS (
    SELECT 1 FROM orders
    WHERE id = NEW.order_id
      AND status NOT IN ('cancelled', 'refunded')
  );

  SELECT RAISE(ABORT, 'Website tidak valid untuk penerbitan')
  WHERE NOT EXISTS (
    SELECT 1 FROM websites
    WHERE order_id = NEW.order_id
      AND status IN ('draft', 'preview', 'published')
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_order_paid_guard
BEFORE UPDATE OF status ON orders
WHEN NEW.status = 'paid'
BEGIN
  SELECT RAISE(ABORT, 'Order harus memiliki payment paid')
  WHERE NOT EXISTS (
    SELECT 1 FROM payments
    WHERE order_id = NEW.id AND status = 'paid'
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_website_published_guard
BEFORE UPDATE OF status ON websites
WHEN NEW.status = 'published'
BEGIN
  SELECT RAISE(ABORT, 'Website hanya bisa diterbitkan setelah pembayaran lunas')
  WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    INNER JOIN payments p ON p.order_id = o.id
    WHERE o.id = NEW.order_id
      AND o.status = 'paid'
      AND p.status = 'paid'
  );
END;