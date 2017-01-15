
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
/*
new WHS.Sphere({
  geometry: [4, 20, 20],  //  半径,*,*

  mass: 5,  //  重さ？

  material: {
    color: $colors.mesh,
    kind: 'phong',
    rest: 0
  },

  position: [0, 30, 0]
}).addTo(world);
*/

/*
var points1 = [];
for (let i = 0; i <= 400; i++) {
  points1.push(
    new THREE.Vector2(
      (Math.sin(i/400*2*Math.PI)*10),
      (Math.cos(i/400*2*Math.PI)*10)
    )
  );
}

for( let i=0; i<100 ; i++){
  points1.push(
    new THREE.Vector2(
      (Math.sin(i/100*2*Math.PI)*4),
      (Math.cos(i/100*2*Math.PI)*4)
  )
);
}

const shape = new THREE.Shape(points1);
const extrude = new WHS.Extrude({
  geometry: {
    shapes: shape,
    options: {
      bevelEnabled: false,
      bevelSize: 0,
      amount: 5
    }
  },

  mass: 10,

  material: {
    kind: 'basic',
    color: 0xffffff
  },

  position: [0, 20, 5]
});

extrude.addTo(world);


*/

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

  mass: 200,

  physics: {
    type: 'concave',
    friction: 1,
    restitution: 0.5
  },

  material: {
    kind: 'phong',
    shading: THREE.SmoothShading,
//    map: WHS.texture('{{ assets }}/textures/teapot.jpg', {repeat: {x: 1, y: 1}}),
    side: THREE.DoubleSide,
    useCustomMaterial: true
  },

  position: {
    y: 10
  },

  scale: [4, 4, 4]
}).addTo(world);



const teapot = new WHS.Model({
  geometry: {
    path: './cloockframe.json',
//    physics: '{{ assets }}/models/teapot/utah-teapot-light.json'
  },

  mass: 200,

  physics: {
    type: 'concave',
    friction: 1,
    restitution: 0.5
  },

  material: {
    kind: 'phong',
    shading: THREE.SmoothShading,
//    map: WHS.texture('{{ assets }}/textures/teapot.jpg', {repeat: {x: 1, y: 1}}),
    side: THREE.DoubleSide,
    useCustomMaterial: true
  },

  position: {
    y: 20
  },

  scale: [4, 4, 4]
}).addTo(world);







world.setControls(new WHS.OrbitControls());
world.start();

})();
