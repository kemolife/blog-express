var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

module.exports = {
    get_index: function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect("/");
        }
        res.render("index/login", {message: req.flash('error')});
    },

    post_index: function (req, res) {
        // serialize user
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        // deserialize user
        passport.deserializeUser(function(id, done) {
            User.findById({ _id: id }, function(err, user) {
                done(err, user);
            });
        });
        // passport local strategy
        passport.use(new LocalStrategy({
                usernameField: 'name',
                passwordField: 'password'
            },
            function(name, password, done) {
                User.findOne({ name: name }, function (err, user) {

                    if (err) { return done(err); }

                    if ( ! user) {
                        return done(null, false, { message: "Name is not correct" });
                    }
                    if( ! user.admin) {
                        return done(null, false, { message: "User is not admin" });
                    }

                    user.validPassword(password, function(err, data) {
                        if(err) return done(err);

                        if( ! data){
                            return done(null, false, { message: "password is not correct"} );
                        }

                        return done(null, user);
                    });
                });
            }
        ));

        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true }), function(req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect("/admin");
        }
    }
};
