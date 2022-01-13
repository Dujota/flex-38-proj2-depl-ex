/* eslint-disable prefer-destructuring */
const Student = require('../models/student');

module.exports = {
  index,
  addFact,
  delFact,
};

// /students?name=wehatevrityped  <--- what the url submitted by form will be
function index(req, res, next) {
  console.log(req.query);
  // Make the query object to use with Student.find based up
  // the user has submitted the search form or now
  const modelQuery = req.query.name ? { name: new RegExp(req.query.name, 'i') } : {};
  // Default to sorting by name
  const sortKey = req.query.sort || 'name';

  // {name: 'whateverwastyped'}  || {}
  Student.find(modelQuery)
    .sort(sortKey)
    .exec(function (err, students) {
      if (err) return next(err);
      // Passing search values, name & sortKey, for use in the EJS
      res.render('students/index', { user: req.user, students, name: req.query.name, sortKey });
    });
}

function addFact(req, res, next) {
  const text = req.body.text;

  req.user.facts.push({ text });

  req.user
    .save()
    .then((student) => res.redirect('/students'))
    .catch((err) => res.redirect('/students'));
}

function delFact(req, res, next) {}
