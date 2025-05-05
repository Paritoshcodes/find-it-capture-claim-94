
import express from 'express';
import pool from '../db';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM Admins WHERE email = ? AND password = ?',
      [email, password] // In a real app, you would use hashed passwords
    );
    
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ ...rows[0], isAdmin: true });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
