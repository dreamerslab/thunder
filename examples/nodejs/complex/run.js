var thunder = require( '../../../lib/thunder' );
var input   = require( 'fs' ).readFileSync( './input.html', 'utf8' );

var ouput = thunder.render( input ,{
  title : '[thunder] Rocks!',
  header1 : "This is header 1",
  header2 : 'This is header 2',
  header3 : 'This is header 3',
  header4 : 'This is header 4',
  header5 : 'This is header 5',
  header6 : 'This is header 6',
  list : [
    'This is list 1',
    'This is list 2',
    'This is list 3',
    'This is list 4',
    'This is list 5',
    'This is list 6'
  ],
  escape : [ '&', '<', '>', '"' ]
});

console.log( ouput );
