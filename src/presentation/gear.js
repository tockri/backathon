
'use strict';
(function(global, $) {
  var world = global.world;
  var $colors = global.$colors;

  function makeSphere(radius, options) {
    var sp = new WHS.Sphere(_extends({}, {
      geometry: {
        radius: radius,
        widthSegments: 32,
        heightSegments: 32
      },
      mass: 0.1, // Mass of physics object.
      material: {
        color: $colors.mesh,
        kind: 'phong'
      }
    }, options));
    return sp;
  }

  function makeBox(width, height, depth, options) {
    var box = new WHS.Box(_extends({}, {
      geometry: [width, height, depth],
      mass: 0,
      material: {
        color: $colors.mesh,
        kind: 'phong'
      },
    }, options));
    return box;
  }
  const material = {
    kind: 'phong',
    color: $colors.mesh
  }

  /**
   * 歯車を作る
   * @param m モジュール
   * @param num 歯数
   * @param options 追加オプション(position等)
   */
  function Gear(m, z, options) {
    var d = z * m; // 基準円直径
    var a = Math.PI * 2 / z; // 歯ごとの角度
    var cr = d - m * 2.5; // Cylinderの半径
    // 歯の形
    var t1 = {
      x: cr * Math.cos(a / 3) * 0.9,
      y: cr * Math.sin(a / 3) * 0.9
    };
    var t2 = {
      x: d * Math.cos(a / 5),
      y: d * Math.sin(a / 5)
    };
    var t3 = {
      x: (d + 2*m) * Math.cos(a / 30),
      y: (d + 2*m) * Math.sin(a / 30)
    };

    function teeth(i) {
      var v2 = THREE.Vector2;
      var shape = new THREE.Shape([
        new v2(t1.x, t1.y), new v2(t2.x, t2.y), new v2(t3.x, t3.y),
        new v2(t3.x, -t3.y), new v2(t2.x, -t2.y), new v2(t1.x, -t1.y)
      ]);
      return new WHS.Extrude({
        geometry: {
          shapes: shape,
          options: {
            bevelEnabled: false,
            bevelSize: 0,
            amount: 1.8
          }
        },
        mass:0.01,
        position: [0, 0.9, 0],
        rotation: [Math.PI / 2, 0, a * i - Math.PI / 2],
        material: material,
      });
    }
    var c = new WHS.Cylinder(_extends({}, {
      geometry: {
        radiusTop: cr,
        radiusBottom: cr,
        height: 2
      },
      mass: 0.01,
      material: material
    }, options));
    for (var i = 0; i < z; i++) {
      c.add(teeth(i));
    }
    this.shape = c;
    this.d = d;
    this.m = m;
    this.z = z;
  }

  var App = {
    elements: [],
    constraints: [],
    // 画面初期化
    initialize: function() {
      var s2button = $('<button type="button">Scene2</button>')
      .css({
        position: 'absolute',
        right: 0,
        bottom: 0
      })
      .click(function() {
        App.scene2();
      });
      $('body').append(s2button);
      var s3button = $('<button type="button">Scene3</button>')
      .css({
        position: 'absolute',
        right: 0,
        bottom: 40
      })
      .click(function() {
        App.scene3();
      });
      $('body').append(s3button);
      $('body').append($('<button type="button">Next</button>')
      .css({
        position: 'absolute',
        right: 0,
        bottom: 60
      })
      .click(function() {
        location.href = '../clock/';
      }));
    },
    // 開始
    start: function() {
      var base = makeBox(40, 1, 40, {
        position: [0, 0, 0]
      });
      this.add(base);
      var g1 = new Gear(0.2, 10);
      g1.shape.position.set(0, 1.5, 0);
      this.add(g1.shape);
      var c1 = new WHS.HingeConstraint(base, g1.shape,
        g1.shape.position,
        new THREE.Vector3(0, 1, 0)
      );
      this.addConstraint(c1);
      this.base = base;
      this.g1 = g1;

    },
    scene2: function() {
      var base = this.base;
      var g1 = this.g1;
      var g2 = new Gear(0.2, 15);
      g2.shape.position.set(g1.d + g2.d, 1.5, 0);
      g2.shape.rotation.set(0, Math.PI / g2.m, 0);
      this.add(g2.shape);
      var c2 = new WHS.HingeConstraint(base, g2.shape,
        g2.shape.position,
        new THREE.Vector3(0, 1, 0)
      );
      //c2.enableAngularMotor(-1, 10);
      this.addConstraint(c2);
      this.g2 = g2;
    },
    scene3: function() {
      var g1 = this.g1;
      var g2 = this.g2;
      var base = this.base;
      var g3 = new Gear(0.2, 50);
      g3.shape.position.set(g1.d + g2.d, 1.5, g2.d + g3.d);
      g3.shape.rotation.set(0, Math.PI / g3.m, 0);
      this.add(g3.shape);
      var c3 = new WHS.HingeConstraint(base, g3.shape,
        g3.shape.position,
        new THREE.Vector3(0, 1, 0)
      );
      //c3.enableAngularMotor(-1, 10);
      this.addConstraint(c3);
      var l = new WHS.Loop(function() {
        g3.shape.rotation.y += 0.001;
      });
      l.start(world);
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
      var ret = world.add(e);
      App.elements.push(e);
      return ret;
    },
    addConstraint: function(c) {
      var ret = world.addConstraint(c);
      App.constraints.push(c);
      return ret;
    }
  };

  $(function() {
    App.initialize();
    App.start();
  });
})(window, jQuery);
