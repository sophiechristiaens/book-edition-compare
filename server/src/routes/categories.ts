import express, { Request, Response } from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category with books
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT c.*, COUNT(bc.book_id) as book_count FROM categories c
       LEFT JOIN book_categories bc ON c.id = bc.category_id
       WHERE c.slug = $1
       GROUP BY c.id`,
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
