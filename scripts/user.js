class User {
  constructor(id, username, email, avatar = "") {
    this.id = id;
    this.username = username;
    this.email = email;
    this.avatar = avatar;

    this.toRead = [];
    this.reading = [];
    this.read = [];
  }

  isValidShelf(shelfName) {
    return shelfName === "toRead" || shelfName === "reading" || shelfName === "read";
  }

  getBookShelf(bookId) {
    if (this.toRead.some(book => book.bookId === bookId)) {
      return "toRead";
    }

    if (this.reading.some(book => book.bookId === bookId)) {
      return "reading";
    }

    if (this.read.some(book => book.bookId === bookId)) {
      return "read";
    }

    return null;
  }

  removeBookFromAllShelves(bookId) {
    this.toRead = this.toRead.filter(book => book.bookId !== bookId);
    this.reading = this.reading.filter(book => book.bookId !== bookId);
    this.read = this.read.filter(book => book.bookId !== bookId);
  }

  addBookToShelf(bookId, shelfName) {
    if (!this.isValidShelf(shelfName)) {
      console.error("Invalid shelf name:", shelfName);
      return;
    }

    this.removeBookFromAllShelves(bookId);

    const bookData = {
      bookId: bookId,
      addedAt: new Date().toISOString()
    };

    if (shelfName === "reading") {
      bookData.startedAt = new Date().toISOString();
    }

    if (shelfName === "read") {
      bookData.finishedAt = new Date().toISOString();
      bookData.review = "";
      bookData.rating = null;
    }

    this[shelfName].push(bookData);
  }

  moveBookToShelf(bookId, newShelfName) {
    if (!this.isValidShelf(newShelfName)) {
      console.error("Invalid shelf name:", newShelfName);
      return;
    }

    const currentShelf = this.getBookShelf(bookId);

    if (!currentShelf) {
      console.warn("Book was not found in any shelf.");
      return;
    }

    const existingBook = this[currentShelf].find(book => book.bookId === bookId);

    this.removeBookFromAllShelves(bookId);

    const updatedBook = { ...existingBook };

    if (newShelfName === "reading" && !updatedBook.startedAt) {
      updatedBook.startedAt = new Date().toISOString();
    }

    if (newShelfName === "read") {
      if (!updatedBook.finishedAt) {
        updatedBook.finishedAt = new Date().toISOString();
      }

      if (updatedBook.review === undefined) {
        updatedBook.review = "";
      }

      if (updatedBook.rating === undefined) {
        updatedBook.rating = null;
      }
    }

    this[newShelfName].push(updatedBook);
  }

  removeBookFromShelf(bookId, shelfName) {
    if (!this.isValidShelf(shelfName)) {
      console.error("Invalid shelf name:", shelfName);
      return;
    }

    this[shelfName] = this[shelfName].filter(book => book.bookId !== bookId);
  }

  addReview(bookId, reviewText, rating) {
    const book = this.read.find(book => book.bookId === bookId);

    if (!book) {
      console.warn("Review can only be added to a book in the 'read' shelf.");
      return;
    }

    book.review = reviewText;
    book.rating = rating;
  }

  getStats() {
    const toReadCount = this.toRead.length;
    const readingCount = this.reading.length;
    const readCount = this.read.length;
    const totalBooks = toReadCount + readingCount + readCount;

    let readPercentage = 0;

    if (totalBooks > 0) {
      readPercentage = Math.round((readCount / totalBooks) * 100);
    }

    return {
      toReadCount: toReadCount,
      readingCount: readingCount,
      readCount: readCount,
      totalBooks: totalBooks,
      readPercentage: readPercentage
    };
  }

  saveToLocalStorage() {
    localStorage.setItem("currentUser", JSON.stringify(this));
  }

  static loadFromLocalStorage() {
    const savedUser = localStorage.getItem("currentUser");

    if (!savedUser) {
      return null;
    }

    const parsedUser = JSON.parse(savedUser);
    return User.fromJSON(parsedUser);
  }

  static fromJSON(data) {
    const user = new User(data.id, data.username, data.email, data.avatar);

    user.toRead = data.toRead || [];
    user.reading = data.reading || [];
    user.read = data.read || [];

    return user;
  }
}
