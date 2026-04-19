async function getBookData() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

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
        console.log(book);
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
document.addEventListener("DOMContentLoaded", () => {
    getBookData();
})