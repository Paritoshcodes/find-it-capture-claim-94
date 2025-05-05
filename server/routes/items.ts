
import express from 'express';
import pool from '../db';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, ow.owner_id, u.name as owner_name, u.email as owner_email
      FROM Objects o
      LEFT JOIN Owned ow ON o.id = ow.object_id
      LEFT JOIN Owners u ON ow.owner_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, ow.owner_id, u.name as owner_name, u.email as owner_email
       FROM Objects o
       LEFT JOIN Owned ow ON o.id = ow.object_id
       LEFT JOIN Owners u ON ow.owner_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create new item
router.post('/', async (req, res) => {
  const { name, description, status, location, ownerId } = req.body;
  
  try {
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Insert into Objects table
      const [result]: any = await conn.query(
        'INSERT INTO Objects (name, description, status, location, date_reported) VALUES (?, ?, ?, ?, NOW())',
        [name, description, status, location || null]
      );
      
      const objectId = result.insertId;
      
      // If owner provided, insert into Owned table
      if (ownerId) {
        await conn.query(
          'INSERT INTO Owned (object_id, owner_id) VALUES (?, ?)',
          [objectId, ownerId]
        );
      }
      
      await conn.commit();
      
      res.status(201).json({ 
        id: objectId,
        name,
        description,
        status,
        location,
        dateReported: new Date(),
        ownerId
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  
  try {
    const [result]: any = await pool.query(
      'UPDATE Objects SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ id: req.params.id, status });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ error: 'Failed to update item status' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Delete from Owned table first (foreign key constraint)
      await conn.query('DELETE FROM Owned WHERE object_id = ?', [req.params.id]);
      
      // Delete from Objects table
      const [result]: any = await conn.query('DELETE FROM Objects WHERE id = ?', [req.params.id]);
      
      await conn.commit();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      res.status(204).send();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
