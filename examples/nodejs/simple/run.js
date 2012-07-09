var thunder = require( '../../../lib/thunder' );
var input   = '<div>Hello, this is <?= it.name ?> :)</div>';
var render  = thunder.compile( input );
var output  = render({ name : 'Bibi' });

console.log( output );