var index = "<h1 class='header1'><?- it.header1 ?></h1>\n\
<h2 class='header2'><?- it.header2 ?></h2>\n\
<h3 class='header3'><?- it.header3 ?></h3>\n\
<h4 class='header4'><?- it.header4 ?></h4>\n\
<h5 class='header5'><?- it.header5 ?></h5>\n\
<h6 class='header6'><?- it.header6 ?></h6>\n\
<ul class='list'>\n\
  <? for( var i = 0, l = it.list.length; i <l; i++ ){ ?>\n\
  <li class='item'><?- it.list[ i ] ?></li>\n\
  <? } ?>\n\
</ul>";
