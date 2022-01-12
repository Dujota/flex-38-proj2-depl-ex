const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Student = require('../models/student');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    // a user has logged in with OAuth...
    function (accessToken, refreshToken, profile, cb) {
      // 1- find the user inside our DB, who has just signed into the app
      // profile.id is coming from Google
      Student.findOne({ googleId: profile.id })
        .then((student) => {
          if (student) {
            return student;
          }

          return Student.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
        })
        .then((student) => cb(null, student))
        .catch((err) => cb(err));
    }
  )
);

passport.serializeUser(function (student, done) {
  done(null, student.id);
});

passport.deserializeUser(function (id, done) {
  Student.findById(id)
    .then((student) => done(null, student))
    .catch((err) => done(err, null));
});
