const bcrypt = require("bcrypt");

//HELPER: Get the id for a given email, or null if not existing. Used in createUser and login.
const findUser = (email, database) => {
  for (const id in database) {
    if (database[id].email === email) {
      return id;
    }
  }
  return null;
};

//HELPER: Used for making ids for users and URLs.
const generateRandomString = function(users, urlDatabase) {
  const validChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += validChars[Math.floor(Math.random() * validChars.length)];
  }

  //If duplicate random string, re-run function.
  if (users[result] || urlDatabase[result]) {
    return generateRandomString();
  }
  return result;
};

//HELPER: Filter database to only 1 user's URLs, used for index page.
const getURLs = (userID, database) => {
  const result = {};
  for (const url in database) {
    if (database[url].userID === userID) {
      result[url] = database[url];
    }
  }
  return result;
};

//HELPER: Checks for errors in registration.
const createUser = (id, email, password, database) => {
  if (!email || !password) {
    return { error: "Error! Either the email or password field was empty. Please try again.", data: null };
  }
  if (findUser(email, database)) {
    return { error: "Error! That email is already in use. Please try again", data: null };
  }

  database[id] = { id, email, password: bcrypt.hashSync(password, 10) };
  return { error: null, data: { id, email, password } };
};

module.exports = {
  findUser,
  createUser,
  getURLs,
  generateRandomString
};