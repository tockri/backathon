
'use strict';
(function() {

var $world = {
  stats: "fps", // fps, ms, mb or false if not need.
  autoresize: "window",

  gravity: [0, -100, 0],

  camera: {
    position: [0, 20, 30] // x,y,z
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
    position: [62, 40, 30]  //  camera位置
  }
}));

addBoxPlane(world, 250).then(function (o) {
  return o.position.y = -0.5;
});
addBasicLights(world);

new WHS.HemisphereLight({
  light: {
    skyColor: 0xffffff,
    groundColor: 0x0000ff,
    intensity: 0.8
  }
}).addTo(world);

const clock = new WHS.Model({
  geometry: {
    path: './cloockoutframe.json',
//    physics: '{{ assets }}/models/teapot/utah-teapot-light.json'
  },

  mass: 0.1,

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
    y: 2
  },

  scale: [4, 4, 4]
}).addTo(world);



const teapot = new WHS.Model({
  geometry: {
    path: './cloockinnerframe.json',
    // path: './cloock.json',
  //  physics: '{{ assets }}/models/teapot/utah-teapot-light.json'
  },

  mass: 0,

  physics: {
    type: 'concave',
    friction: 0.0001,
    restitution: 0.5
  },

  material: {
    shading: THREE.SmoothShading,
    map: WHS.texture('./texture.jpg'),
    side: THREE.DoubleSide,
    useCustomMaterial: true
  },

  position: {
    y: 0.7
  },

  scale: [4, 4, 4]
}).addTo(world);







world.setControls(new WHS.OrbitControls());
world.start();

})();
