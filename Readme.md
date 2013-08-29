# thunder

A lightning fast JavaScript template engine.



## Description

**thunder** is one of the fastest JavaScript template engine for Node.js and browsers. Checkout the benchmarks for its performance. The usage is quite simple, `evaluation`, `interpolation`, and `interpolation with html escaping`. All variables and functions must start with `it` for performance sake. **thunder** works well with `Express`, check out the examples folder for the setup.



## Syntax

### Evaluation

Evaluate JavaScript expression

> `<? ?>`

    <? if( it.user ){ ?>
      <p>User exist</p>
    <? } ?>

### Interpolation

Simple output ( no escape )

> `<?= ?>`

    // script = '<script>alert( 'this is harmful' );</script>';
    <?= it.script ?>
    // prints out <script>alert( 'this is harmful' );</script>

### Interpolation with html escaping

Simple output ( escape ) | `& < > "` --> `&amp; &lt; &gt; &quot;`

> `<?- ?>`

    // script = '<script>alert( 'this is gonna be fine' );</script>';
    <?- it.script ?>
    // prints out &lt;script&gt;alert( 'this is gonna be fine' );&lt;script/&gt;



## Installation

### With node.js

> via npm:

    // in the project root
    $ npm install thunder

### On browsers

> Install `thunder` in global to use the command line tools. You will need them to compile the HTML templates to JavaScript strings. By default `thunder` looks for all the `.html` files in the dir `templates` in the same dir where the command is called, compile them to JavaScript strings and save them to `views` dir. You can specify the `input` and `output` dir to wherever you want by passing the `-i` and `-o` arguments. Also the default compiled strings are `requirejs` modules. By passing `-r=false` it will use the file name as the template name and attach it to `window` object.

    // make sure you have `node.js` installed
    $ npm intall thunder -g

    $ thunder

    Usage: thunder [command] [argument(s)]

    Commands:
      -v, --version    Display thunder version
      h,  help         Display usage information
      b,  build [args] Precompile templates
      w,  watch [args] Watch for changes

    Arguments for `build` & `watch commands`
      -i, --input=/new/input/dir   Default: ./templates
      -o, --output=/new/output/dir Default: ./views
      -r, --requirejs=false        Default: true

> Copy `thunder.min.js` to your public JavaScript dir.



## Usage

For advance usages please checkout the API block.

### With node.js

     var thunder = require( 'thunder' );
     var input   = '<div>Hello, this is <?= it.name ?> :)</div>',
     var locals  = { name : 'Bibi' };
     var options = {
       cached   : true,
       compress : true
     };

     var output = thunder.render( input, locals, options );

     console.log( output );
     // <div>Hello, this is Bibi :)</div>



### Express 2.x

    app.configure( function(){
      ...
      app.set( 'view engine', 'html' );
      app.register( '.html', require( 'thunder' ));
      // optional
      app.set( 'view options', {
        compress : true
      });
      ...
    });

> To use express `partial`, `helper` and `dynamic helper` just call the method but start with `it`.

    // partial
    <?= it.partial( 'common/_nav' ) ?>

    // helper
    <a class="<?= it.selected( 'somewhere', it.nav_selected )?>" href="/somewhere">Somewhere</a>



### On browsers

- Normal useage

<!---->

    // Include necessary JS files
    <script src="/js/lib/thunder.min.js"></script>
    <script src="/js/views/index.js"></script>
    <script>
      var input   = index,
      var locals  = { name : 'Bibi' };
      var options = { cached : true };
      var output  = thunder.render( input, locals, options );

      console.log( output );
      // <div>Hello, this is Bibi :)</div>
    </script>

- With `requirejs`


<!---->

    <script src="/js/lib/require.js" data-main="/js/main.js"></script>
    <script>
      requirejs.config({
        baseUrl : '/js/lib',
        paths   : { views : '../views' }
      });
    </script>
    <script>
      define( function ( require, exports, module ){
        var thunder = require( 'thunder' );
        var input   = require( 'views/index' );
        var locals  = { name : 'Bibi' };
        var options = { cached : true };
        var output  = thunder.render( input, locals, options );

        console.log( output );
        // <div>Hello, this is Bibi :)</div>
      });
    </script>



## API

#### Arguments

> input

    type: String
    desc: Input string to be compiled

### thunder.compiled_text( input, options );

Returns the text ready to be compiled for the `compile` function.

#### Arguments

> input

    type: String
    desc: Input string to be compiled

> options:

    type: Object
    props:
      compress:
        type: Boolean
        default: false
        desc: Whether to compress the output HTML

#### Example code

    var input         = '<div>Hello, this is <?= it.name ?> :)</div>';
    var compiled_text = thunder.compiled_text( input );

    console.log( compiled_text );
    // var __t__='<div>Hello, this is ';__t__+= it.name ;__t__+=' :)</div>';return __t__;

### thunder.compile( input, options );

Returns the compiled function.

#### Arguments

> input

    type: String
    desc: Input string to be compiled

> options

    type: Object
    props:
      compress:
        type: Boolean
        default: false
        desc: Whether to compress the output HTML

#### Example code

    var input  = '<div>Hello, this is <?= it.name ?> :)</div>';
    var render = thunder.compile( input );

    // it actually turns to the following function
    // function ( locals ){
    //   var __t__='<div>Hello, this is ';__t__+= locals.name ;__t__+=' :)</div>';return __t__;
    // };

### thunder.cached( input, options );

Returns the cached compiled function.

#### Arguments

> input

    type: String
    desc: Input string to be compiled

> options

    type: Object
    props:
      compress:
        type: Boolean
        default: false
        desc: Whether to compress the output HTML

#### Example code

    var input  = '<div>Hello, this is <?= it.name ?> :)</div>';
    var render = thunder.cached( input );

    // it actually turns to the following function and will be cached
    // so that next time the text does not need to be compiled again
    // function ( locals ){
    //   var __t__='<div>Hello, this is ';__t__+= locals.name ;__t__+=' :)</div>';return __t__;
    // };

### thunder.render( input, locals, options );

Returns the output.

#### Arguments

> input

    type: String
    desc: Input string to be compiled

> locals

    type: Object
    desc: Variables to be passed to the compiled function

> options

    type: Object
    props:
      compress:
        type: Boolean
        default: false
        desc: Whether to compress the output HTML
      cached:
        type: Boolean
        default: false
        desc: Whether to cache the compiled function

#### Example code

    var input  = '<div>Hello, this is <?= it.name ?> :)</div>',
    var locals = { name : 'Bibi' };

    var options = {
      cached   : true,
      compress : true
    };

    var output = thunder.render( input, locals, options );

    console.log( output );
    // <div>Hello, this is Bibi :)</div>



## Examples

> Checkout the `examples` folder for more details.

### simple

    $ cd /path/to/thunder/examples/simple
    $ node run.js

### complex

    $ cd /path/to/thunder/examples/complex
    $ node run.js

### express

    $ cd /path/to/thunder/examples/express
    $ npm install -lf
    $ node app.js



## Benchmarks

The followings are some well-known template parsers that I took for Benchmarks. You are welcome to fork it and add more. There are 2 main parts, the compiling speed and the rendering speed. The compiled templates are cached in `jqtpl`, `Swig` and **thunder**. Therefore their benchmarks for compiling is much faster. You can change the compile method from `cached` to `compile` to see the none-cached speed for **thunder**.

> To run the benchmarks just type the following commands in the terminal

    $ git clone git://github.com/dreamerslab/thunder.git
    $ cd thunder/benchmarks/
    $ npm install -lf
    $ node run.js

- [doT](https://github.com/olado/doT)
- [EJS](https://github.com/visionmedia/ejs)
- [haml-js](https://github.com/creationix/haml-js)
- [Haml.js](https://github.com/visionmedia/haml.js)
- [Jade](https://github.com/visionmedia/jade)
- [jqtpl](https://github.com/kof/node-jqtpl)
- [jst](https://github.com/shaunlee/node-jst)
- [nTenjin](https://github.com/QLeelulu/nTenjin)
- [Swig](https://github.com/paularmstrong/swig)
- [thunder](https://github.com/dreamerslab/thunder)



## License

(The MIT License)

Copyright (c) 2011 dreamerslab &lt;ben@dreamerslab.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
