


var testFunc = (function() {
  alert('testFuncのメッセージ');
});


function test() {
  testFunc();
}

(function($) {
  var message = '<b>my message</b>';
  /*
  $(....)
  .... = functionの場合
    load終わったら実行

  .... = htmlとして認識できる文字列の場合
    htmlとして解釈して要素を作る

  .... = それ以外の文字列の場合
    セレクタとして解釈して要素を見つける


*/
var items = [
  [ 'Apple', 'Orange','Melon'],
  [ 'AA' , 'AB' , 'AC' ],
  [ 'BA' , 'BB' , 'BC' ]
];

$(function() {
    var ul = $('<ul></ul>');
    for (var i = 0; )
    for (var i = 0; i < items.length; i++) {
      var li = $('<li></li>').text(items[i][j]);
      ul.append(li);
    }
    $('#sandbox').append(ul);
  });
})(jQuery);

$(function()
