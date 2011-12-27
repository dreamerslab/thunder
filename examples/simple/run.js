var thunder = require( '../../lib/thunder' ),
    input   = '<div>Hello, this is <?= it.name ?> :)</div>',
    render  = thunder.compile( input ),
    output  = render({ name : 'Bibi' });

console.log( output );