-- Books table
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  description TEXT,
  google_books_id VARCHAR(255) UNIQUE,
  open_library_id VARCHAR(255) UNIQUE,
  cover_art_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Editions table
CREATE TABLE IF NOT EXISTS editions (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title VARCHAR(255),
  retailer VARCHAR(100) NOT NULL,
  retailer_url VARCHAR(500),
  price DECIMAL(10, 2),
  isbn VARCHAR(20) UNIQUE,
  cover_art_url VARCHAR(500),
  has_sprayed_edges BOOLEAN DEFAULT FALSE,
  has_dust_jacket BOOLEAN DEFAULT FALSE,
  is_naked_book BOOLEAN DEFAULT FALSE,
  illustrations TEXT,
  introductions TEXT,
  special_features TEXT[],
  availability VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book categories junction table
CREATE TABLE IF NOT EXISTS book_categories (
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

-- Curated lists table
CREATE TABLE IF NOT EXISTS curated_lists (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Curated list items junction table
CREATE TABLE IF NOT EXISTS curated_list_items (
  list_id INTEGER NOT NULL REFERENCES curated_lists(id) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  sort_order INTEGER,
  PRIMARY KEY (list_id, book_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_editions_book_id ON editions(book_id);
CREATE INDEX IF NOT EXISTS idx_editions_retailer ON editions(retailer);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_book_categories_category_id ON book_categories(category_id);
