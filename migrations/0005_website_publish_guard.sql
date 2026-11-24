
DROP TRIGGER IF EXISTS trg_website_published_guard;

CREATE TRIGGER trg_website_published_guard
BEFORE UPDATE OF status ON websites
WHEN NEW.status = 'published'
BEGIN
  SELECT RAISE(ABORT, 'Status website tidak valid untuk penerbitan')
  WHERE OLD.status NOT IN ('draft', 'preview');

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
