/*!
 * thunder
 * Copyright(c) 2011 dreamerslab <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A smoking fast template parser for node.js.
 */

// Split HTML escaping into another obj speeds up the `no escape` parsing
var filter = {

  rules : {
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;',
    '"' : '&quot;'
  },

  fn : function ( match ){
    return filter.rules[ match ];
  },

  escape : function ( input ){
    return typeof( input ) != 'string' ?
      input : input.replace( /[&<>"]/g, filter.fn );
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

    // String concat is faster than array `push`
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
      fn = new Function( 'it', 'e', str );

      return function ( locals ){
        return fn( locals, filter.escape );
      };
    }catch( err ){
      console.log( '[thunder] Having trouble with creating a template function: \n' + str );
      throw err;
    }
  }
};
