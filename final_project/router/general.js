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
// ============================================================

const axios = require('axios');
const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            return res.status(404).json({message: "Book not found"});
        });
});

// Task 12: Get book details based on Author using Promises with Axios
public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            return res.status(404).json({message: "No books found by this author"});
        });
});

// Task 13: Get book details based on Title using Promises with Axios
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            return res.status(404).json({message: "No books found with this title"});
        });
});

module.exports.general = public_users;
