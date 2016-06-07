var express = require("express"),
    passport = require("passport"),
    moment = require("moment"),
    LocalStrategy = require("passport-local").Strategy,
    Auth = require("../config/env/acl/middlewares/authorization.js"),
    datatablesQuery = require("../middlewares/datatables/query"),
    User = require("../models/user"),
    Role = require("../models/role");

module.exports = function(app, passport, i18n) {
    /**
     *
     *
     *
     * ACL Routes Register,Login,Lock,Logout
     *
     *
     *
     */
    //Register views 
    app.get("/register", function(req, res) {
        res.render("acl/login", {
            title: "",
            subtitle: "",
            showtitle: "",
            layout: "layouts/default"
        });
    });
    app.post("/register", Auth.userExist, function(req, res, next){

if (req.body.password == "" || req.body.password2 == "") {
    req.session.formdata = req.body;
            req.flash('warning', {
                        title: res.__("Warning!"),
                        msg: res.__("Password can\'t be empty"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                   res.redirect('back');
        } else {
            if (req.body.password != "" && req.body.password == req.body.password2) {
                if (req.body.password.length < 8) {
                    req.session.formdata = req.body;
                    req.flash('warning', {
                        title: res.__("Not Save!"),
                        msg: res.__("Password must contain at least eight characters!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                } else {
                    var re = /[0-9]/;
                    if (!re.test(req.body.password)) {
                        req.session.formdata = req.body;
                        req.flash('warning', {
                        title: res.__("Not Save!"),
                        msg: res.__("password must contain at least one number (0-9)!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                    } else {
                        var re = /[a-z]/;
                        if (!re.test(req.body.password)) {
                            req.session.formdata = req.body;
                    req.flash('warning', {
                        title: res.__("Not Save!"),
                        msg: res.__("password must contain at least one lowercase letter (a-z)!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                        } else {
                            var re = /[A-Z]/;
                            if (!re.test(req.body.password)) {
                                req.session.formdata = req.body;
                                req.flash('warning', {
                        title: res.__("Not Save!"),
                        msg: res.__("password must contain at least one uppercase letter (A-Z)!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                            } else {
                                if (req.body.agreed != undefined) {
                                    User.createOrUpdate(null, req.body, function(err, user) {
                                        if (err) {
                                            req.session.formdata = req.body;
                                            req.flash('error', {
                                                title: res.__("Error!"),
                                                msg: res.__("Could not create your new account!"),
                                                target: '',
                                                url: '',
                                                target: '',
                                                bar: false
                                            });
                                            res.rendres.redirect('back');
                                        } else {
                                            req.login(user, function(err) {
                                                if (err) {
                                                    req.session.formdata = req.body;
                                                    req.flash('error', {
                                                        title: res.__("Error!"),
                                                        msg: err,
                                                        target: '',
                                                        url: '',
                                                        target: '',
                                                        bar: false
                                                    });
                                                    res.redirect('back');
                                                } else {
                                                    req.flash('success', {
                                                        title: '',
                                                        msg: res.__("Please add the missing data to your profile!"),
                                                        target: '',
                                                        url: '',
                                                        target: '',
                                                        bar: false
                                                    });
                                                    res.redirect("user/profile");
                                                }
                                            });
                                        }
                                    });
                                } else {

                                    req.session.formdata = req.body;
                                    req.flash('warning', {
                                        title: res.__("Accept the Terms of Use!"),
                                        msg: res.__("You\'ll need to accept out terms before you can register"),
                                        target: '',
                                        url: '',
                                        target: '',
                                        bar: false
                                    });
                                    res.redirect('back');
                                }
                            }
                        }
                    }
                }
            } else {
                req.session.formdata = req.body;
                req.flash('warning', {
                        title: res.__("Not Equal!"),
                        msg: res.__("Please check that you\'ve entered and confirmed your password!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
            }
        }
    });
    //Login
    app.get("/login", function(req, res) {
        res.render("acl/login", {
            user: "",
            title: "",
            subtitle: "",
            showtitle: "",
            layout: "layouts/default"
        });
    });


    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/user/profile',
        successFlash: true,
        failureFlash: true,
    }));

    //Logout
    app.get("/logout", function(req, res) {
            req.session.destroy();
            req.logout();
            res.redirect("/login");
    })
    //Lock
    app.get("/lock", function(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.pincode.length > 0) {
                if (req.user != undefined && req.user.uid.length > 0) {
                    req.session.locked = true;
                    res.render("acl/lock", {
                        title: "",
                        subtitle: "",
                        user: req.user,
                        showtitle: "none",
                        layout: "layouts/clean",
                        backend: true
                    });
                } else {
                    res.redirect("/login");
                }
            } else {
                req.flash('warning', {
                    title: res.__("Pincode fail!"),
                    msg: res.__("You need to set an pincode before you can lock your session!"),
                    target: '',
                    url: '',
                    target: '',
                    bar: false
                });
                res.redirect('back');
            }
        } else {
            res.redirect("/login");
        }

    });
    //Update user profile
    app.post("/contact", function(req, res) {
        if(req.body == undefined)
        {
            req.flash('error', {
                    title: res.__("Error!"),
                    msg: res.__("No mail created yet!"),
                    target: '',
                    url: '',
                    target: '',
                    bar: false
                });
            res.redirect('back');
        }
        else
        {
            if(req.body.name == '')
            {
                req.flash('error', {
                    title: res.__("Error!"),
                    msg: res.__("Please enter your name!"),
                    target: '',
                    url: '',
                    target: '',
                    bar: false
                });
                res.redirect('back');
            }
            else
            {
                    if(req.body.email == '')
                    {
                        req.flash('error', {
                            title: res.__("Error!"),
                            msg: res.__("Please enter your email address, without it we can't reply!"),
                            target: '',
                            url: '',
                            target: '',
                            bar: false
                        });
                        res.redirect('back');
                    }
                    else
                    {
                        if(/<[a-z][\s\S]*>/i.test(req.body.body))
                        {
                            req.flash('error', {
                                title: res.__("Error!"),
                                msg: res.__("Your message contains html values, for security reasons those are not accepted!"),
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            });
                            res.redirect('back');
                        }
                        else
                        {
                                User.ContactMail(req.body, function(err, user) 
                                {
                                if (err) {
                                    req.flash('error', {
                                        title: res.__("Error!"),
                                        msg: res.__("Could not send your message, please try again!"),
                                        target: '',
                                        url: '',
                                        target: '',
                                        bar: false
                                    });
                                    res.redirect("back");
                                    
                                } else {
                                    req.flash('success', {
                                        title: res.__("Success!"),
                                        msg: res.__("Message Send!"),
                                        target: '',
                                        url: '',
                                        target: '',
                                        bar: false
                                    });
                                    res.redirect("back");
                                }
                            });
                        }    
                    }    
            }

        }    


    });
};