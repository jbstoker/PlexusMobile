var express = require("express"),
    passport = require("passport"),
    moment = require("moment"),
    LocalStrategy = require("passport-local").Strategy,
    Auth = require("../config/env/acl/middlewares/authorization.js"),
    datatablesQuery = require("../middlewares/datatables/query"),
    User = require("../models/user"),
    Role = require("../models/role");

module.exports = function(app, passport, i18n) {
    //Storage of files and avatar
    var multer = require("multer");
    var storageDisk = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "./public/uploads/avatar/");
        },
        filename: function(req, file, cb) {
            var url = file.originalname;
            var ext = (url = url.substr(1 + url.lastIndexOf("/")).split("?")[0]).substr(url.lastIndexOf("."));
            cb(null, req.user.id + ext);
        }
    });
    var storageMemory = multer.memoryStorage();
    var uploadAvatar = multer({
        storage: storageMemory
    });
    /** Data Checks */
    function onlyLetters(str) {
        if(str === undefined)
        {
            return true;
        } 
        else
        {
            if (str.length > 0) {
                return /^[a-zA-Z]+$/.test(str);
            } else {
                return true;
            }
        }    
    }

    function onlyNumbers(str) {
        if(str === undefined)
        {
            return true;
        } 
        else
        {
            if (str.length > 0) {
                return /^[0-9]+$/.test(str);
            } else {
                return true;
            }
        } 
    }

    function onlyLettersNumbers(str) {
        if(str === undefined)
        {
            return true;
        } 
        else
        {
            if (str.length > 0) {
                return /^[a-zA-Z0-9]+$/.test(str);
            } else {
              return true;
            }
        }
    }
    /**
     *
     *
     *
     * ####################### USER ROUTES ###################
     *
     *
     *
     *
     */
    app.get("/user/profile", Auth.isAuthenticated, function(req, res, next) {
        if (req.isAuthenticated()) {
            res.render("user/profile", {
                title: res.__('Profile!'),
                user: req.user,
                birthday: moment(req.user.birthday).format("YYYY-MM-DD"),
                subtitle: "",
                showtitle: "none",
                layout: "layouts/sidebar",
                backend: true
            });
        } else {
            res.redirect("/login");
        }
    });
    //Update user profile
    app.post("/update-profile/:id", function(req, res) {
        if (req.isAuthenticated()) {
            //Check names for only letters
            if (onlyLetters(req.body.surname) && onlyLetters(req.body.middlename) && onlyLetters(req.body.lastname) && onlyLetters(req.body.maidenname)) {
                if (onlyNumbers(req.body.phone) && onlyNumbers(req.body.mobile)) {
                    // addresscheck
                    if (onlyLetters(req.body.address) && onlyLettersNumbers(req.body.number)) {
                        if (onlyLetters(req.body.city) && onlyLetters(req.body.country)) {
                            User.findUserAndUpdate(req.params.id, req.body, function(err, user) {
                                if (err) {
                                    req.flash('error', {
                                        title: res.__("Error!"),
                                        msg: res.__("Could not update your profile!"),
                                        target: '',
                                        url: '',
                                        target: '',
                                        bar: false
                                    });
                                } else {
                                    req.flash('success', {
                                        title: res.__("Success!"),
                                        msg: res.__("Profile updated!"),
                                        target: '',
                                        url: '',
                                        target: '',
                                        bar: false
                                    });
                                }
                                res.redirect("back");
                            });
                        } else {
                            req.flash('error', {
                                title: res.__("Error!"),
                                msg: res.__("Cities and Countries are always with letters right?!"),
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            });
                            res.redirect('back');
                        }

                    } else {
                        req.flash('error', {
                            title: res.__("Error!"),
                            msg: res.__("Please check your address!"),
                            target: '',
                            url: '',
                            target: '',
                            bar: false
                        });
                        res.redirect('back');
                    }
                } else {
                    req.flash('error', {
                        title: res.__("Error!"),
                        msg: res.__("Phone numbers need both to contain only numbers!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect("back");
                }
            } else {
                req.flash('error', {
                    title: res.__("Error!"),
                    msg: res.__("Name needs to contain only letters!"),
                    target: '',
                    url: '',
                    target: '',
                    bar: false
                });
                res.redirect("back");
            }
        } else {
            res.redirect("/login");
        }
    });
    //Update avatar user
    app.post("/update-avatar/:id", uploadAvatar.single("avatar"), function(req, res) {
        if (req.isAuthenticated()) {
            var newfilename = req.params.id + "-" + moment().format("X") + ".jpg";
            User.findAvatarAndUpdate(req.file, req.body, req.params.id, newfilename, function(err, file) {
                if (err) {
                    req.flash('error', {
                        title: res.__("Error!"),
                        msg: res.__("Could replace your avatar!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                } else {
                    req.flash('success', {
                        title: res.__("Success!"),
                        msg: res.__("Avatar replaced!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                }
            });
            res.json(newfilename).status(204).end();
        } else {
            res.redirect("/login");
        }
    });
    //User settings
    app.get("/user/settings", Auth.isAuthenticated, function(req, res, next) {
        if (req.isAuthenticated()) {
            res.render("user/settings", {
                title: res.__('Settings!'),
                user: req.user,
                subtitle: "",
                showtitle: "none",
                layout: "layouts/sidebar",
                backend: true
            });
        } else {
            res.redirect("/login");
        }
    });
    //Change language
    app.get("/setlocale/:locale", function(req, res) {
        if (req.isAuthenticated()) {
            app.locals.locale = req.params.locale;
            User.setLocale(req.user.uid, req.params.locale, function(err, locale) {
                if (err) {
                    req.flash('error', {
                        title: res.__("Error!"),
                        msg: res.__("Your preffered language failed to set to ") + req.params.locale,
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect("/user/settings");
                } else {
                    req.flash('info', {
                        title: res.__("Info!"),
                        msg: res.__("Your language is set to ") + req.params.locale,
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect("/user/settings");
                }
            });
        } else {
            res.redirect("/login");
        }
    });
    //post pin
    app.post("/checkpin", function(req, res, next) {
        User.getByDocumentId(req.body.uid, function(err, user) {
            if (!user) {
                if (!err) {
                    req.flash('error', {
                        title: res.__("Error!"),
                        msg: res.__("Your call is missing the uid parameters"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                } else {
                    req.flash('error', {
                        title: res.__("Error!"),
                        msg: err.message,
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                }
            } else {
                if (user.pincode === req.body.pin) {
                    req.session.locked = false;
                    req.flash('success', {
                        title: res.__("Success!"),
                        msg: res.__("Welcome back"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('/user/profile');
                    return false
                } else {
                    req.flash('warning', {
                        title: res.__("Pincode Failed!"),
                        msg: res.__("Your entered pincode doesn\'t match, try again!"),
                        target: '',
                        url: '',
                        target: '',
                        bar: false
                    });
                    res.redirect('back');
                }
            }
        });

    });

    /**
     * Access check for password change
     * @param  {object} req   [description]
     * @param  {object} res   [description]
     * @param  {object} next)                  {        User.doAccessCheck(req.body, function(err, user)        {                   if(!err)                {                        if(req.user.uid [description]
     * @return {object}       [description]
     */
    app.post("/access-check", function(req, res, next) {
        if (req.isAuthenticated()) {
            User.doAccessCheck(req.body, function(err, user) {
                if (!err) {
                    if (req.user.uid === user) {
                        res.json({
                            message: {
                                type: 'success',
                                title: res.__("Logged In!"),
                                msg: res.__("Login Correct!"),
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    } else {
                        res.json({
                            message: {
                                type: 'danger',
                                title: res.__("Error!"),
                                msg: user,
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    }
                } else {
                    res.json({
                        message: {
                            type: 'danger',
                            title: res.__("Error!"),
                            msg: err.message,
                            target: '',
                            url: '',
                            target: '',
                            bar: false
                        }
                    });
                }
            });
        } else {
            res.redirect("/login");
        }
    });


    app.post("/user/change-login", function(req, res, next) {
        if (req.isAuthenticated()) {
            User.UpdateLogin(req.user.uid, req.body, function(err, user) {
                if (!err) {
                    if (req.user.uid === user.uid) {
                        res.json({
                            message: {
                                type: 'success',
                                title: res.__("Change success!"),
                                msg: res.__("Login Changed!"),
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    } else {
                        res.json({
                            message: {
                                type: 'danger',
                                title: res.__("Error!"),
                                msg: user,
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    }
                } else {
                    res.json({
                        message: {
                            type: 'danger',
                            title: res.__("Error!"),
                            msg: err.message,
                            target: '',
                            url: '',
                            target: '',
                            bar: false
                        }
                    });
                }
            });
        } else {
            res.redirect("/login");
        }
    });


    app.post("/user/change-pincode", function(req, res, next) {
        if (req.isAuthenticated()) {
            User.UpdatePincode(req.user.uid, req.body, function(err, user) {
                if (!err) {
                    if (req.user.uid === user.uid) {
                        res.json({
                            message: {
                                type: 'success',
                                title: res.__("Change success!"),
                                msg: res.__("Pincode Changed!"),
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    } else {
                        res.json({
                            message: {
                                type: 'danger',
                                title: res.__("Error!"),
                                msg: user,
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    }
                } else {
                    res.json({
                        message: {
                            type: 'danger',
                            title: res.__("Error!"),
                            msg: err.message,
                            target: '',
                            url: '',
                            target: '',
                            bar: false
                        }
                    });
                }
            });
        } else {
            res.redirect("/login");
        }
    });

    app.post("/user/change-password", function(req, res, next) {
        if (req.isAuthenticated()) {
            User.UpdatePass(req.user.uid, req.body, function(err, user) {
                var pass = req.body.password.toLowerCase();

                if (!err) {
                    if (pass.indexOf(req.user.login) != -1) {
                        res.json({
                            message: {
                                type: 'warning',
                                title: res.__("Not Save!"),
                                msg: res.__("Password must be different from Username!"),
                                target: '',
                                url: '',
                                target: '',
                                bar: false
                            }
                        });
                    } else {
                        if (req.user.uid === user.uid) {
                            res.json({
                                message: {
                                    type: 'success',
                                    title: res.__("Change success!"),
                                    msg: res.__("Password Changed!"),
                                    target: '',
                                    url: '',
                                    target: '',
                                    bar: false
                                }
                            });
                        } else {
                            res.json({
                                message: {
                                    type: 'danger',
                                    title: res.__("Error!"),
                                    msg: user,
                                    target: '',
                                    url: '',
                                    target: '',
                                    bar: false
                                }
                            });
                        }
                    }
                } else {
                    res.json({
                        message: {
                            type: 'danger',
                            title: res.__("Error!"),
                            msg: err.message,
                            target: '',
                            url: '',
                            target: '',
                            bar: false
                        }
                    });
                }
            });
        } else {
            res.redirect("/login");
        }
    });
};