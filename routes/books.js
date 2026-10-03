const express = require("express");
// const { books } = require("../data/books.json");
// const {users} = require("../data/users.json")
// importing the express module and the books data from the JSON file



const router = express.Router();


/**
 * Route: /books
 * Method: GET
 * Description: Get all the list of books in the system
 * Access: Public
 * Parameters: None
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    })
})

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get a book by its ID
 * Access: Public
 * Parameters: id (book ID)
 */
router.get("/:id", (req, res) => {
    const { bookId } = req.params;
    const { book } = books.find((each) => each.id === bookId);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book not found for id: ${bookId}`
        });
    }

    res.status(200).json({
        success: true,
        data: book
    });
});

/**
 * Route: /books
 * Method: POST
 * Description: Create/Register a new book
 * Access: Public
 * Parameters: None
 */
router.post("/", (req, res) => {
    // req.body should have the following fields
    const {id, title, author, genre, price, publisher, publishdate} = req.body;

    // check if all required fields are present
    if (!id || !title || !author || !genre || !price || !publisher || !publishdate) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }

    // check if the book already exists
    const existingBook = books.find((each) => each.id === id);
    if (existingBook) {
        return res.status(400).json({
            success: false,
            message: `Book already exists with id: ${id}`
        });
    }

    // Add the new book to the books array
    books.push({ id, title, author, genre, price, publisher, publishdate });
        
        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: {id, title, author, genre, price, publisher, publishdate}
        });   
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update a book by its ID
 * Access: Public
 * Parameters: id (book ID)
 */
router.put("/:id", (req, res) => {
    const { bookId } = req.params;
    const {data} = req.body;

    // check if the book exists
    const book = books.find((each) => each.id === bookId);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book not found for id: ${bookId}`
        });
    }

    // Update the book details
    // Object.assign(book, data);

const updateBook = books.map((each) => {
    if (each.id === bookId) {
        return {...each, ...data};
    }
    return each;
});
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updateBook
    });
});

/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete a book by its ID
 * Access: Public
 * Parameters: id (book ID)
 */
router.delete("/:id", (req, res) => {
    const { bookId } = req.params;

    // check if the book exists
    const book = books.find((each) => each.id === bookId);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book not found for id: ${bookId}`
        });
    }

    // Delete the book from the books array
    const updatedBooks = books.filter((each) => each.id !== bookId);

    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });
});

/**
 * Route: /books/:id/issued/for-users
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: None
 */
router.get("/issued/for-users", (req, res) => {
    // const issuedBooks = books.filter((each) => each.issued === true);

    const usersWithIssuedBooks = users.filter((each) =>{
        if(each.issuedBook){
            return each;
        }
    })
    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    })
   
    if (issuedBooks === 0) {
        return res.status(400).json({
            success: false,
            message: "No Books issued yet"
        });
    }
    res.status(200).json({
        success: true,
        data: issuedBooks
    });
});



module.exports = router;