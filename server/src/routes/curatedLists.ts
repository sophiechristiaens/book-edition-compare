import express, { Request, Response } from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// Get all curated lists
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT cl.*, COUNT(cli.book_id) as book_count FROM curated_lists cl
       LEFT JOIN curated_list_items cli ON cl.id = cli.list_id
       GROUP BY cl.id
       ORDER BY cl.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching curated lists:', error);
    res.status(500).json({ error: 'Failed to fetch curated lists' });
  }
});

// Get specific curated list with books
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT cl.*, COUNT(cli.book_id) as book_count FROM curated_lists cl
       LEFT JOIN curated_list_items cli ON cl.id = cli.list_id
       WHERE cl.slug = $1
       GROUP BY cl.id`,
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curated list not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching curated list:', error);
    res.status(500).json({ error: 'Failed to fetch curated list' });
  }
});

export default router;
