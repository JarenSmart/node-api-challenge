const express = require("express");
const projects = require("../data/helpers/projectModel");

const router = express.Router();

//GET ALL PROJECTS
router.get("/", (req, res, next) => {
  projects
    .get()
    .then((project) => {
      res.json(project);
    })
    .catch((error) => {
      next(error);
    });
});

//ADD PROJECT
router.post("/projects", (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: "Missing project name or description",
    });
  }

  projects
    .insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the project",
      });
    });
});

//UPDATE PROJECT
router.put("/projects/:id", (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: "Missing project name or description",
    });
  }

  projects
    .update(req.params.id, req.body)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({
          message: "The project could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the project",
      });
    });
});

module.exports = router;
