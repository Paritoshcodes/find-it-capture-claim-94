
import express from 'express';
import pool from '../db';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Owners');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Owners WHERE id = ?', [req.params.id]);
    
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user or get existing by email
router.post('/login', async (req, res) => {
  const { email, name, dob } = req.body;
  
  try {
    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM Owners WHERE email = ?',
      [email]
    );
    
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      // User exists, return user data
      return res.json(existingUsers[0]);
    }
    
    // User doesn't exist, create new user
    const [result]: any = await pool.query(
      'INSERT INTO Owners (name, email, dob) VALUES (?, ?, ?)',
      [name, email, dob]
    );
    
    const newUser = {
      id: result.insertId,
      name,
      email,
      dob
    };
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error during user login/register:', error);
    res.status(500).json({ error: 'Failed to login/register' });
  }
});

// Get user's items
router.get('/:id/items', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.*
       FROM Objects o
       JOIN Owned ow ON o.id = ow.object_id
       WHERE ow.owner_id = ?`,
      [req.params.id]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

export default router;
