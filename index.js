import path from 'path'
import express from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const port = 3000;
const DB_PATH = "data/books.db"

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

const db = new Database(DB_PATH, { readonly: true });

//search endpoint
app.get("/api/search", (req, res) => {
    const q = (req.query.q || "").trim();
    const rawLimit = parseInt(req.query.limit ?? "20", 10);
    const rawOffset = parseInt(req.query.offset ?? "0", 10);

    const limit = Math.min(Math.max(rawLimit || 20, 1), 50);
    const offset = Math.max(rawOffset || 0, 0);

    if (!q) {
        return res.json({ items: [], total: 0, q });
    }
    
    const totalStmt = db.prepare(`
        SELECT COUNT (*) as total
        FROM books_fts
        WHERE books_fts MATCH ?    
    `);

    const itemsStmt = db.prepare(`
        SELECT books.book_id, books.title, books.image_url, books.average_rating
        FROM books_fts
        JOIN books on books_fts.id = books.id
        WHERE books_fts MATCH ?
        LIMIT ? OFFSET ?
    `);

    const totalRow = totalStmt.get(q);
    const items = itemsStmt.all(q, limit, offset);

    res.json({ items, total: totalRow.total, q, limit, offset });
});

app.get("/api/books", (req, res) => {
    const idsParam = (req.query.ids || "").trim();
    if (!idsParam) return res.json({ items: [] });

    const ids = idsParam.split(",").map(s => s.trim()).filter(Boolean);

    const placeholders = ids.map(() =>  "?").join(",");

    const stmt = db.prepare(`
        SELECT book_id, title, description, image_url, average_rating, authors, book_id
        FROM books
        WHERE book_id IN (${placeholders})
    `);

    const items = stmt.all(...ids);
    res.json({ items })
});

app.get("/api/book/:book_id", (req, res) => {
    const bookId = req.params.book_id;

    const stmt = db.prepare(`
        SELECT * 
        FROM books 
        WHERE book_id = ?
        LIMIT 1
    `);

    const item = stmt.get(bookId);
    if (!item) return res.status(404).json({ error: "Not found" });

    res.json({ item });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

/*
TESTS
search - curl "http://localhost:3000/api/search?q=fields&limit=5"
fetch specific books - curl "http://localhost:3000/api/books?ids=5333265,12345"
single book - curl "http://localhost:3000/api/book/5333265"
*/