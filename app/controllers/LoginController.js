var passport = require("passport");


module.exports = {
    get_index: function (req, res) {
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            res.redirect("/");
        }
        res.render("index/login", {message: req.flash('error')});
    }
};
