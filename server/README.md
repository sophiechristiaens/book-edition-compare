# Book Edition Compare - Backend

Node.js + Express API for comparing special book editions.

## Features

- 🔍 Search books from Google Books and Open Library APIs
- 📚 Manage book editions across multiple retailers
- 🏷️ Category management
- ⭐ Curated lists
- 💾 PostgreSQL database
- ⚡ Caching for API requests

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL

### Installation

```bash
cd server
npm install
cp .env.example .env
```

### Environment Variables

Update `.env` with your database credentials and API keys:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_edition_compare
DB_USER=postgres
DB_PASSWORD=your_password
GOOGLE_BOOKS_API_KEY=your_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```bash
# Create database
createdb book_edition_compare

# Run migrations
npm run migrate
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Books

- `GET /api/books/search?q=query&type=title` - Search books
- `GET /api/books/:id` - Get book details
- `GET /api/books/:id/editions` - Get all editions of a book

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category with book count

### Curated Lists

- `GET /api/curated-lists` - Get all lists
- `GET /api/curated-lists/:slug` - Get specific list

## Database Schema

### Tables

- **books** - Main book information
- **editions** - Individual special editions with retailer info
- **categories** - Book categories
- **book_categories** - Many-to-many relationship
- **curated_lists** - Themed collections
- **curated_list_items** - Many-to-many relationship

## Retailers Supported

- Waterstones
- Barnes & Noble
- Target
- FairyLoot
- Illumicrate
- Bol.com
- Amazon
- Custom retailers

## Technologies

- Express.js
- PostgreSQL
- TypeScript
- Axios
- Node-cache
