DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  cost INTEGER  NOT NULL DEFAULT 0.00,
  revenue_amount INTEGER  NOT NULL DEFAULT 0.00,
  assigned BOOLEAN DEFAULT true

)