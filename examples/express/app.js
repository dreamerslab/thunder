
/**
 * Module dependencies.
 */

var express = require( 'express' );
var routes  = require( './routes' );
var app     = module.exports = express.createServer();

// Configuration

app.configure( function (){
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'html' );
  app.register( '.html', require( 'thunder' ));
  app.use( express.bodyParser());
  app.use( express.methodOverride());
  app.use( app.router );
  app.use( express[ 'static' ]( __dirname + '/public' ));
});

app.configure( 'development', function (){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true })); 
});

app.configure( 'production', function (){
  app.set( 'view options', {
    compress : true
  });
  app.use( express.errorHandler()); 
});

// Routes

app.get( '/', routes.index );

app.listen( 3000 );
console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
