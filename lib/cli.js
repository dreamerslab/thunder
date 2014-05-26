/*!
 * thunder
 * Copyright(c) 2012 dreamerslab <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * Command line tools.
 */

var color  = require( 'cli-color' );
var watchr = require( 'watchr' );
var utils  = require( './utils' );

module.exports = {

  help : function (){
    var max_len  = 0;
    var help     = [ 'Usage: thunder [command] [argument(s)]\n', 'Commands:' ];
    var commands = [
      [ '-v', '--version', 'Display thunder version' ],
      [ 'h', 'help', 'Display usage information' ],
      [ 'b', 'build [args]', 'Precompile templates' ],
      [ 'w', 'watch [args]', 'Watch for changes' ]
    ];

    commands.forEach( function( cmd ){
      if( cmd[ 1 ].length > max_len ){
        max_len = cmd[ 1 ].length;
      }
    });

    commands.forEach( function( cmd ){
      help.push( '  ' + utils.add_spaces( cmd[ 0 ] + ',', 4 ) +
        utils.add_spaces( cmd[ 1 ], max_len + 1 ) + cmd[ 2 ]);
    });

    help.push( '\nArguments for `build` & `watch commands`' );
    help.push( '  ' + '-i, --input=/new/input/dir   Default: ./templates' );
    help.push( '  ' + '-o, --output=/new/output/dir Default: ./views' );
    help.push( '  ' + '-b, --browserify             Browserify template format' );
    help.push( '  ' + '-r, --requirejs              Requirejs template format' );
    console.log( help.join('\n'));
  },

  watch : function ( input_dir, output_dir, layout_format ){
    utils.input_dir = input_dir;

    watchr.watch({
      path     : input_dir,
      listener : function( event, file_path, current_stat, previous_stat ){
        var input  = file_path;
        var output = input.replace( input_dir, output_dir ).replace( '.html', '.js' );

        if( event === 'new' || event === 'change' || event === 'update' ){
          return utils.write( utils.layout( layout_format ), input, output, layout_format );
        }

        if( event === 'unlink' ){
          utils.remove( output );
        }
      },
      next : function ( err,watcher ){
        if( err ) throw err;

        console.log( '>>> thunder is polling for changes. Press Ctrl+C to Stop.' );
        utils.build( utils.layout( layout_format ), input_dir, output_dir, layout_format );
      }
    });
  },

  build : function ( input_dir, output_dir, layout_format ){
    utils.input_dir = input_dir;

    utils.build( utils.layout( layout_format ), input_dir, output_dir, layout_format );

    console.log( color.green( 'done     ' ), 'all templates are compiled' );
  }
};
