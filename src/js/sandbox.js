


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

  $(function() {
    $('p.test-class').prepend($('<h1></h1>').text(message));
  });

})(jQuery);
