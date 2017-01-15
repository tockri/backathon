
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
  };
  const pinMaterial = {
    kind: 'basic',
    color: 'black'
  };

  /**
   * 歯車を作る
   * @param m モジュール
   * @param num 歯数
   * @param options 追加オプション(position等)
   */
  function Gear(m, z, options) {
    var d = z * m; // 基準円直径
    var a = Math.PI * 2 / z; // 歯ごとの角度
    var cr = d - m * 2.7; // Cylinderの半径
    // 歯の形
    var t1 = {
      x: cr * Math.cos(a / 3) * 0.9,
      y: cr * Math.sin(a / 3) * 0.9
    };
    var t2 = {
      x: d * Math.cos(a / 6),
      y: d * Math.sin(a / 6)
    };
    var t3 = {
      x: (d + 1.5*m) * Math.cos(a / 30),
      y: (d + 1.5*m) * Math.sin(a / 30)
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
            amount: 0.9
          }
        },
        mass:0.01,
        position: [0, -0.45, 0],
        rotation: [-Math.PI / 2, 0, a * i - Math.PI / 2],
        material: material,
      });
    }

    function cylinder() {
      return new WHS.Cylinder(_extends({}, {
        geometry: {
          radiusTop: cr,
          radiusBottom: cr,
          height: 1
        },
        mass: 1,
        material: material,
        position: [0, 0.1, 0]
      }, options));
    }

    var c = cylinder();
    for (var i = 0; i < z; i++) {
      c.add(teeth(i));
    }
    // c.rotation.set(Math.PI / 2, 0, 0);
    this.shape = c;
    this.d = d;
    this.m = m;
    this.z = z;
  }

  function pointR(radius, radian) {
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian)
    };
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
      var base = makeBox(40, 1, 40, {
        position: [0, 0, 0]
      });
      this.add(base);

      var g1 = new Gear(0.2, 10);
      g1.shape.position.set(0, 1, 0);
      var secPin = makeBox(10, 0.1, 0.1, {
        position:[5, 10, 0],
        material: pinMaterial
      });
      g1.shape.add(secPin);
      this.addGear(base, g1);


      var g2 = new Gear(0.2, 30);
      g2.shape.position.set(g1.d + g2.d, 1, 0);
      g2.shape.rotation.set(0, Math.PI / g2.z, 0);
      var pg2 = g2.shape.position;
      var g3 = new Gear(0.2, 10);
      g3.shape.position.y = 1.5;
      g2.shape.add(g3.shape);
      this.addGear(base, g2);


      var g4 = new Gear(0.2, 30);
      g4.shape.position.set(0, 2.5, 0);
      var g5 = new Gear(0.2, 10);
      g5.shape.position.y = 1.5;
      g4.shape.add(g5.shape);
      var minPin = makeBox(8, 0.15, 0.15, {
        position: [4, 10, 0],
        material: pinMaterial
      });
      g4.shape.add(minPin);
      this.addGear(base, g4);
      //g4.shape.rotation.set(0, 0.2, 0);
      //g4.shape.position.y = 20;


      var g6 = new Gear(0.2, 30);
      var pg6 = pointR(g1.d + g2.d, Math.PI / 3);
      g6.shape.position.set(pg6.x, 4, pg6.y);
      var g7 = new Gear(0.2, 10);
      g7.shape.position.y = 1.5;
      g6.shape.add(g7.shape);
      this.addGear(base, g6);
      //g6.shape.rotation.set(0, 0.2, 0);
      //g6.shape.position.y = 40;

      var g8 = new Gear(0.2, 30);
      g8.shape.position.set(0, 5.5, 0);
      var hourPin = makeBox(6, 0.3, 0.3, {
        position: [3, 10, 0],
        material: pinMaterial
      });
      g8.shape.add(hourPin);
      this.addGear(base, g8);





      var l = new WHS.Loop(function(clock) {

        g2.shape.rotation.y += 0.0005;
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
    },
    addGear: function(base, gear) {
      App.add(gear.shape);
      var gp = gear.shape.position;
      var c1 = new WHS.HingeConstraint(base, gear.shape,
        new THREE.Vector3(gp.x, gp.y, gp.z),
        new THREE.Vector3(0, 1, 0)
      );
      App.addConstraint(c1);
      // c1.setLinearLowerLimit(new THREE.Vector3(0, 0, 0));
      // c1.setLinearUpperLimit(new THREE.Vector3(0, 0, 0));
      // c1.setAngularLowerLimit(new THREE.Vector3(0, -Infinity, 0));
      // c1.setAngularUpperLimit(new THREE.Vector3(0, Infinity, 0));
    }
  };

  $(function() {
    App.initialize();
    App.start();
  });
})(window, jQuery);
