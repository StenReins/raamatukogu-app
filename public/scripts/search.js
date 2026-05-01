function getQuery() {
    const parts = window.location.pathname.split("/");
    const query = parts[2];

    return query ? decodeURIComponent(query) : "";
}

const query = getQuery();
console.log(query);

async function search(query) {
    if(!query) return;

    const res = await fetch(`/api/search/${encodeURIComponent(query)}`);
    const data = await res.json();
    return data;
}

let data = search(query);


function getLocalStorageInfo(bookId) {
    let shelves = ['read', 'toRead', 'reading'];
    for (let shelf of shelves) {
        let shelfItem = localStorage.getItem(shelf);
        let data = JSON.parse(shelfItem);
        let entry = data?.[String(bookId)]
        if(entry) {
            return {
                in_shelf: shelf,
                rating: entry.rating,
                progress: entry.progress,
                max_pages: entry.max_pages,
                finishedAt: entry.finishedAt
            }
        }
    }
    return null;
}

class SearchResult {
    constructor(id, title, image_url, authors, average_rating, date_added) {
        this.id = id;
        this.title = title;
        this.image_url = image_url;
        this.authors = authors;
        this.date_added = date_added;
        this.average_rating = average_rating;

        let lsInfo = getLocalStorageInfo(this.id);

        this.user_rating = lsInfo?.rating;
        this.progress = lsInfo?.progress;
        this.max_pages = lsInfo?.max_pages;
        this.in_shelf = lsInfo?.in_shelf;
        this.finishedAt = lsInfo?.finishedAt;

        this.htmlElements = [];
    }

    createElement(tag, className) {
        let element = document.createElement(tag)
        if (className) {
            element.className = className
        }
        return element
    }

    createImage() {
        let div = this.createElement("div", "result-cover");
        let link = this.createElement("a", "result-img-link");
        let img = this.createElement("img", "result-img");
        
        link.href = `/book/${this.id}`;
        img.src = this.image_url || "/images/missing-cover.jpg";
        img.alt = `Cover of ${this.title}`;

        link.appendChild(img);
        div.appendChild(link);

        return div
    }
    createProgress() {
        if (!this.progress || !this.max_pages) return null;

        let progress = this.createElement("p", "result-progress");

        progress.innerText = `${this.progress} / ${this.max_pages}`
        return progress;
    }


    createUserRating() {
        let rating = this.createElement("div", "result-user-rating");
        if (this.user_rating) {
            rating.innerText = this.user_rating
        }
        else {
            rating.innerText = "Not rated"
        }
        return rating
    }

    createInShelf() {
        if (!this.in_shelf) return null;

        let shelf = this.createElement("p", "result-shelf-location");
        shelf.innerText = this.in_shelf;

        return shelf;
    }
    createFinishedAt() {
        if (!this.finishedAt) return null;

        let finished = this.createElement("p", "result-date-read");
        finished.innerText = this.finishedAt;

        return finished;
    }
    createReleaseDate() {
        if (!this.date_added) return null;
        let releaseDate = this.createElement("p", "result-rel-date");
        releaseDate.innerText = this.date_added;

        return releaseDate;
    }

    createTitle() {
        let title = this.createElement("h3", "result-title");
        title.innerText = this.title;
        return title;
    }
    createAuthors() {
        let authors = this.createElement("p", "result-authors");
        authors.innerText = this.authors;
        return authors;
    }

    createAverageRating() {
        let average_rating = this.createElement("p", "result-average-rating");
        average_rating.innerText = this.average_rating;

        return average_rating;
    }

    render() {
        let result = this.createElement("article", "result");
        let cover = this.createImage();
        let title = this.createTitle();
        let authors = this.createAuthors();
        let avgRating = this.createAverageRating();
        let userRating = this.createUserRating();
        let progress = this.createProgress();
        let shelfInfo = this.createInShelf();
        let finishedDate = this.createFinishedAt();
        let dateAdded = this.createReleaseDate();

        if (cover) result.appendChild(cover);
        if (title) result.appendChild(title);
        if (authors) result.appendChild(authors);
        if (avgRating) result.appendChild(avgRating);
        if (userRating) result.appendChild(userRating);
        if (shelfInfo) result.appendChild(shelfInfo);
        if(progress) result.appendChild(progress);
        if (finishedDate) result.appendChild(finishedDate);
        if (dateAdded) result.appendChild(dateAdded);

        return result;
    }
    appendTo(parent) {
        parent.appendChild(this.render());
    }
    
}

function createSearchResults(data) {
    let div = document.getElementById("search-results")
    data.then((row) => {
        const limit = row['limit'];
        const items = row["items"];
        for(let i = 0; i < limit; i++) {
            let item = items[i];
            let result = new SearchResult(
                item.book_id, 
                item.title, 
                item.image_url, 
                item.authors, 
                item.average_rating, 
                item.date_added ?? ""
            )
            console.log(result);
            result.appendTo(div)
        }
    });
}

createSearchResults(data);
