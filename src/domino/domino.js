
'use strict';
(function() {

var $world = {
  stats: "fps", // fps, ms, mb or false if not need.
  autoresize: "window",

  gravity: [0, -100, 0],

  camera: {
    position: [0, 10, 50]
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
  }
};

var $colors = {
  bg: 0x162129,
  plane: 0x447F8B,
  mesh: 0xF2F2F2,
  softbody: 0x434B7F
};


var world = new WHS.World(_extends({}, $world, {

  camera: {
    far: 10000,
    position: [62, 30, 130]
  }
}));

new WHS.Sphere({
  geometry: [4, 32, 32],

  mass: 5,

  material: {
    color: $colors.mesh,
    kind: 'phong',
    rest: 0
  },

  position: [0, 100, 0]
}).addTo(world);

var tramplin = new WHS.Box({
  geometry: {
    height: 2,
    width: 20,
    depth: 4
  },

  mass: 0,

  material: {
    color: $colors.mesh,
    kind: 'phong',
    rest: 0
  },

  position: {
    x: 0,
    y: 4,
    z: 0
  },

  rotation: {
    z: -Math.PI / 6
  }
});

tramplin.addTo(world);

var tramplin2 = tramplin.clone();
tramplin2.position.y = 44;
tramplin2.addTo(world);

var tramplin3 = tramplin.clone();
tramplin3.position.set(24, 24, 0);
tramplin3.rotation.z = Math.PI / 6;
tramplin3.addTo(world);

var domino = new WHS.Box({
  geometry: {
    height: 8,
    width: 1,
    depth: 4
  },

  mass: 5,

  material: {
    color: $colors.mesh,
    kind: 'phong',
    rest: 0.5,
    fri: 1
  },

  position: {
    x: 20,
    y: 4,
    z: 0
  }
});

var d = domino.clone();
for (var i = 0; i < 13; i++) {
  d = d.clone();
  d.position.x += 8;
  d.addTo(world);
}

addBoxPlane(world, 250).then(function (o) {
  return o.position.y = -0.5;
});
addBasicLights(world);

world.setControls(new WHS.OrbitControls());
world.start();

})();
