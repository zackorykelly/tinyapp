const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const { findUser, createUser, getURLs, generateRandomString } = require('./helpers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["j3d6a"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.set("view engine", "ejs");

const urlDatabase = {
  //Object Structure: {id: {longURL, userID}}
};

const users = {
  //Object Structure: {id: {id, email, password}}
};

app.get("/", (req, res) => {
  //Nothing at root, redirect depending on user status
  if (!req.session["user_id"]) {
    return res.redirect('/login');
  }
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const currentUser = req.session["user_id"];
  const userURLs = getURLs(currentUser, urlDatabase);
  const templateVars = { urls: userURLs, user: users[currentUser] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session["user_id"]) {
    res.statusCode = 403;
    return res.send("Error! You must be logged in to create URLs.");
  }
  const short = generateRandomString(users, urlDatabase);
  urlDatabase[short] = { longURL: req.body.longURL, userID: req.session["user_id"] };
  res.redirect(`/urls/${short}`);
});

app.get("/login", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[req.session["user_id"]] };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const id = findUser(email, users);

  if (!id || !bcrypt.compareSync(password, users[id].password)) {
    res.statusCode = 403;
    return res.send("Error! That email or password is invalid. Please try again.");
  }
  req.session["user_id"] = id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[req.session["user_id"]] };
  res.render("urls_registration", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString(users, urlDatabase);
  const { email, password } = req.body;
  const result = createUser(id, email, password, users);

  if (result.error) {
    res.statusCode = 400;
    return res.send(result.error);
  }

  req.session["user_id"] = id;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  if (!req.session["user_id"]) {
    res.redirect("/login");
  }
  const templateVars = { user: users[req.session["user_id"]] };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.statusCode = 404;
    return res.send("Error! Invalid id");
  }
  const long = urlDatabase[req.params.id].longURL;
  res.redirect(long);
});

app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.statusCode = 404;
    return res.send("Error! Invalid id");
  }
  const longURL = urlDatabase[req.params.id].longURL;
  const currentUser = users[req.session["user_id"]];
  const templateVars = { URLs: urlDatabase, shortURL: req.params.id, longURL: longURL, user: currentUser };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const postOwner = urlDatabase[req.params.id].userID;
  if (req.session["user_id"] === postOwner) {
    urlDatabase[req.params.id].longURL = req.body.newURL;
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const postOwner = urlDatabase[req.params.id].userID;
  if (req.session["user_id"] === postOwner) {
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});