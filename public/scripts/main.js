async function loadBookInstances(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load books: ${res.status}`);

    const text = await res.text();
    const lines = text.split(/\r?\n/);
    
    const books = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const obj = JSON.parse(trimmed);
        books.push(Book.fromJSON(obj));
    }
    return books;
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Page loaded!")
})