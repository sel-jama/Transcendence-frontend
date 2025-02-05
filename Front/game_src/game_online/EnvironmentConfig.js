
export const EnvironmentConfig = {
	COLOSSEUM: {
		id: 'COLOSSEUM',
		path: '/../../images/models/Colosseum.glb',
		position: {x: 0, y: 0, z: 0.7},
		rotation: {x: Math.PI / 2, y: Math.PI / 3, z: 0},
		scale: 15,
		cameraOffset: {x: 5, y: 10, z: 8},
		arena: 3,
		brightLight: true,
		// scoreColor:
		colors: {
			ball: 0xc8ad7f,
			score: 0xffffff
		}
	},

	FOREST: {
		path: '/../../images/models/scene.gltf',
		position: {x: -44.05, y: 4.05, z: 23.8},
		rotation: {x: Math.PI / 2, y: 0, z: 0},
		scale: 537,
		cameraOffset: {x: 5, y: 70, z: 50},
		arena: 2,
		brightLight: false,
		colors: {
			ball: 0xffffff,
			score: 0xffffff
		}
	},

	CASTLE: {
		path: '/../../images/models/Castle.glb',
		position: {x: 0, y: 0, z: -5.4},
		rotation: {x: Math.PI / 2, y: 0, z: 0},
		scale: 15,
		cameraOffset: {x: 5, y: 10, z: 5},
		arena: 1,
		brightLight: false,
		colors: {
			ball: 0x7B0323,
			score: 0xffffff
		}
	}
};
