var dot     = require( 'dot' ),
    ejs     = require( 'ejs' ),
    haml    = require( 'haml' ),
    hamljs  = require( 'hamljs' ),
    jade    = require( 'jade' ),
    jqtpl   = require( 'jqtpl' ),
    jst     = require( 'jst' ),
    swig    = require( 'swig' ),
    tenjin  = require( 'tenjin' ),
    thunder = require( '../lib/thunder' );



var shared_vars = {
  title : 'THUNDER ROCKS',
  header1 : 'Header1',
  header2 : 'Header2',
  header3 : 'Header3',
  header4 : 'Header4',
  header5 : 'Header5',
  header6 : 'Header6',
  list : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
},

shared_vars_escape = {
  title : '"THUNDER ROCKS"',
  header1 : '<Header1>',
  header2 : '<Header2>',
  header3 : '<Header3>',
  header4 : '<Header4>',
  header5 : '<Header5>',
  header6 : '<Header6>',
  list : [ '&1', '&2', '&3', '&4', '&5', '&6', '&7', '&8', '&9', '&10' ]
};



var fs = require( 'fs' );

var dot_tpl            = fs.readFileSync( './templates/dot.html', 'utf8' ),
    dot_tpl_escape     = fs.readFileSync( './templates/dot_escape.html', 'utf8' ),

    ejs_tpl            = fs.readFileSync( './templates/ejs.ejs', 'utf8' ),
    ejs_tpl_escape     = fs.readFileSync( './templates/ejs_escape.ejs', 'utf8' ),

    haml_tpl           = fs.readFileSync( './templates/haml.haml', 'utf8' ),
    haml_tpl_escape    = fs.readFileSync( './templates/haml_escape.haml', 'utf8' ),
    
    hamljs_tpl         = fs.readFileSync( './templates/hamljs.haml', 'utf8' ),
    hamljs_tpl_escape  = fs.readFileSync( './templates/hamljs_escape.haml', 'utf8' ),

    jade_tpl           = fs.readFileSync( './templates/jade.jade', 'utf8' ),
    jade_tpl_escape    = fs.readFileSync( './templates/jade_escape.jade', 'utf8' ),

    jqtpl_tpl          = fs.readFileSync( './templates/jqtpl.html', 'utf8' ),
    jqtpl_tpl_escape   = fs.readFileSync( './templates/jqtpl_escape.html', 'utf8' ),

    jst_tpl            = fs.readFileSync( './templates/jst.html', 'utf8' ),
    jst_tpl_escape     = fs.readFileSync( './templates/jst_escape.html', 'utf8' ),
    
    swig_tpl           = fs.readFileSync( './templates/swig.html', 'utf8' ),
    swig_tpl_escape    = fs.readFileSync( './templates/swig_escape.html', 'utf8' ),
    
    tenjin_tpl         = fs.readFileSync( './templates/tenjin.html', 'utf8' ),
    tenjin_tpl_escape  = fs.readFileSync( './templates/tenjin_escape.html', 'utf8' ),

    thunder_tpl        = fs.readFileSync( './templates/thunder.html', 'utf8' ),
    thunder_tpl_escape = fs.readFileSync( './templates/thunder_escape.html', 'utf8' );





var compiled = {};

var engines = [
  {
    name : 'doT',
    key : 'dot',
    tpl : dot_tpl,
    tpl_escape : dot_tpl_escape,
    compile : function (){
      return dot.template( this.tpl );
    },
    compile_escape : function (){
      return dot.template( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.dot( locals );
    },
    render_escape : function ( locals ){
      return compiled.dot_escape( locals );
    }
  },
  {
    name : 'EJS',
    key : 'ejs',
    tpl : ejs_tpl,
    tpl_escape : ejs_tpl_escape,
    compile : function (){
      return ejs.compile( this.tpl );
    },
    compile_escape : function (){
      return ejs.compile( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.ejs( locals );
    },
    render_escape : function ( locals ){
      return compiled.ejs_escape( locals );
    }
  },
  {
    name : 'haml-js',
    key : 'haml',
    tpl : haml_tpl,
    tpl_escape : haml_tpl_escape,
    compile : function (){
      var tmp = haml.compile( this.tpl );
      
      return haml.optimize( tmp );
    },
    compile_escape : function (){
      var tmp = haml.compile( this.tpl_escape );
      
      return haml.optimize( tmp );
    },
    render : function ( locals ){
      return haml.execute( compiled.haml, haml, locals );
    },
    render_escape : function ( locals ){
      return haml.execute( compiled.haml_escape, haml, locals );
    }
  },
  {
    name : 'Haml.js',
    key : 'hamljs',
    tpl : hamljs_tpl,
    tpl_escape : hamljs_tpl_escape,
    compile : function (){
      return hamljs.compile( this.tpl );
    },
    compile_escape : function (){
      return hamljs.compile( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.hamljs( locals );
    },
    render_escape : function ( locals ){
      return compiled.hamljs_escape( locals );
    }
  },
  {
    name : 'Jade',
    key : 'jade',
    tpl : jade_tpl,
    tpl_escape : jade_tpl_escape,
    compile : function (){
      return jade.compile( this.tpl );
    },
    compile_escape : function (){
      return jade.compile( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.jade( locals );
    },
    render_escape : function ( locals ){
      return compiled.jade_escape( locals );
    }
  },
  {
    name : 'jqtpl',
    key : 'jqtpl',
    tpl : jqtpl_tpl,
    tpl_escape : jqtpl_tpl_escape,
    compile : function (){
      // cache
      // return jqtpl.template( 'tmp', this.tpl );
      
      // no cache
      return jqtpl.template( null, this.tpl );
    },
    compile_escape : function (){
      // cache
      // return jqtpl.template( 'tmp_escape', this.tpl_escape );
      
      // no cache
      return jqtpl.template( null, this.tpl_escape );
    },
    render : function ( locals ){
      // cache
      // return jqtpl.tmpl( 'tmp', locals );
      
      // no cache
      return jqtpl.tmpl( compiled.jqtpl, locals );
    },
    render_escape : function ( locals ){
      // cache
      // return jqtpl.tmpl( 'tmp_escape', locals );
      
      // no cache
      return jqtpl.tmpl( compiled.jqtpl_escape, locals );
    }
  },
  {
    name : 'jst',
    key : 'jst',
    tpl : jst_tpl,
    tpl_escape : jst_tpl_escape,
    compile : function (){
      return jst.compile( this.tpl );
    },
    compile_escape : function (){
      return jst.compile( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.jst( locals );
    },
    render_escape : function ( locals ){
      return compiled.jst_escape( locals );
    }
  },
  {
    name : 'Swig',
    key : 'swig',
    tpl : swig_tpl,
    tpl_escape : swig_tpl_escape,
    compile : function (){
      return swig.compile( this.tpl );
    },
    compile_escape : function (){
      return swig.compile( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.swig( locals );
    },
    render_escape : function ( locals ){
      return compiled.swig_escape( locals );
    }
  },
  {
    name : 'nTenjin',
    key : 'tenjin',
    tpl : tenjin_tpl,
    tpl_escape : tenjin_tpl_escape,
    compile : function (){
      return tenjin.compile( this.tpl );
    },
    compile_escape : function (){
      return tenjin.compile( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.tenjin( locals );
    },
    render_escape : function ( locals ){
      return compiled.tenjin_escape( locals );
    }
  },
  {
    name : 'thunder',
    key :'thunder',
    tpl : thunder_tpl,
    tpl_escape : thunder_tpl_escape,
    compile : function (){
      return thunder.cached( this.tpl );
    },
    compile_escape : function (){
      return thunder.cached( this.tpl_escape );
    },
    render : function ( locals ){
      return compiled.thunder( locals );
    },
    render_escape : function ( locals ){
      return compiled.thunder_escape( locals );
    }
  }
];



var compile_speed = function ( engines, method, count, title ){
  var i, j, k, key, engine, start, seconds;
  
  i = 0;
  j = engines.length;

  for(; i < j; i++ ){
    engine = engines[ i ];
    key    = engine.key;
    start  = new Date();
    k      = 0;
    
    console.log('\n' + title + ', compile ' + count + ' times:\n');
    console.log( engine.name, 'running...' );

    for(; k < count; k++ ){
      compiled[ key + method ] = engine[ 'compile' + method ]();
    }

    seconds = ( new Date() - start ) / 1000;

    // console.log( compiled[ engine.key ] );
    console.log( 'use: ' + seconds + ' sec, rps: ' + ( count / seconds ));
    console.log( '--------------------------------------------' );
  }
};



var render_speed = function ( engines, method, shared_vars, count, title ){
  var i, j, k, engine, start, seconds, view;

    i = 0;
    j = engines.length;

    for(; i < j; i++ ){
      engine = engines[ i ];
      start  = new Date();
      k      = 0;

      console.log('\n' + title + ', render ' + count + ' times:\n');
      console.log( engine.name, 'running...' );

      for(; k < count; k++ ){
        view = engine[ 'render' + method ]( shared_vars );
      }

      seconds = ( new Date() - start ) / 1000;

      // console.log( view );
      console.log( 'use: ' + seconds + ' sec, rps: ' + ( count / seconds ));
      console.log( '--------------------------------------------' );
    }
};



jst.configure({ useIt : true });
swig.init({
    allowErrors: false,
    autoescape: false
});



compile_speed( engines, '', 1000, 'No escape' );
compile_speed( engines, '_escape', 1000, 'Escape' );
render_speed( engines, '', shared_vars, 100000, 'No escape' );
render_speed( engines, '_escape', shared_vars_escape, 100000, 'Escape' );
