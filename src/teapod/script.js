
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


const teapot = new WHS.Model({
  geometry: {
    path: './utah-teapot-large.json',
    physics: './utah-teapot-light.json'
  },

  mass: 0,

  physics: {
    type: 'concave',
    friction: 1,
    restitution: 0.5
  },

  material: {
    kind: 'phong',
    shading: THREE.SmoothShading,
    map: WHS.texture('./texture.jpg'),
    side: THREE.DoubleSide,
    useCustomMaterial: true
  },

  position: {
    y: 50
  },

  scale: [4, 4, 4]
});


const ball = new WHS.Sphere({
  geometry: {
    radius: 3,
    widthSegments: 16,
    heightSegments: 16
  },

  mass: 60,

  material: {
    kind: 'phong',
    // color: UTILS.$colors.mesh
  },

  physics: {
    restitution: 1
  },

  position: [10, 250, -1.969]
});

teapot.addTo(world).then(() => {
  ball.addTo(world);
});

//UTILS.addBoxPlane(world, 500);

new WHS.SpotLight({
  light: {
    color: 0xffffff, // 0x00ff00,
    intensity: 1,
    distance: 300,
    angle: 180
  },

  shadowmap: {
    fov: 90
  },

  position: {
    x: 0,
    y: 150,
    z: 50
  }
}).addTo(world);



world.setControls(new WHS.OrbitControls());
world.start();

})();
