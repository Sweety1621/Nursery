// jshint esversion: 6

function guest(req, res, next) {
    if(!req.isAuthenticated()) { // if already login then /login and /register shouldn't open
        return next();
    }
    return res.redirect("/");
}

module.exports = guest;