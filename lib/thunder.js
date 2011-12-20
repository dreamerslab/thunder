/*!
 * thunder
 * Copyright(c) 2011 dreamerslab <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A lighting fast template parser for node.js.
 */

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



module.exports = {

  version : '0.0.1',

  compile : function ( input ){
    var str, arr, i, j, tmp, fn;

    str = '';
    // chage the new line to unix version
    arr = input.replace( /\r\n/, '\n' ).replace( /\r/, '\n' ).
      split( '<?' ).join( '?>\x1b' ).split( '?>' );

    i = 0;
    j = arr.length;

    // string concat is faster than array `push`
    for(; i < j; i++ ){
      tmp = arr[ i ];
      str += tmp.charAt( 0 ) != '\x1b' ?
        // `\t` (tab) is ok, we need to handle with `\n` (line feed)
        "out+='" + tmp.replace( /[\'\\]/g, '\\$&' ).replace( /\n/g, '\\n\\\n' ) + "'" :
          ( tmp.charAt( 1 ) == '=' ?
            ';out+=' + tmp.substr( 2 ) + ';' :
            ( tmp.charAt( 1 ) == '-' ?
              ';out+=e(' + tmp.substr( 2 ) + ");" :
              ';' + tmp.substr( 1 )));
    }

    // `replace` is faster than `split` -> `join`
    str = ( 'var out="";' + str + ';return out;' ).
      replace( /out\+\=\'\'\;/g, '' ).
      replace( /var out\=\"\"\;out\+\=/g, 'var out=' );

    try{
      // must save this new Function to fn,
      // don't just invoke it in the return function, it's slow
      // ex. return new Function( 'it', 'e', str )( locals, escape.fn ); <-- slow
      fn = new Function( 'it', 'e', str );

      return function ( locals ){
        return fn( locals, escape.fn );
      };
    }catch( err ){
      console.log( '[thunder] Having trouble with creating a template function: \n' + str );
      throw err;
    }
  }
};
