const express = require('express');
const actions = require("../data/helpers/actionModel")
const projects = require("../data/helpers/projectModel")
// const posts = require("../actions/postDb")

const router = express.Router();

// router.get('/', (req, res) => {
//   // do your magic!
// });


router.get('/', (req, res) => {
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

router.get('/:id', validateActionId(), (req, res) => {
  // do your magic!
  
  actions.get(req.params.id)
  
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

// router.delete('/:id', (req, res) => {
//   // do your magic!
// });

router.delete('/:id', validateActionId(), (req, res, next) => {
  // do your magic!
  actions.remove(req.params.id)
    .then((count) => {
      res.status(200).json({
        message: "The action has been nuked",
      })
    })
    .catch((error) => {
      next()
    })
});

// router.put('/:id', (req, res) => {
//   // do your magic!
// });

router.put('/:id', validateActionId(), validateActionData(), (req, res, next) => {
  // do your magic!
  actions.update(req.params.id, req.body)
    .then((project) => {
      res.status(200).json(project)
    })
    .catch((error) => {
      next(error)
    })
});

// custom middleware

function validateActionId(req, res, next) {
  return (req, res, next) => {
    
    actions.get(req.params.id)
      .then((action) => {
        if (action) {

          req.action = action
          next()
        } else {
          res.status(404).json({
            message: "Action not found",
          })
        }
      })
      .catch(next)
  }
}

function validateActionData(req, res, next) {
  return (req, res, next) => {
    if (!req.body || !req.body.description || !req.body.notes || typeof req.body.completed != "boolean") {
      return res.status(400).json({
        message: "Missing project description, notes, and or completion status.  Completion status must be true or false",
      })
    }
    next()
  }
}

module.exports = router;
