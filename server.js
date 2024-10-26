import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'records.db');

// Database initialization with better error handling
let db;
try {
  db = new Database(dbPath, { verbose: console.log });
  console.log('Connected to SQLite database');

  // Initialize database schema
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);
} catch (err) {
  console.error('Failed to connect to database:', err);
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// API Routes
app.get('/api/records', (req, res, next) => {
  try {
    const stmt = db.prepare('SELECT * FROM records ORDER BY created_at DESC');
    const records = stmt.all();
    res.json(records);
  } catch (error) {
    next(error);
  }
});

app.post('/api/records', (req, res, next) => {
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({
      error: 'Content is required',
      details: 'Please provide non-empty content for the record'
    });
  }

  try {
    const id = Date.now().toString();
    const stmt = db.prepare('INSERT INTO records (id, content) VALUES (?, ?)');
    const insertResult = stmt.run(id, content.trim());

    if (insertResult.changes !== 1) {
      throw new Error('Failed to insert record');
    }

    const getStmt = db.prepare('SELECT * FROM records WHERE id = ?');
    const record = getStmt.get(id);

    if (!record) {
      throw new Error('Failed to retrieve inserted record');
    }

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/records/:id', (req, res, next) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM records WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Record not found',
        details: `No record found with id: ${id}`
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // Handle SQLite specific errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({
      error: 'Database error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(500).json({
    error: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  
  server.close(() => {
    console.log('HTTP server closed');
    
    try {
      if (db) {
        db.close();
        console.log('Database connection closed');
      }
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 5s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});