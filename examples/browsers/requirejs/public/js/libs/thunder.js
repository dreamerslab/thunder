/*
 * thunder
 * Copyright(c) 2012 dreamerslab <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A lightning fast JavaScript template engine.
 */
;(function(a){var b={};var c={rules:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"},fn:function(e){return typeof(e)!="string"?e:e.replace(/[&<>"]/g,function(f){return c.rules[f];});}};var d={version:"0.1.7",compiled_text:function(f,h){var e=(h&&h.compress===true?f.replace(/\n\r\t|\s+/g," "):f.replace(/\n\r|\r/g,"\n")).split("<?").join("?>\x1b").split("?>");var m="";var l=0;var g=e.length;var k="";for(;l<g;l++){k=e[l];m+=k.charAt(0)!="\x1b"?"__t__+='"+k.replace(/\'|\\/g,"\\$&").replace(/\n/g,"\\n\\\n")+"'":(k.charAt(1)=="="?";__t__+="+k.substr(2)+";":(k.charAt(1)=="-"?";__t__+=e("+k.substr(2)+");":";"+k.substr(1)));}return('var __t__="";'+m+";return __t__;").replace(/__t__\+\=\'\'\;/g,"").replace(/var __t__\=\"\"\;__t__\+\=/g,"var __t__=");},compile:function(e,f){var i=this.compiled_text(e,f);var g;try{g=new Function("it","e",i);}catch(h){console.log("[thunder] Having trouble with creating a template function: \n"+i);throw h;}return function(j){return g(j,c.fn);};},cached:function(e,f,g){g=g||e;if(!b[g]){b[g]=this.compile(e,f);}return b[g];},render:function(e,g,f){var h=f&&f.cached===true?"cached":"compile";return this[h](e,f)(g);},clear:function(){b={};}};if(typeof define!=="undefined"){return define(function(f,e,g){g.exports=d;});}if(typeof exports==="undefined"){a.thunder=d;return;}module.exports=d;})(this);
