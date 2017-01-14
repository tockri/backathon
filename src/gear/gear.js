
'use strict';
(function(global, $) {
  var world = global.world;
  var $colors = global.$colors;

  function makeBox(width, height, depth, options) {
    var box = new WHS.Box(_extends({}, {
      geometry: [width, height, depth],
      mass: 0,
      material: {
        color: $colors.mesh,
        kind: 'phong',
        rest: 1
      },
    }, options));
    return box;
  }

  function makeGear(number, radius) {

  }

  var App = {
    elements: [],
    constraints: [],
    // 画面初期化
    initialize: function() {
      var button = $('<button type="button">Start</button>');
      button.css({
        position: 'absolute',
        right: 0,
        bottom: 0
      });
      button.click(function() {
        App.restart();
      });
      $('body').append(button);
    },
    // 開始
    start: function() {
      var box = makeBox(40, 10, 1, {
        position: [10, 10, -1]
      });
      this.add(box);
      var box2 = makeBox(8, 8, 1, {
        position: [0, 10, 0],
        rotation: [0, 0, Math.PI / 4],
        mass: 0.01
      });
      this.add(box2);
      var cons = new WHS.DOFConstraint(box, box2,
        new THREE.Vector3(0, 10, 0)
      );
      this.addConstraint(cons);

      var box3 = makeBox(8, 8, 1, {
        position: [11, 10, 0],
        mass: 0.01
      });
      this.add(box3);
      var cons3 = new WHS.DOFConstraint(box, box3,
        new THREE.Vector3(11, 10, 0)
      );
      this.addConstraint(cons3);
      // cons.enableAngularMotor(10, 0);

      var ball = makeBox(1, 1, 1, {
        position: [14, 20, 0],
        mass: 0.001
      });
      this.add(ball);
    },
    // 再開
    restart: function() {
      App.clearAll();
      App.start();
    },
    // startで追加したものを削除する
    clearAll: function() {
      for (var i = 0; i < App.elements.length; i++) {
        world.remove(App.elements[i]);
      }
      App.elements = [];
      for (var i = 0; i < App.constraints.length; i++) {
        world.$scene.removeConstraint(App.constraints[i]);
      }
      App.constraints = [];

    },
    add: function(e) {
      world.add(e);
      App.elements.push(e);
    },
    addConstraint: function(c) {
      world.addConstraint(c);
      App.constraints.push(c);
    }
  };

  $(function() {
    App.initialize();
    App.start();
  });
})(window, jQuery);
