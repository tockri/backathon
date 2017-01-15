'use strict';
(function(global) {
  var $colors = {
    bg: 0x162129,
    plane: 0x447F8B,
    mesh: 0xF2F2F2,
    softbody: 0x434B7F
  };

  var world = new WHS.World({
    stats: false, // "fps", // fps, ms, mb or false if not need.
    autoresize: "window",
    gravity: [0, -10, 0],
    camera: {
      position: [0, 20, 10]
    },
    rendering: {
      background: {
        color: 0x162129
      },
      renderer: {
        antialias: true
      }
    },
    shadowmap: {
      type: THREE.PCFSoftShadowMap
    },
    helpers: {
      grid: {
        size: 100,
        step: 100,
        color1: 0xff0000
      },

      axis: {
        size: 100
      }
    }
  });

  addBoxPlane(world, 250).then(function (o) {
    return o.position.y = -0.5;
  });
  addBasicLights(world, 0.5, [20, 20, 20], 400);
  global.world = world;
  global.$colors = $colors;

  world.setControls(new WHS.OrbitControls());
  world.start();
})(window);
