import fs from 'fs';
import readline from 'readline';
import path from 'path';
import Database from 'better-sqlite3';

const BOOK_JSON_PATH = process.argv[2]
const AUTHOR_JSON_PATH = process.argv[3]
const DB_PATH = process.argv[4]

fs.mkdirSync(path.dirname(DB_PATH), {recursive: true});
console.log("Opening db:", DB_PATH);

const db = new Database(DB_PATH)


async function loadAuthorMap(authorPath) {
    const authorMap = new Map();

    const fileStream = fs.createReadStream(authorPath, {encoding:"utf8"});
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});

    let count = 0;
    
    for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const author = JSON.parse(trimmed);
        authorMap.set(String(author.author_id), author.name || "");
        count++
    }
    console.log("Total authors mapped:", count);
    return authorMap;
}

function authorsArrayToText(authorsArr, authorMap) {
    if (!Array.isArray(authorsArr)) return "";

    const names = authorsArr
    .map(author => {
        const id = String(author.author_id ?? "");
        if (!id) return "";
        return authorMap.get(id) || id;
    })
    .filter(Boolean);

    return names.join(" ");
}

function publicationDate(obj) {
    const day = obj.publication_day;
    const month = obj.publication_month;
    const year = obj.publication_year;
    if (!day || !month || !year) return ""
    return `${day}-${month}-${year}`;
}

function toIntOrNull(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return null; // handles ""
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

async function importBooks() {
    db.exec(`
        DROP TABLE IF EXISTS books;
        DROP TABLE IF EXISTS books_fts;

        CREATE TABLE books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id TEXT UNIQUE,
            country_code TEXT,
            language_code TEXT,
            isbn TEXT,
            title TEXT,
            description TEXT,
            publisher TEXT,
            publication_date TEXT,
            num_pages INTEGER,
            authors TEXT,
            url TEXT,
            image_url TEXT,
            average_rating TEXT
        );

        CREATE VIRTUAL TABLE books_fts USING fts5(
            id UNINDEXED,
            title,
            description,
            authors
        )
    `);
    const insertBook = db.prepare(`
        INSERT OR IGNORE INTO books
        (book_id, country_code, language_code, isbn, title, description,
        publisher, publication_date, num_pages, authors, url, image_url, average_rating)
        
        VALUES (@book_id, @country_code, @language_code, @isbn, @title, 
        @description, @publisher, @publication_date, @num_pages, @authors, @url, @image_url, 
        @average_rating)
    `);
    const insertFts = db.prepare(`
        INSERT INTO books_fts (id, title, description, authors)
        VALUES (@id, @title, @description, @authors)    
    `);

    const selectIdByBookId = db.prepare(`
        SELECT id FROM books WHERE book_id = ?    
    `);

    const insertBooksToDB = db.transaction((rows) => {
        for (const obj of rows) {
            const book_id = obj.book_id != null ? String(obj.book_id) : "";
            if (!book_id) continue

            const authorsText = authorsArrayToText(obj.authors, authorMap);

            insertBook.run({
                book_id,
                country_code: obj.country_code ?? "",
                language_code: obj.language_code ?? "",
                isbn: obj.isbn ?? "",
                title: obj.title ?? "",
                description: obj.description ?? "",
                publisher: obj.publisher ?? "",
                publication_date: publicationDate(obj),
                num_pages: toIntOrNull(obj.num_pages),
                authors: authorsText,
                url: obj.url ?? "",
                image_url: obj.image_url ?? "",
                average_rating: obj.average_rating != null ? parseFloat(obj.average_rating) : null
            })

            const row = selectIdByBookId.get(book_id);
            if(row?.id) {
                insertFts.run({
                    id: row.id,
                    title: obj.title ?? "",
                    description: obj.description ?? "",
                    authors: authorsText
                })
            }
        }
    })
    const fileStream = fs.createReadStream(BOOK_JSON_PATH, {encoding:'utf8'});
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let batch = [];
    const BATCH_SIZE = 500;
    let imported = 0;
    let lastLog = Date.now();

    let debug = 0;

    for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const obj = JSON.parse(trimmed);
        if (debug < 5) {
            console.log("sample num_pages:", obj.num_pages, "type:", typeof obj.num_pages);
            debug++;
        }
        batch.push(obj)

        if (batch.length >= BATCH_SIZE) {
            insertBooksToDB(batch);
            imported += batch.length;
            batch = [];

            const now = Date.now();
            if (now - lastLog > 2000) {
                lastLog = now;
                console.log(`Imported ~${imported.toLocaleString()} books...`);
            }
        }
    }

    if (batch.length) {
        insertBooksToDB(batch);
        imported += batch.length;
    }
    console.log("Done importing books. Total:", imported)
}

db.pragma("journal_mode = WAL");
db.pragma('synchronous = NORMAL');
let authorMap;
loadAuthorMap(AUTHOR_JSON_PATH)
    .then(map => {
        authorMap = map;
        return importBooks();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });