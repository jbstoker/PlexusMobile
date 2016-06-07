
// 
// Logical conditional helper
// 
// An extension of the built-in #if helper, this provides support for logical operations
// 
require('hbs').registerHelper('cond', function(val1, op, val2, opts) {
	switch (op) {
		case '==':
			return cond(val1 == val2);
		break;
		case '===':
			return cond(val1 === val2);
		break;
		case '!=':
			return cond(val1 != val2);
		break;
		case '!==':
			return cond(val1 !== val2);
		break;
		case '&&':
			return cond(val1 && val2);
		break;
		case '||':
			return cond(val1 || val2);
		break;
		case '^^':
			return cond((! val1) != (! val2));
		break;
		case '<':
			return cond(val1 < val2);
		break;
		case '<=':
			return cond(val1 <= val2);
		break;
		case '>':
			return cond(val1 > val2);
		break;
		case '>=':
			return cond(val1 >= val2);
		break;
	}

    function cond(value) {
    	return value ? opts.fn(this) : opts.inverse(this);
    }
});
