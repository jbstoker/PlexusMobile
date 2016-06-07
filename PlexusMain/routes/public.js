var express = require("express"),
passport = require("passport"),
moment = require("moment"),
LocalStrategy = require("passport-local").Strategy,
Auth = require("../config/env/acl/middlewares/authorization.js"),
datatablesQuery = require("../middlewares/datatables/query"),
User = require("../models/user"),
Role = require("../models/role"),
env = process.env.NODE_ENV || 'development',
config = require('../config/env/config')[env];

module.exports = function(app, passport, i18n) {
/* To disable title in page set "showtitle" to none // extends display:
 *
 * ####################### Basic ROUTES ###################
 *
 *
 */
    /* GET home page. */
    app.get("/", function(req, res, next) {
        res.render("bodies/index", {
            title: res.__('Plexus!'),
            subtitle: res.__('connecting data'),
            showtitle: "",
            layout: "layouts/default"
        });
    });
    /**
 * Terms and FAQ Routes
 */
    app.get("/terms", function(req, res, next) {
        res.render("bodies/terms", {
            title: res.__('Terms and Conditions!'),
            subtitle: res.__('These are our terms, just accept it'),
            showtitle: "",
            layout: "layouts/default",
            app: config.app
        });
    });
    app.get("/privacy", function(req, res, next) {
        res.render("bodies/privacy", {
            title: res.__('Privacy & Cookie policy!'),
            subtitle: res.__('These are our terms, just accept it'),
            showtitle: "",
            layout: "layouts/default",
            app: config.app
        });
    });
    app.get("/faq", function(req, res, next) {
        res.render("bodies/faq", {
            title: res.__('Frequent Asked Questions!'),
            subtitle: res.__('Don\'t ask, just read'),
            showtitle: "",
            layout: "layouts/default"
        });
    });
};