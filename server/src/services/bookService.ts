import pool from '../db/connection.js';
import { Book, Edition } from '../types/index.js';
import { searchGoogleBooks, searchOpenLibrary } from './externalApis.js';

export const searchBooks = async (query: string, type: 'title' | 'isbn' = 'title'): Promise<Book[]> => {
  // First check local database
  let localBooks: Book[] = [];
  
  if (type === 'title') {
    const result = await pool.query(
      'SELECT * FROM books WHERE title ILIKE $1 LIMIT 10',
      [`%${query}%`]
    );
    localBooks = result.rows;
  } else if (type === 'isbn') {
    const result = await pool.query(
      'SELECT b.* FROM books b JOIN editions e ON b.id = e.book_id WHERE e.isbn = $1',
      [query]
    );
    localBooks = result.rows;
  }

  // If found locally, return
  if (localBooks.length > 0) {
    return localBooks;
  }

  // Otherwise search external APIs
  const externalBooks = await searchExternalApis(query, type);
  return externalBooks;
};

const searchExternalApis = async (query: string, type: 'title' | 'isbn'): Promise<Book[]> => {
  try {
    const googleBooks = await searchGoogleBooks(query, type);
    const openLibraryBooks = await searchOpenLibrary(query, type);
    
    // Combine and deduplicate
    const allBooks = [...googleBooks, ...openLibraryBooks];
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.google_books_id || book.open_library_id, book])).values()
    );
    
    return uniqueBooks.slice(0, 10);
  } catch (error) {
    console.error('Error searching external APIs:', error);
    return [];
  }
};

export const getBookById = async (id: number): Promise<Book | null> => {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getEditionsByBookId = async (bookId: number): Promise<Edition[]> => {
  const result = await pool.query(
    'SELECT * FROM editions WHERE book_id = $1 ORDER BY retailer ASC',
    [bookId]
  );
  return result.rows;
};

export const createBook = async (book: Partial<Book>): Promise<Book> => {
  const { title, author, description, google_books_id, open_library_id, cover_art_url } = book;
  const result = await pool.query(
    `INSERT INTO books (title, author, description, google_books_id, open_library_id, cover_art_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, author, description, google_books_id, open_library_id, cover_art_url]
  );
  return result.rows[0];
};

export const createEdition = async (edition: Partial<Edition>): Promise<Edition> => {
  const { book_id, title, retailer, retailer_url, price, isbn, cover_art_url, has_sprayed_edges, has_dust_jacket, is_naked_book, illustrations, introductions, special_features, availability } = edition;
  const result = await pool.query(
    `INSERT INTO editions (book_id, title, retailer, retailer_url, price, isbn, cover_art_url, has_sprayed_edges, has_dust_jacket, is_naked_book, illustrations, introductions, special_features, availability)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
    [book_id, title, retailer, retailer_url, price, isbn, cover_art_url, has_sprayed_edges, has_dust_jacket, is_naked_book, illustrations, introductions, special_features, availability]
  );
  return result.rows[0];
};
