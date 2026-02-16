const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register customer."});
});

// Task 2: Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Task 3: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Task 4: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    let matchingBooks = [];
    const bookKeys = Object.keys(books);

    bookKeys.forEach((key) => {
        if (books[key].author.toLowerCase() === author) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Task 5: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    let matchingBooks = [];
    const bookKeys = Object.keys(books);

    bookKeys.forEach((key) => {
        if (books[key].title.toLowerCase() === title) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

// Task 6: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// ============================================================
// Task 11: Async implementations using Promises / Async-Await
// ============================================================

// Get all books - Using async-await with Axios simulation
function getAllBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get('/async/books', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        return res.status(200).json(allBooks);
    } catch (err) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Get book details based on ISBN - Using Promises
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
}

public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            return res.status(404).json({message: err});
        });
});

// Get book details based on Author - Using Promises
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const bookKeys = Object.keys(books);
        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found by this author");
        }
    });
}

public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    getBooksByAuthor(author)
        .then((matchingBooks) => {
            return res.status(200).json(matchingBooks);
        })
        .catch((err) => {
            return res.status(404).json({message: err});
        });
});

// Get book details based on Title - Using Promises
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const bookKeys = Object.keys(books);
        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found with this title");
        }
    });
}

public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    getBooksByTitle(title)
        .then((matchingBooks) => {
            return res.status(200).json(matchingBooks);
        })
        .catch((err) => {
            return res.status(404).json({message: err});
        });
});

module.exports.general = public_users;
