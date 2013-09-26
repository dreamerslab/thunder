var thunder = require( '../../../lib/thunder' );

thunder.settings.open  = '{{';
thunder.settings.close = '}}';

var input  = '<div>Hello, this is {{=it.name}} :)</div>';
var render = thunder.compile( input );
var output = render({ name : 'Bibi' });

console.log( output );
