var async = require('async'),
    couchbase = require('couchbase'),
    db = require("../../app").bucket,
    N1qlQuery = couchbase.N1qlQuery;
function Query() {};
/**
 * Get the search fields.
 * Returns an array of fieldNames based on DataTable Params object
 * All columns in Params.columns that have .searchable == true field will have the .data param returned in an String
 *
 * @method     getSearchFields
 * @param      {Array}  Datatable object
 * @return     {Array}  All searchable fields
 */
function getSearchFields(Params) {
    return Params.columns.filter(function(column) {
        return JSON.parse(column.searchable);
    }).map(function(column) {
        return column.data;
    });
};
/**
 * Determine if any value is NAN nor undefined.
 *
 * @method     isNaNorUndefined
 * @return     {boolean}
 */
function isNaNorUndefined() {
    var args = Array.prototype.slice.call(arguments);
    return args.some(function(arg) {
        return isNaN(arg) || (!arg && arg !== 0);
    });
};
/**
 * { function_description }
 *
 * @method     buildFindParameters
 * @param      {<type>}  Params  { description }
 * @return     {<type>}  { description_of_the_return_value }
 */
function buildFindParameters(Params) {
    if (!Params || !Params.columns || !Params.search_value && Params.search_value !== '') {
        return null;
    }
    var searchText = Params.search_value,
        searchOrArray = [];
    if (searchText === '') {
        return '';
    }
    var searchableFields = getSearchFields(Params);
    if (searchableFields.length === 1) {
        return 'AND LOWER(' + searchableFields[0].replace('key.', '') + ') LIKE LOWER("%' + searchText + '%")';
    }
    searchableFields.forEach(function(field) {
        var column = field.replace('key.', '');
        searchOrArray.push(' LOWER(' + column + ') LIKE LOWER("%' + searchText + '%") ');
    });
    return 'AND ' + searchOrArray.join(' OR ');
};
/**
 * DataTable call rendering for couchbase
 *
 * @method     datatablesQuery
 * @param      {<type>}  Params  { description }
 * @param      {<type>}  Model   { description }
 * @param      {<type>}  Full    { description }
 * @return     {Object}  { description_of_the_return_value }
 */
Query.fetchData = function(Params, Type, Full, callback) {

    var data = [{
        'draw': '',
        'columns': [],
        'tablenames': [],
        'order_column': '',
        'order_dir': '',
        'start': '',
        'length': '',
        'search_value': '',
        'full': Full,
        'type': Type
    }];
    async.forEachOf(Params, function(value, key, cb) {
        try {
            if (key.endsWith('draw')) {
                data[0]['draw'] = Number(Params[key]);
            }
            if (key.endsWith('][data]')) {
                // data
                var rownum = parseInt(key.match(/[0-9]+/)[0], 10);
                data[0]['columns'][rownum] = [];
                data[0]['columns'][rownum]['data'] = Params[key];
                if (data[0]['tablenames'].indexOf(Params[key]) === -1) {
                    data[0]['tablenames'].push(Params[key].replace('key.', ''));
                }
            }
            if (key.endsWith('][name]')) {
                // name
                var rownum = parseInt(key.match(/[0-9]+/)[0], 10);
                data[0]['columns'][rownum]['name'] = Params[key];
            }
            if (key.endsWith('][searchable]')) {
                // searchable
                var rownum = parseInt(key.match(/[0-9]+/)[0], 10);
                data[0]['columns'][rownum]['searchable'] = Params[key];
            }
            if (key.endsWith('][orderable]')) {
                // orderable
                var rownum = parseInt(key.match(/[0-9]+/)[0], 10);
                data[0]['columns'][rownum]['orderable'] = Params[key];
            }
            if (key.endsWith('][search][value]')) {
                // search
                var rownum = parseInt(key.match(/[0-9]+/)[0], 10);
                data[0]['columns'][rownum]['searchval'] = Params[key];
            }
            if (key.endsWith('][search][regex]')) {
                // search
                var rownum = parseInt(key.match(/[0-9]+/)[0], 10);
                data[0]['columns'][rownum]['searchreg'] = Params[key];
            }
            if (key.endsWith('][column]')) {
                var name = data[0]['columns'][Number(Params[key])]['data'].replace('key.','');

                if(name != 'key' || name != '')
                {
                    data[0]['order_column'] = data[0]['columns'][Number(Params[key])]['data'].replace('key.','');
                }
                else
                {
                    data[0]['order_column'] = 'uid';   
                }    

            }
            if (key.endsWith('][dir]')) {
                data[0]['order_dir'] = Params[key];
            }
            if (key.endsWith('start')) {
                data[0]['start'] = Number(Params[key]);
            }
            if (key.endsWith('length')) {
                data[0]['length'] = Number(Params[key]);
            }
            if (key.endsWith('search[value]')) {
                data[0]['search_value'] = Params[key];
            }
        } catch (e) {
            return cb(e);
        }
        cb();
    }, function(err) {
        if (err) console.log(err);
        async.series({
                draw: function(cb) {
                    var draw = Number(data[0].draw);
                    if (isNaNorUndefined(draw)) {
                        return cb(new Error('Some parameters are missing or in a wrong state. ' +
                            'Could be any of draw, start or length'));
                    }
                    cb(null, draw);
                },
                data: function(cb) {
                    var columns = Array.from(new Set(data[0].tablenames)).join(),
                        SearchStatement = buildFindParameters(data[0]);
                    //query
                    if (data[0].full == true) {
                        var query = N1qlQuery.fromString('SELECT * FROM default as `key` WHERE type="' + data[0].type + '" ' + SearchStatement + ' ORDER BY ' + data[0].order_column + ' ' + data[0].order_dir + ' LIMIT ' + data[0].length + ' OFFSET ' + data[0].start);
                        db.query(query, function(err, results) {
                            cb(null, results);
                        });
                    } else {


                        var query = N1qlQuery.fromString('SELECT ' + columns + ' FROM default as `key` WHERE type="' + data[0].type + '" ' + SearchStatement + ' ORDER BY ' + data[0].order_column + ' ' + data[0].order_dir + ' LIMIT ' + data[0].length + ' OFFSET ' + data[0].start);

                        db.query(query, function(err, results) {
                            cb(null, results);
                        });
                    }
                },
                recordsTotal: function(cb) {
                    var query = N1qlQuery.fromString('SELECT COUNT(*) as `key` FROM default WHERE type="' + data[0].type + '"');
                    db.query(query, function(err, results) {
                        if (results !== null) {
                            cb(null, results[0].key);
                        } else {
                            cb(null, 0);
                        }
                    });
                },
                recordsFiltered: function(cb) {
                    var SearchStatement = buildFindParameters(data[0]);
                    var query = N1qlQuery.fromString('SELECT COUNT(*) as `key` FROM default WHERE type="' + data[0].type + '" ' + SearchStatement + ' ORDER BY ' + data[0].order_column + ' ' + data[0].order_dir + ' LIMIT ' + data[0].length + ' OFFSET ' + data[0].start);
                    db.query(query, function(err, results) {
                        if (results !== null) {
                            cb(null, results[0].key);
                        } else {
                            cb(null, 0);
                        }
                    });
                }
            },
            function(err, results) {
                if (err) {
                    return callback(null, {
                        message: "Error",
                        data: err
                    });
                } else {
                    return callback(null, results);
                }
            });
    });
};
module.exports = Query;