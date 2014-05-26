/*!
 * thunder
 * Copyright(c) 2012 dreamerslab <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A lightning fast JavaScript template engine.
 */

;( function ( root ){
  var cache = {};

  // split `escape` into another obj speeds up the `no escape` parsing
  var escape = {

    rules : {
      '&' : '&amp;',
      '<' : '&lt;',
      '>' : '&gt;',
      '"' : '&quot;'
    },

    fn : function ( input ){
      return typeof( input ) != 'string' ?
        input : input.replace( /[&<>"]/g, function ( match ){
          return escape.rules[ match ];
        });
    }
  };

  var thunder = {

    version : '0.2.0',

    settings : {
      open   : '<?',
      close  : '?>'
    },

    compiled_text : function ( input, options ){
      input = input.replace( /\s*<!\[CDATA\[\s*|\s*\]\]>\s*/g, '\n' );

      var arr = ( options && options.compress === true
        // compress
        ? input.replace( /\r\n\t|\s+/g, ' ' )
        // chage the new line to unix version
        : input.replace( /\r\n|\r/g, '\n' )
      )
      .split( thunder.settings.open )
      .join( thunder.settings.close + '\x1b' )
      .split( thunder.settings.close );

      var str = '';
      var i   = 0;
      var j   = arr.length;
      var tmp = '';

      // string concat is faster than array `push`
      for(; i < j; i++ ){
        tmp = arr[ i ];
        str += tmp.charAt( 0 ) != '\x1b'
          // `\t` (tab) is ok, we need to handle with `\n` (line feed)
          ? "_buf+='" + tmp.replace( /(\\|[\"\'])/g, '\\$1' )
                           .replace( /\n/g, '\\n\\\n' ) + "'"
          : ( tmp.charAt( 1 ) == '='
            // replace trailing `;` and whitespace
            ? ';_buf+=' + tmp.substr( 2 ).replace( /[\;\s]+$/, '' ) + ';'
            : ( tmp.charAt( 1 ) == '-'
              ? ';_buf+=e(' + tmp.substr( 2 ).replace( /[\;\s]+$/, '' ) + ');'
              : ';' + tmp.substr( 1 )
                         .replace( /^\s+|\s+$/g, '' )
                         .replace( /[\w\'\"\)\$]$/, '$&;' )
              )
            );
      }

      // `replace` is faster than `split` -> `join`
      return ( 'var _buf="";' + str + ';return _buf;' ).
        replace( /_buf\+\=\'\'\;/g, '' ).
        replace( /var _buf\=\"\"\;_buf\+\=/g, 'var _buf=' );
    },

    compile : function ( input, options ){
      var str = thunder.compiled_text( input, options );
      var fn;

      try{
        // must save this new Function to fn,
        // do not just invoke in the return function, it's slow.
        // ex. return new Function( 'it', 'e', str )( locals, escape.fn ); <-- never do that
        // console.log( str );
        fn = new Function( 'it', 'e', str );
      }catch( err ){
        console.log( '[thunder] Having trouble with creating a template function: \n' + str );
        throw err;
      }

      return function ( locals ){
        return fn( locals, escape.fn );
      };
    },

    cached : function ( input, options, key ){
      key = key || input;

      if( !cache[ key ]){
        cache[ key ] = thunder.compile( input, options );
      }

      return cache[ key ];
    },

    render : function ( input, locals, options ){
      var method = options && options.cached === true ?
        'cached' : 'compile';

      return thunder[ method ]( input, options )( locals );
    },

    clear : function (){
      cache = {};
    }
  };

  // browser support
  // requirejs
  if( typeof define !== 'undefined' ){
    return define( function ( require, exports, module ){
      module.exports = thunder;
    });
  }

  // browser support
  // normal usage
  if( typeof exports === 'undefined' ){
    root.thunder = thunder;
    return;
  }

/**
 * Exports module.
 */
  module.exports = thunder;
})( this );
