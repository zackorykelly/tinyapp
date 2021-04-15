const { assert } = require('chai');

const { findUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });

  it('should return undefined with invalid email', function() {
    const user = findUser("bob@example.com", testUsers);
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });
});