const db = require("../dbConfig.js");
const mappers = require("./mappers");

module.exports = {
  get,
  insert,
  insertAction,
  update,
  remove,
  findById,
  findProjectActionByProjectId,
  getProjectActions,
};

function get(id) {
  let query = db("projects as p");

  if (id) {
    query.where("p.id", id).first();

    const promises = [query, getProjectActions(id)]; // [ projects, actions ]

    return Promise.all(promises).then(function (results) {
      let [project, actions] = results;

      if (project) {
        project.actions = actions;

        return mappers.projectToBody(project);
      } else {
        return null;
      }
    });
  } else {
    return query.then((projects) => {
      return projects.map((project) => mappers.projectToBody(project));
    });
  }
}

function insert(project) {
  return db("projects")
    .insert(project, "id")
    .then(([id]) => get(id));
}

function insertAction(action) {
  return db("actions")
    .insert(action)
    .then((ids) => ({ id: ids[0] }));
}

function update(id, changes) {
  return db("projects")
    .where("id", id)
    .update(changes)
    .then((count) => (count > 0 ? get(id) : null));
}

function remove(id) {
  return db("projects").where("id", id).del();
}

function findById(id) {
  return db("projects").where({ id }).first();
}

function findProjectActionByProjectId(actionsID, id) {
  return db("actions").where({ id, project_id: actionsID }).first();
}

function getProjectActions(projectId) {
  return db("actions")
    .where("project_id", projectId)
    .then((actions) => actions.map((action) => mappers.actionToBody(action)));
}
