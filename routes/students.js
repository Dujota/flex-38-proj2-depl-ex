const router = require('express').Router();
const studentsCtrl = require('../controllers/students');

// Insert this middleware for routes that require a logged in user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

// GET /students
router.get('/students', studentsCtrl.index);

// POST /facts
// We will already have access to the logged in student on
// the server, therefore do not use: /students/:id/facts
router.post('/facts', isLoggedIn, studentsCtrl.addFact);

// DELETE /facts/:id
router.delete('/facts/:id', isLoggedIn, studentsCtrl.delFact);

module.exports = router;
