const bcrypt = require("bcrypt");

//HELPER
const findUser = (email, database) => {
  for (const id in database) {
    if (database[id].email === email) {
      return id;
    }
  }
  return null;
};

//HELPER
const generateRandomString = function(users, urlDatabase) {
  const validChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += validChars[Math.floor(Math.random() * validChars.length)];
  }

  if (users[result] || urlDatabase[result]) {
    return generateRandomString();
  }
  return result;
};

//HELPER
const getURLs = (userID, database) => {
  const result = {};
  for (const url in database) {
    if (database[url].userID === userID) {
      result[url] = database[url];
    }
  }
  return result;
};

//HELPER
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