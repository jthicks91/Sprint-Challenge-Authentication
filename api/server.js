const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const configureRoutes = require("../config/routes.js");

const server = express();

function logger(req, res, next) {
  const { path } = req;
  const timeStamp = Date.now();
  const log = { path, timeStamp };
  console.log(`${req.method} Request`, log);
  next();
}

server.use(logger);

server.use(helmet());
server.use(cors());
server.use(express.json());

configureRoutes(server);

module.exports = server;
