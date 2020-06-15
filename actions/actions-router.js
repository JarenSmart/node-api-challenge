const express = require("express");
const actions = require("../data/helpers/actionModel");
const projectActions = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  projectActions
    .getProjectActions(req.params.id)
    .then((projectId) => {
      res.json(projectId);
    })
    .catch(next);
});

//custom middleware
function validateProjectID() {
  return (req, res, next) => {
    actions
      .get(req.params.id)
      .then((action) => {
        if (action) {
          req.action = action;
          next();
        } else {
          res.status(400).json({
            message: "Invalid project id",
          });
        }
      })
      .catch(next);
  };
}

module.exports = router;
