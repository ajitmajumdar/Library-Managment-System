// const express = require("express");
// // const {users} = require("./data/user.json");

// // importing the routes
// const usersRouter = require("./routes/users.js");
// const booksRouter = require("./routes/books.js");

// const app = express();

// const PORT = 8081;

// app.use(express.json());

// app.get("/", (req, res) => {
//     res.status(200).json({
//         message: "Home Page :-)"
//     });
// });

// app.use("/users", usersRouter);
// app.use("/books", booksRouter);



// // app.all('*',(req, res) => {
// //     res.status(500).json({
// //         message: "Not Built Yet"
// //     })
// // })


// app.listen(PORT, () => {
//     console.log(`Server is up running on http://localhost:${PORT}`);
// });






const express = require("express");

const usersRouter = require("./routes/users.js");
const booksRouter = require("./routes/books.js");

const app = express();

const PORT = 8081;

// Middleware
app.use(express.json());

// Static HTML/CSS/JS files
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Routes
app.use("/users", usersRouter);
app.use("/books", booksRouter);

// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});