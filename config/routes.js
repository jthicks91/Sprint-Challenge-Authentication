const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authenticate } = require("../auth/authenticate");

const db = require("../dbMethods");
// const db = require("knex")(require("../knexfile").development);

const jwtKey = process.env.JWT_KEY;
// const jwtKey = require("../secrets/keys").jwtKey;

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

// function generateToken(user) {
//   const payload = {
//     username: user.username
//   };
//   const secret = jwtKey;
//   const options = {
//     expiresIn: "1h"
//   };
//   return jwt.sign(payload, secret, options);
// }

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, jwtKey, options);
}

async function register(req, res) {
  // implement user registration
  try {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    const registeredUser = await db.register(credentials);
    if (registeredUser) {
      res.status(201).json(registeredUser);
    } else {
      res
        .status(400)
        .json({ message: "Please input a username and password to register." });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

async function login(req, res) {
  let { username, password } = req.body;
  try {
    const user = await db.findByName(username);
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      console.log(token);
      res.status(200).json({
        message: `Welcome ${user.username}!, have a token...`,
        token
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };
  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
