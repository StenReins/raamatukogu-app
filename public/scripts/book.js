/*class Book {
    constructor({
        isbn = "",
        series = [],
        country_code = "",
        language_code = "",
        asin = "",
        is_ebook = "",
        average_rating = "",
        kindle_asin = "",
        similar_books = [],
        description = "",
        format = "",
        authors = [],
        publisher = "",
        num_pages = "",
        isbn13 = "",
        publication_day = "",
        publication_month = "",
        publication_year = "",
        url = "",
        image_url = "",
        book_id = "",
        ratings_count = "",
        work_id = "",
        title = "",
        title_without_series = "",

    } = {}){
        this.isbn = isbn;
        this.series = series;
        this.country_code = country_code;
        this.language_code = language_code;
        this.asin = asin;
        this.is_ebook = is_ebook;
        this.average_rating = average_rating;
        this.kindle_asin = kindle_asin;
        this.similar_books = similar_books;
        this.description = description;
        this.format = format;
        this.authors = authors.map(author => new Author(author));
        this.publisher = publisher;
        this.num_pages = num_pages;

        this.isbn13 = isbn13;
        this.publication_day = publication_day;
        this.publication_month = publication_month;
        this.publication_year = publication_year;
        this.edition_information = edition_information;

        this.url = url;
        this.image_url = image_url;

        this.book_id = book_id;
        this.ratings_count = ratings_count;
        this.work_id = work_id;

        this.title = title;
        this.title_without_series = title_without_series
    }

    static fromJSON(obj) {
        return new Book(obj)
    }
}*/
export class Book {
    constructor(){}
    
    static fromJSON(obj) {
        return new Book(obj)
    }
}