const express = require("express");
const projects = require("../data/helpers/projectModel");
const actions = require("../data/helpers/actionModel");

const router = express.Router();
//WELCOME MESSAGE
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the project API",
  });
});

//GET ALL PROJECTS
router.get("/projects", (req, res, next) => {
  projects
    .get()
    .then((project) => {
      res.json(project);
    })
    .catch((error) => {
      next(error);
    });
});

//GET PROJECTS ACTIONS BY ID
router.get("/projects/:id/actions", (req, res) => {
  projects
    .findById(req.params.id)
    .then((project) => {
      if (!project) {
        res.status(404).json({
          message: "Project not found",
        });
      } else {
        return projects.getProjectActions(req.params.id);
      }
    })
    .then((actions) => {
      res.json(actions);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error getting actions",
      });
    });
});

//GET A SINGLE ACTION OF A PROJECT BY ID
router.get("/projects/:id/actions/:actionsID", (req, res) => {
  projects
    .findProjectActionByProjectId(req.params.id, req.params.actionsID)
    .then((action) => {
      if (action) {
        res.json(action);
      } else {
        res.status(404).json({
          message: "Action was not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error getting the project action",
      });
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

//ADD ACTION BY PROJECT ID
router.post("/projects/:id/actions", (req, res) => {
  const newAction = { project_id: req.params.id, ...req.body };
  console.log(newAction);

  if (!req.body.description || !req.body.notes) {
    return res.status(400).json({
      errorMessage: "Please provide a description and notes for the action.",
    });
  }

  actions
    .insert(newAction)
    .then((newAction) => {
      if (newAction) {
        res.status(201).json(newAction);
      } else {
        res.status(404).json({
          message: "The project with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the action to the database",
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

//DELETE PROJECT
router.delete("/projects/:id", (req, res) => {
  projects
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The project has been destroyed",
        });
      } else {
        res.status(404).json({
          message: "The project could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the project",
      });
    });
});

//DELETE ACTION BY ID
router.delete("/actions/:id", (req, res) => {
  actions
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The action has been destroyed",
        });
      } else {
        res.status(404).json({
          message: "The action could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the action",
      });
    });
});

module.exports = router;
