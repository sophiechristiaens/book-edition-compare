import express, { Request, Response } from 'express';
import { searchBooks, getBookById, getEditionsByBookId } from '../services/bookService.js';

const router = express.Router();

// Search books by title or ISBN
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    const searchType = (type as 'title' | 'isbn') || 'title';
    const books = await searchBooks(q as string, searchType);
    res.json(books);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get a specific book
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await getBookById(parseInt(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Get all editions of a book
router.get('/:id/editions', async (req: Request, res: Response) => {
  try {
    const editions = await getEditionsByBookId(parseInt(req.params.id));
    res.json(editions);
  } catch (error) {
    console.error('Error fetching editions:', error);
    res.status(500).json({ error: 'Failed to fetch editions' });
  }
});

export default router;
