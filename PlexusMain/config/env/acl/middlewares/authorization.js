var i18n = require('i18n');
var User = require('../../../../models/user');

exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.session.locked == true) {
            req.flash('warning', {
                title: res.__('Session is locked!'),
                msg: res.__('Your session is locked, Please enter your pincode or Logout!'),
                target: '',
                url: '',
                target: '',
                bar: false
            });
            res.redirect("/lock");
        } else {
            return next();
        }
    } else {
        req.flash('error', {
            title: res.__('Session Closed!'),
            msg: res.__('Your session was closed, Please login again.'),
            target: '',
            url: '',
            target: '',
            bar: false
        });
        res.redirect("/login");
    }
}

exports.userExist = function(req, res, next) {
    User.findByEmailOrLogin(req.body.email, function(err, email) {
        if (err) {
            throw err;
        }
        if (email.length > 0) 
        {
            req.session.formdata = req.body;
            req.flash('error', {
                title: res.__('Error!'),
                msg: res.__('Your email address is already registered! Please enter a new one or retrieve your password'),
                target: '',
                url: '',
                target: '',
                bar: false
            });

            res.redirect('back');
        } else {
            next();
        }
    });
}