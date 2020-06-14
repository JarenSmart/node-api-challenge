const express = require("express");
const morgan = require("morgan");
const logger = require("./logger/logger");
const projectsRouter = require("./projects/projects-router");

const server = express();
const port = 7700;

server.use(express.json());

server.use(logger("long"));

server.use(projectsRouter);

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
});

server.listen(port, () => {
  console.log(`Server going beep boop at http://localhost:${port}`);
});
