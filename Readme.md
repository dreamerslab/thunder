# thunder

  A lighting fast template parser for node.js



## Description

  **thunder** is one of the fastest template parsers for `node.js`. Checkout the benchmarks for its performance. The usage is quite simple, `evaluation`, `interpolation`, and `interpolation with html escaping`. All variables and functions must start with `it` for performance sake. **thunder** works well with `Express`, check out the examples folder for the setup.



## Installation

via npm:

    $ npm install thunder



## Syntax

### Evaluation

Evaluate javascript expression

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



## Usage

> Require the module before using

    var thunder = require( 'thunder' );

### thunder.compiled_text( input, options );

returns the text ready to be compiled for the `compile` function

#### Arguments

  - input: string
  - options:
    - compress: bool, default to false

#### Example code

    var input         = '<div>Hello, this is <?= it.name ?> :)</div>',
        compiled_text = thunder.compiled_text( input );

    console.log( compiled_text );
    // var __t__='<div>Hello, this is ';__t__+= it.name ;__t__+=' :)</div>';return __t__;

### thunder.compile( input, options );

returns the compiled function

#### Arguments

  - input: string
  - options:
    - compress: bool, default to false

#### Example code

    var input  = '<div>Hello, this is <?= it.name ?> :)</div>',
        render = thunder.compile( input );

    // it actually turns to the following function
    // function ( locals ){
    //   var __t__='<div>Hello, this is ';__t__+= locals.name ;__t__+=' :)</div>';return __t__;
    // };

### thunder.cached( input, options );

returns the cached compiled function

#### Arguments

  - input: string
  - options:
    - compress: bool, default to false

#### Example code

    var input  = '<div>Hello, this is <?= it.name ?> :)</div>',
        render = thunder.cached( input );

    // it actually turns to the following function and will be cached
    // so that next time the text does not need to be compiled again
    // function ( locals ){
    //   var __t__='<div>Hello, this is ';__t__+= locals.name ;__t__+=' :)</div>';return __t__;
    // };

### thunder.render( input, locals, options );

returns the output

#### Arguments

  - input: string
  - locals: obj
  - options:
    - compress: bool, default to false
    - cached: bool, default to false

#### Example code

    var input   = '<div>Hello, this is <?= it.name ?> :)</div>',
        locals  = { name : 'Bibi' },
        options = {
          cached : true,
          compress : true
        },
        output  = thunder.render( input, locals, options );

    console.log( output );
    // <div>Hello, this is Bibi :)</div>



## Express

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
    <a class="<?=it.selected( 'somewhere', it.nav_selected )?>" href="">Somewhere</a>


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
