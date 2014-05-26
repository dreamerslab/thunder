/*!
 * thunder
 * Copyright(c) 2012 dreamerslab <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * Utility functions for builing ommand line tools.
 */

var fs     = require( 'fs' );
var mkdirp = require( 'mkdirp' );
var rmdir  = require( 'rmdir' );
var color  = require( 'cli-color' );

module.exports = {

  regex : {
    end_with_slash : /\/$/,
    file_name      : /([^\0]+)((\/)([^\0]+)(.html$|.js$))/,
    html           : /\.html$/,
    slash          : /\//g
  },

/**
 * Add spaces for better syntax of COKE command line tools.
 * @public
 * @this {global}
 * @param {Function} str The target string.
 * @param {Function} len Max length inculding the target string plus spaces.
 * @param {Function} to_start Add spaces to the front.
 */
  add_spaces : function ( str, len, to_start ){
    var str_len = str.length;
    var i       = str_len;

    for( ;i < len; i += 1 ){
      if( !to_start ){
        str += ' ';
      }else{
        str = ' ' + str;
      }
    }

    return str;
  },

  // for client-side
  html_to_text : function ( input ){
    return input.
      replace( /\"/g, '\\\"' ).
      replace( /\n/g, '\\n\\\n' );
  },

  write : function ( layout, input_path, output_path, layout_format ){
    var output_dir = output_path.replace( this.regex.file_name, '$1' );
    var is_dir     = output_dir === output_path;

    // tgt is a dir, if its not there create it
    if( is_dir && !fs.existsSync( output_dir )){
      mkdirp.sync( output_dir, '0755' );
      return console.log( color.green( 'created  ' ), output_dir );
    }

    // tgt is a file, check for parent dir existance, if its not there create it
    if( !fs.existsSync( output_dir )){
      mkdirp.sync( output_dir, '0755' );
      console.log( color.green( 'created  ' ), output_dir );
    }

    var src = fs.readFileSync( input_path, 'utf8' );
    var tmp = this.html_to_text( src );
    var tpl = layout.replace( '__content__', tmp );

    if( layout_format == 'window' ){
      var tpl_name = input_path.
        replace( this.input_dir, '' ).
        replace( this.regex.html, '' ).
        replace( this.regex.slash, '_' );

      tpl = tpl.replace( '__tpl_name__', tpl_name );
    }

    // create
    if( !fs.existsSync( output_path )){
      fs.writeFileSync( output_path , tpl );
      return console.log( color.green( 'created  ' ), output_path )
    }

    // update
    var ori_output = fs.readFileSync( output_path );

    if( ori_output != tpl ){
      fs.writeFileSync( output_path , tpl );
      console.log( color.yellow( 'overwrote' ), output_path );
    }
  },

  remove : function ( output_dir ){
    if( fs.existsSync( output_dir )){
      rmdir( output_dir, function ( err, dirs, files ){
        console.log( color.gray( 'removed  ' ), output_dir );
      });
    }
  },

  build : function ( layout, input_dir, output_dir, layout_format ){
    var self = this;

    if( !this.regex.end_with_slash.test( input_dir )){
      input_dir += '/';
    }

    if( !this.regex.end_with_slash.test( output_dir )){
      output_dir += '/';
    }

    if( !fs.existsSync( input_dir )){
      console.log( color.red( 'error    ' ), 'input dir does not exist at ' + input_dir );
      return process.exit( 0 );
    }

    if( !fs.existsSync( output_dir )){
      mkdirp.sync( output_dir, '0755' );
      console.log( color.green( 'created  ' ), output_dir );
    }

    var files = fs.readdirSync( input_dir );

    files.forEach( function ( file ){
      var new_input_path  = input_dir + file;
      var new_output_path = output_dir + file;

      var stat = fs.statSync( new_input_path );

      if( stat && stat.isDirectory()){
        return self.build( layout, new_input_path, new_output_path );
      }

      if( self.regex.html.test( file )){
        new_output_path = new_output_path.replace( '.html', '.js' );

        self.write( layout, new_input_path, new_output_path, layout_format );
      }
    });
  },

  layout : function ( layout_format ){
    if( layout_format === 'browserify' ){
      return '\
module.exports = "__content__";\n\
';
    }

    if( layout_format === 'requirejs' ){
      return '\
define( function ( require, exports, module ){\n\
  module.exports = "__content__";\n\
});\n\
'
    }

    return '\
var __tpl_name__ = "__content__";\n\
';
  }
};
