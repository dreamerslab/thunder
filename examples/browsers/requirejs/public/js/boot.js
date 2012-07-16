define( function ( require, exports, module ){
  var thunder = require( 'libs/thunder' );
  var input   = require( 'views/hello' );
  var locals  = require( 'models/hello');
  var view    = thunder.render( input, locals );

  $( 'body' ).append( view );
});
