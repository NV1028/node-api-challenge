const express = require('express');
//these below are the databases the db
const projects = require("../data/helpers/projectModel")
const actions = require("../data/helpers/actionModel")
// const actions = require("../actions/postDb")
const router = express.Router();


router.post('/', validateProjectData(), (req, res, next) => {
  // do your magic!
  projects.insert(req.body)
    .then((project) => {
      console.log(project)
      res.status(201).json(project)
    })
    .catch((error) => {
      next(error)
    })
});

router.post('/:id/actions', (req, res, next) => {
  // do your magic!
  if (!req.body.description || !req.body.notes) {


    return res.status(404).json({
      message: "Need a value for description and notes",
    })
  }
  actions.insert({...req.body, project_id: req.params.id})

    .then((project) => {
      console.log(project)
      res.status(201).json(project)
    })
    .catch((error) => {
      next(error)
    })
});

router.get('/', (req, res) => {
  // do your magic!
  // const options = {
  //   sortBy: req.query.sortBy,
  //   limit: req.query.limit,
  // }

  projects.get()
    .then((projects) => {
      res.status(200).json(projects)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Error retrieving the projects",
      })
    })
});

router.get('/:id', validateProjectId(), (req, res, next) => {
  // do your magic!
  projects.get(req.params.id)
    .then((project) => {
      res.status(201).json(project)
    })
    .catch((error) => {
      next(error)
    })
});

router.get('/:id/actions', (req, res) => {
  // do your magic!
  projects.getProjectActions(req.params.id)
    .then((actions) => {
      res.status(200).json(actions)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Could not get project actions",
      })
    })
});

router.delete('/:id', validateProjectId(), (req, res, next) => {
  // do your magic!
  projects.remove(req.params.id)
    .then((count) => {
      res.status(200).json({
        message: "The project has been nuked",
      })
    })
    .catch((error) => {
      next()
    })
});

//may need next in parameters, added next
router.put('/:id', validateProjectId(), validateProjectData(), (req, res, next) => {
  // do your magic!
  projects.update(req.params.id, req.body)
    .then((project) => {
      res.status(200).json(project)
    })
    .catch((error) => {
      next(error)
    })
});

//custom middleware

function validateProjectId(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    projects.get(req.params.id)
      .then((project) => {
        if (project) {

          req.project = project
          next()
        } else {
          res.status(404).json({
            message: "Project not found",
          })
        }
      })
      .catch(next)
  }
}

function validateProjectData(req, res, next) {
  return (req, res, next) => {
    if (!req.body || !req.body.name || !req.body.description || typeof req.body.completed != "boolean") {
      return res.status(400).json({
        message: "Missing project name, description, and or completion status.  Completion status must be true or false",
      })
    }
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    if (!req.body.name || !req.body.text) {
      return res.status(400).json({
        message: "Missing project name or text",
      })
    }
    next()
  }
}

module.exports = router;
