var handlebars = require('hbs');

var used = { };
var extensions = { };

exports.use = function(helpers) {
	if (arguments.length > 1) {
		return use(Array.prototype.slice.call(arguments));
	}

	if (typeof helpers === 'string') {
		return use([ helpers ]);
	}

	return use(helpers);
};

exports.extend = function(name, func) {
	if (! extensions[name]) {
		extensions[name] = {
			name: name,
			func: func
		};
	}
};

function use(helpers) {
	helpers.forEach(function(helper) {
		if (! used[helper]) {
			used[helper] = true;
			
			if (extensions[helper]) {
				helper = extensions[helper];
				return handlebars.registerHelper(helper.name, helper.func);
			}

			require('./helpers/' + helper);
		}
	});
}
