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
 * ####################### ADMIN ROUTES ###################
 *
 *
 *
 *
 */
    app.get("/manage_users", function(req, res, next) {
        if (req.isAuthenticated()) {
            Role.getAllRoles(function(err, roles) {
                if (err) {
                    return err;
                } else {
                    res.render("admin/index", {
                        title: res.__('Users!'),
                        subtitle: res.__('Management'),
                        showtitle: "",
                        layout: "layouts/sidebar",
                        backend:true,
                        user: req.user,
                        roles: roles
                    });
                }
            });
        } else {
            res.redirect("/login");
        }
    });
    //Get user for update
    app.post("/sendmail", function(req, res) {
        User.SendMail(req.body.to,req.body,function(err,user){
            if (err){
                        res.json({uid:user.id,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not send the email!"),target:'',url:'',target:'',bar:false}});
                    } 
                    else 
                    {
                        res.json({uid:user.id,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("Email is send!"),target:'',url:'',target:'',bar:false}});
                    }
        });
    });
    //Get user for update
    app.post("/get-user/:id", function(req, res) {
        User.getByDocumentId(req.params.id, function(err, user) {
            if (err || !user) {
                res.status(500).json(err);
            } else {
                res.json(user);
            }
        });
    });
    //delete user
    app.post("/delete-user/:id", function(req, res) {
        User.DeleteUser(req.params.id, function(err, user) {
            if (err){
                        res.json({uid:req.params.id,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not remove the user!"),target:'',url:'',target:'',bar:false}});
                    } 
                    else 
                    {
                        res.json({uid:req.params.id,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("User is removed!"),target:'',url:'',target:'',bar:false}});
                    }
        });
    });
    //Create user
    app.post("/create-user", function(req, res) 
    {        
        User.createACLUser(req.body, function(err, user){

            if (err){
                        if(user.message.length > 0)
                        {
                            res.json({message:{type:user.message,title:'<strong>'+res.__("Error!")+'</strong>',msg:user.data,target:'',url:'',target:'',bar:false}});
                        }
                        else
                        {
                            res.json({user:user,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not create the user!"),target:'',url:'',target:'',bar:false}});
                        }    
                    } 
                    else 
                    {
                        res.json({user:user,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("User is created!"),target:'',url:'',target:'',bar:false}});
                    }
        });    
    });
    //Update user
    app.post("/update-user/:id", function(req, res) {
        //Check if names are only letters
        User.findACLUserAndUpdate(req.params.id, req.body, function(err, user) {
            if (err){
                        res.json({user:user,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not update the user!"),target:'',url:'',target:'',bar:false}});
                    } 
                    else 
                    {
                        res.json({user:user,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("User is updated!"),target:'',url:'',target:'',bar:false}});
                    }
        });
    });
    //Get role for update
    app.post("/get-role/:id", function(req, res) {
        Role.getByDocumentId(req.params.id, function(err, role) {
            if (err || !role) {
                res.status(500).json(err);
            } else {
                res.json(role);
            }
        });
    });
    //delete role
    app.post("/delete-role/:id", function(req, res) {
        Role.DeleteRole(req.params.id, function(err, role) {
            if (err){
                        res.json({uid:req.params.id,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not remove the role!"),target:'',url:'',target:'',bar:false}});
                    } 
                    else 
                    {
                        res.json({uid:req.params.id,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("Role was removed!"),target:'',url:'',target:'',bar:false}});
                    }
        });
    });
    //Create Role
    app.post("/create-role", function(req, res) {
        Role.newRole(null, req.body, function(err, role) {
             if (err){
                        res.json({role:role,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not create the role!"),target:'',url:'',target:'',bar:false}});
                    } 
                    else 
                    {
                        res.json({role:role,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("Role is created!"),target:'',url:'',target:'',bar:false}});
                    }
        });
    });
    //Update Role
    app.post("/update-role/:id", function(req, res) {
        Role.newRole(req.params.id, req.body, function(err, role) {
            if (err){
                        res.json({role:role,message:{type:'danger',title:'<strong>'+res.__("Error!")+'</strong>',msg: res.__("Could not update the role!"),target:'',url:'',target:'',bar:false}});
                    } 
                    else 
                    {
                        res.json({role:role,message:{type:'success',title:'<strong>'+res.__("Succes!")+'</strong>',msg: res.__("Role is updated!"),target:'',url:'',target:'',bar:false}});
                    }
        });
    });
    app.post("/get_roles", function(req, res, next) {
        datatablesQuery.fetchData(req.body,"role", true, function(err, data) {
            if (err) {
                res.json(err);
            }
            res.json(data);
        });
    });
    // //Datatable getAllUsers
    app.post("/get_users", function(req, res, next) {
        datatablesQuery.fetchData(req.body, "user", true, function(err, data) {
            if (err) {
                res.json(err);
            }
            res.json(data);
        });
    });
    //Main Settings Page
    app.get("/settings", function(req, res, next) {
        if (req.isAuthenticated()) {
            res.render("admin/settings", {
                title: res.__('Settings!'),
                subtitle: "",
                showtitle: "",
                layout: "layouts/sidebar",
                backend:true,
                user: req.user
            });
        } else {
            res.redirect("/login");
        }
    });
};    