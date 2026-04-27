const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

function readShelf(key) {
    const raw = localStorage.getItem(key);
    if (raw == null) return [];
    try {
        let parsed = JSON.parse(raw);
        if(Array.isArray(parsed)) {
            return parsed.map(String);
        }
        if(parsed == null && typeof parsed == "object") return [];
        return [String(parsed)]
    } 
    catch {
        return [String(raw)];
    }
}

function checkBook(shelf, value) {
    return readShelf(shelf).map(String).includes(String(value));
}

function addBook(shelf, bookId) {
    let id = String(bookId);
    let list = readShelf(shelf).map(String);

    if (list.includes(id)) {
        return false;
    }
    list.push(id);
    localStorage.setItem(shelf, JSON.stringify(list));
    return true;
}

function removeBook(shelf, bookId) {
    let id = String(bookId);
    let list = readShelf(shelf).map(String).filter(x => x !== id);
    localStorage.setItem(shelf, JSON.stringify(list));
}

async function checkShelves() {
    const shelves=["toRead", "reading", "read"];
    const found = shelves.find(shelf => checkBook(shelf, bookId) === true);
    let btn_txt = "Remove from shelf"
    let btn = document.getElementById("shelves-btn");
    let ul = document.getElementById("shelf-opts");
    
    if(found) {
        ul.textContent = ''
        btn.innerText = btn_txt
        let ul_btn = document.createElement("button")
        ul_btn.textContent = `${found}`
        ul_btn.addEventListener("click", () => {
            removeBook(found, bookId);
            checkShelves();
        })
        ul.append(ul_btn);
    }
}

async function getBookData() {
    function addField(name, value) {
        let items = document.getElementById("extra-info-items");
        let fieldDiv = document.createElement('div');
        fieldDiv.className = "extra-info-item"
        let fieldName = document.createElement('dt');
        let fieldValue = document.createElement('dd');

        fieldName.textContent = name + ": ";
        fieldValue.textContent = value;

        items.appendChild(fieldDiv);
        fieldDiv.appendChild(fieldName);
        fieldName.appendChild(fieldValue);
    }

    console.log("Getting book data..")

    if (!bookId) {
        document.getElementById("book").textContent = "Missing book id";
    }
    else {
        const res = await fetch(`/api/book/${encodeURIComponent(bookId)}`);
        if (!res.ok) throw new Error('Failed fetching book data!')
        const data = await res.json();
        const book = data.item;
        //console.log(book);
        //curently broken
        document.getElementById("book-link").href = book.url
        document.getElementById("book-image").src = book.image_url
        document.getElementById("book-image").alt = `Book cover of ${book.title}`
        document.getElementById("book-title").textContent = book.title
        document.getElementById("book-authors").textContent = book.authors
        document.getElementById("rating").textContent = book.average_rating + "/5 ⭐"
        document.getElementById("description").textContent = book.description

        if (book.num_pages) {
            addField("Pages", book.num_pages)
        }
        //need to store language code translations somewhre
        if (book.language_code) {
            if (book.language_code == "eng"){
                addField("Language", "English")
            }
            else {
                addField("Language", "Other")
            }
        }
        if (book.isbn) {
            addField("ISBN", book.isbn)
        }
        if (book.publication_date) {
            addField("Published", book.publication_date)
        }
        if (book.publisher) {
            addField("Publisher", book.publisher)
        }


        console.log("Book data loaded!");
    }
}

function showHideAdd() {
    let div = document.getElementById("shelves")
    if(div.style.display == "none") {
        div.style.display = "block";
    }
    else {
        div.style.display = "none";
    }
}

function addToWishlist() {
    let notif = document.getElementById("notif");
    const added = addBook("toRead", bookId);
    notif.innerText = added ? "Book added to Wishlist!" : "Book is already in Wishlist."
}
function addToReading() {
    let notif = document.getElementById("notif");
    const added = addBook("reading", bookId);
    notif.innerText = added ? "Book added to Currently Reading!" : "Book is already in Currently Reading."
}
function addToRead() {
    let notif = document.getElementById("notif");
    const added = addBook("read", bookId);
    notif.innerText = added ? "Book added to Finished!" : "Book is already in Finished."
}

document.addEventListener("DOMContentLoaded", () => {
    checkShelves();
    getBookData();
})