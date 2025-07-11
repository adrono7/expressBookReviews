const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    } else {

        users.push({ username, password });
        console.log(users);
        return res.status(201).json({ message: "User registered successfully" });
    }
});

// Get the book list available in the shop
public_users.get('/books', function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books,null,4)));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
  const isbn = req.params.isbn;
  resolve(res.send(books[isbn]));
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksByAuthor = Object.values(books).filter(b => b.author === author);
        if (booksByAuthor.length === 0) {
            reject("No book records exist for this author");
        } else {
            resolve(booksByAuthor);
        }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksWithTitle = Object.values(books).filter(b => b.title.includes(title));
        if (booksWithTitle.length === 0) {
            reject("No book records exist for this author");
        } else {
            resolve(booksWithTitle);
        }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  if (!book || !book.reviews) {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
