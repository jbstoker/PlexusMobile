
// 
// NODE_ENV helper
// 
// If given a parameter, acts a block helper to determine the current env, eg.
// 
//   {{#env "development"}} In Dev Mode {{else}} In Prod Mode {{/env}}
// 
// If not given a parameter, simply returns the current environment, eg.
// 
//   Current environment is {{env}}
// 
require('hbs').registerHelper('env', function(env, opts) {
	if (typeof env === 'string') {
		return (env === process.env.NODE_ENV) ? opts.fn(this) : opts.inverse(this);
	}

	return process.env.NODE_ENV;
});
