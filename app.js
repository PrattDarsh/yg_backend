const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { dirname } = require("path");
const e = require("express");

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
  date: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  pass: String,
});

const bookSchema = new mongoose.Schema({
  title: String,
  category: String,
  age: Number,
  link: String,
});

const Blog = new mongoose.model("blog", blogSchema);
const Book = new mongoose.model("book", bookSchema);
const user = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/blogs", (req, res) => {
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

app.post("/:page", (req, res) => {
  if (req.params.page == "admin") {
    const Username = req.body.name;
    const Password = req.body.pass;
    console.log("user" + Username);
    console.log("pass" + Password);
    user.findOne({ username: Username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundUser);
        if (foundUser) {
          app.set("user", foundUser);
          if (foundUser.pass === Password) {
            res.redirect("dashboard");
          } else {
            res.send("Incorrect Password");
          }
        } else {
          res.send("Incorrect Username");
        }
      }
    });
  } else {
    res.sendFile(__dirname + "/" + req.params.page + ".html");
  }
});

app.get("/dashboard", (req, res) => {
  const user = app.get("user");
  res.render("admin", {
    user: user.username,
  });
});

app.post("/dashboard/newblog", (req, res) => {
  const newBlog = new Blog({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
    category: req.body.category,
    date: req.body.date,
  });

  newBlog.save((err) => {
    if (!err) {
      res.render("success", {
        title: req.body.title,
        message: "Your blog has been uploaded.",
      });
    }
  });
});

app.post("/dashboard/newbook", (req, res) => {
  console.log("called");
  const newBook = new Book({
    title: req.body.bookName,
    category: req.body.bookCategory,
    age: req.body.ageGap,
    link: req.body.link,
  });

  newBook.save((err) => {
    if (!err) {
      res.render("success", {
        title: "",
        message: "Your book has been added.",
      });
    } else {
      console.log(err);
    }
  });
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/login.html");
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

// app.get('/admin')

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("Server Running");
});
