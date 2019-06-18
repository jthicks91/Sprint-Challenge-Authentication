const db = require("./knexConfig.js");

module.exports = {
  register,
  findByName
};

function register(credentials) {
  return db("users").insert(credentials);
}

function findByName(username) {
  return db("users")
    .where({ username: username })
    .first();
}
