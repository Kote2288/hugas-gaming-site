
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  steam_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar TEXT DEFAULT '',
  balance INTEGER DEFAULT 0,
  role VARCHAR(20) DEFAULT 'player',
  banned BOOLEAN DEFAULT FALSE,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  yukassa_id VARCHAR(100) UNIQUE,
  amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  description TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id VARCHAR(50),
  product_name VARCHAR(200),
  price INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
