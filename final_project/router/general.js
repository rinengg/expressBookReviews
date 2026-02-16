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
// Task 10-13: Async implementations using Promises / Async-Await with Axios
// These routes demonstrate fetching data from the server's own
// REST API endpoints using the Axios HTTP client library,
// showcasing both async-await and Promise-based (.then/.catch)
// patterns for handling asynchronous operations in Node.js.
// ============================================================

// Import the Axios HTTP client library for making asynchronous HTTP requests
const axios = require('axios');

// Base URL pointing to this server's own API endpoints
const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using async-await with Axios
// This route uses the modern async-await syntax to fetch the complete
// list of books from the server. The 'await' keyword pauses execution
// until the Axios GET request resolves, making the code read sequentially.
// Errors are caught using a try-catch block.
public_users.get('/async/books', async function (req, res) {
    try {
        // Use await to asynchronously fetch all books from the base endpoint
        const response = await axios.get(`${BASE_URL}/`);
        // Return the book data from the Axios response
        return res.status(200).json(response.data);
    } catch (err) {
        // Handle any errors that occur during the HTTP request
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios
// This route uses the Promise-based .then()/.catch() syntax with Axios
// to search for a specific book by its ISBN number. Axios returns a
// Promise that resolves with the HTTP response when the request completes.
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Use Axios with Promise chaining (.then/.catch) to fetch book by ISBN
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            // On success, return the book details from the response
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            // If the book is not found or request fails, return 404
            return res.status(404).json({message: "Book not found"});
        });
});

// Task 12: Get book details based on Author using Promises with Axios
// This route uses Promise-based Axios calls to search for books by author name.
// The author parameter is URL-encoded using encodeURIComponent() to handle
// special characters and spaces in author names safely.
public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    // Use Axios with Promises to fetch books filtered by author name
    // encodeURIComponent ensures special characters in names are handled properly
    axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
        .then((response) => {
            // Return the matching books from the response
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            // If no books are found by the given author, return 404
            return res.status(404).json({message: "No books found by this author"});
        });
});

// Task 13: Get book details based on Title using Promises with Axios
// This route uses Promise-based Axios calls to search for books by title.
// Similar to the author search, the title is URL-encoded to safely pass
// it as a URL parameter in the HTTP request.
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    // Use Axios with Promises to fetch books filtered by title
    // encodeURIComponent handles spaces and special characters in titles
    axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
        .then((response) => {
            // Return the matching books from the response
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            // If no books are found with the given title, return 404
            return res.status(404).json({message: "No books found with this title"});
        });
});

module.exports.general = public_users;
