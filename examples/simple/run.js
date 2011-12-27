var thunder = require( 'thunder' ),
    input   = '<div>Hello, this is <?= it.name ?> :)</div>',
    render  = thunder.compile( view ),
    output  = render({ name : 'Bibi' });

console.log( output );