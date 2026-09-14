import axios from 'axios';
import { Book } from '../types/index.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export const searchGoogleBooks = async (query: string, type: 'title' | 'isbn'): Promise<Book[]> => {
  const cacheKey = `google_${type}_${query}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached as Book[];

  try {
    const searchQuery = type === 'isbn' ? `isbn:${query}` : query;
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: searchQuery,
        maxResults: 10,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    });

    const books: Book[] = (response.data.items || []).map((item: any) => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0],
      description: item.volumeInfo.description,
      google_books_id: item.id,
      cover_art_url: item.volumeInfo.imageLinks?.thumbnail,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    cache.set(cacheKey, books);
    return books;
  } catch (error) {
    console.error('Google Books API error:', error);
    return [];
  }
};

export const searchOpenLibrary = async (query: string, type: 'title' | 'isbn'): Promise<Book[]> => {
  const cacheKey = `openlibrary_${type}_${query}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached as Book[];

  try {
    const searchType = type === 'isbn' ? 'isbn' : 'title';
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        [searchType]: query,
        limit: 10,
      },
    });

    const books: Book[] = (response.data.docs || []).map((doc: any) => ({
      title: doc.title,
      author: doc.author_name?.[0],
      description: doc.first_sentence?.[0],
      open_library_id: doc.key,
      cover_art_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    cache.set(cacheKey, books);
    return books;
  } catch (error) {
    console.error('Open Library API error:', error);
    return [];
  }
};
