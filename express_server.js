const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "a51r2p" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "a51r2p" }
};

const users = {
  a51r2p: {
    id: "a51r2p",
    email: "user@example.com",
    password: "7890"
  }
};

//HELPER
const generateRandomString = function() {
  const validChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += validChars[Math.floor(Math.random() * validChars.length)];
  }

  if (users[result] || urlDatabase[result]) {
    return generateRandomString();
  }
  return result;
};

app.get("/", (req, res) => {
  res.redirect('/urls');
});

const getURLs = (userID) => {
  const result = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      result[url] = urlDatabase[url];
    }
  }
  return result;
};

app.get("/urls", (req, res) => {
  const userURLs = getURLs(req.cookies["user_id"]);
  const templateVars = { urls: userURLs, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const short = generateRandomString();
  urlDatabase[short] = { longURL: req.body.longURL, userID: req.cookies["user_id"] };
  res.redirect(`/urls/${short}`);
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_login", templateVars);
});

//HELPER
const findUser = (email) => {
  for (const id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return null;
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const id = findUser(email);

  if (!id) {
    res.statusCode = 403;
    return res.send("Error! That email is invalid. Please try again.");
  }
  if (!bcrypt.compareSync(password, users[id].password)) {
    res.statusCode = 403;
    return res.send("Error! That password is invalid. Please try again.");
  }

  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_registration", templateVars);
});

//HELPER
const createUser = (id, email, password) => {
  if (!email || !password) {
    return { error: "Error! Either the email or password field was empty. Please try again.", data: null };
  }
  if (findUser(email)) {
    return { error: "Error! That email is already in use. Please try again", data: null };
  }

  users[id] = { id, email, password: bcrypt.hashSync(password, 10) };
  return { error: null, data: { id, email, password } };
};

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  const result = createUser(id, email, password);

  if (result.error) {
    res.statusCode = 400;
    return res.send(result.error);
  }

  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const long = urlDatabase[req.params.shortURL].longURL;
  res.redirect(long);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { URLs: urlDatabase, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const postOwner = urlDatabase[req.params.shortURL].userID;
  if (req.cookies["user_id"] === postOwner) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const postOwner = urlDatabase[req.params.shortURL].userID;
  if (req.cookies["user_id"] === postOwner) {
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});