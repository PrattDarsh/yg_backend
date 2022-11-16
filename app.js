const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  "mongodb+srv://prateek:prateek221592@cluster0.a56ymhr.mongodb.net/yugen",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  category: String,
});

const bookSchema = new mongoose.Schema({
  title: String,
  category: String,
  age: Number,
  link: String,
});

const Blog = new mongoose.model("blog", blogSchema);
const Book = new mongoose.model("book", bookSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs", {
        blogs: allBlogs,
      });
    }
  });
});

app.post("/blogs/:title", (req, res) => {
  Blog.findOne({ title: req.params.title }, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      res.render("article", {
        title: article.title,
        author: article.author,
        content: article.content,
      });
    }
  });
});

app.get("/books", (req, res) => {
  Book.find({}, (err, allBooks) => {
    if (err) {
      console.log(err);
    } else {
      res.render("books", {
        books: allBooks,
      });
    }
  });
});

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("Server Running");
});
