const express = require("express");
const projects = require("../data/helpers/projectModel");
const projectModel = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await projectModel.find();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
