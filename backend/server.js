const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Step 3: Implement database connectivity
const DB_PATH = path.join(__dirname, 'students.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

// Handle database errors at the connection level (e.g. SQLITE_CORRUPT)
db.on('error', (err) => {
    if (err.code === 'SQLITE_CORRUPT') {
        console.error('Database is corrupt. Deleting corrupted file so it can be recreated...');
        db.close();
        fs.unlinkSync(DB_PATH);
        console.log('Corrupted database removed. Restart the server to recreate it.');
    } else {
        console.error('Database error:', err.message);
    }
});

// Membuat tabel jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    grade TEXT
)`);

// Step 2 & 4: Create backend APIs & Add CRUD operations

// View Student Details (Read)
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add Students (Create)
app.post('/api/students', (req, res) => {
    const { name, age, grade } = req.body;
    if (!name || !age || !grade) {
        return res.status(400).json({ error: 'Name, age, and grade are required' });
    }
    db.run(`INSERT INTO students (name, age, grade) VALUES (?, ?, ?)`, [name, age, grade], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, age, grade });
    });
});

// Update Records (Update)
app.put('/api/students/:id', (req, res) => {
    const { name, age, grade } = req.body;
    if (!name || !age || !grade) {
        return res.status(400).json({ error: 'Name, age, and grade are required' });
    }
    db.run(`UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?`, 
        [name, age, grade, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: "Student updated", changes: this.changes });
    });
});

// Delete Records (Delete)
app.delete('/api/students/:id', (req, res) => {
    db.run(`DELETE FROM students WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: "Student deleted", changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});