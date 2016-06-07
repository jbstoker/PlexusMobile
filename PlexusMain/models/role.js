/*
 * @Author: JB Stoker
 * @Date:   2016-04-16 13:56:53
 * @Last Modified by:   JB Stoker
 * @Last Modified time: 2016-06-01 10:43:27
 */
var uuid = require("uuid"),
    db = require("../app").bucket,
    moment = require('moment'),
    N1qlQuery = require('couchbase').N1qlQuery,
    ViewQuery = require('couchbase').ViewQuery;


var env = process.env.NODE_ENV || 'development',
    config = require('../config/env/config')[env];

function OnOrOff(data) {
    if (data === 'on') {
        return 1;
    } else {
        return 0;
    }
}
/**
 * INIT ROLEMODEL
 */
function RoleModel() {};
/**
 * newRole function
 * creates new role in database
 * 
 * @param  int uid      [description]
 * @param  object data     [description]
 * @param  callback callback [description]
 * @return {[type]}            [description]
 */
RoleModel.newRole = function(uid, data, callback) {
    var documentId = uid ? uid : uuid.v4();

    var roleObject = {
        "uid": documentId,
        "type": "role",
        "name": data.role_name,
        "read": OnOrOff(data.role_read),
        "write": OnOrOff(data.role_write),
        "edit": OnOrOff(data.role_edit),
        "delete": OnOrOff(data.role_del),
        "publish": OnOrOff(data.role_publish)
    };

    db.upsert(documentId, roleObject, function(error, result) {
        if (error) {
            return callback(error, null);
        }
        return callback(null, roleObject);
    });
};
//End RoleModel Signup
//RoleModel GetByDocumentId
RoleModel.getByDocumentId = function(documentId, callback){

    var query = ViewQuery.from('roles', 'rolebyid').key(documentId).stale(1);
    db.query(query, function(error, result) {
        if (error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};
//End RoleModel GetByDocumentId
//RoleModel DeleteRole
RoleModel.DeleteRole = function(documentId, callback) {
    db.remove(documentId, function(error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, {
            message: "success",
            data: result
        });
    });
};
//End RoleModel DeleteRole
//RoleModel getAllRoles
RoleModel.getAllRoles = function(callback) {
    var query = ViewQuery.from('roles', 'roles').stale(1);
    db.query(query, function(error, result) {
        if (error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};
//End RoleModel getAllRoles

module.exports = RoleModel;