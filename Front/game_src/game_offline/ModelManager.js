import { Config } from "./Config.js";
import { EnvironmentConfig } from "./EnvironmentConfig.js";

export class ModelManager {
	constructor ( scene ) {
		this.scene = scene;
		this.modelConfig = null;
	}

	loadModel( modelId ) {
		try {
			if (!EnvironmentConfig[modelId]){
				throw new Error ('Model "${modelId}" not found');
			}
			const loader = new Config.GLTFLoader();
			this.modelConfig = EnvironmentConfig[modelId]

			loader.load(
				this.modelConfig.path,
				(gltf) => {
					this.model = gltf.scene;
					this.centerAndScakeModel();
					this.scene.add(this.model);

					// console.log('Model loaded successfully');
					//send the ready message
				},
			);
		} catch (error){
			console.error('Failed to load model:', error);
			throw error;
		}
	}

	centerAndScakeModel() {
		// Position the model
		const { position, rotation } = this.modelConfig

		this.model.position.set(position.x, position.y, position.z);
		this.model.rotation.set(rotation.x, rotation.y, rotation.z);

		// Scale the model
		const box = new Config.THREE.Box3().setFromObject(this.model);
		const size = box.getSize(new Config.THREE.Vector3());

		const maxDim = Math.max(size.x, size.y, size.z);
		if (maxDim > 0) {
			const scale = this.modelConfig.scale / maxDim;
			this.model.scale.multiplyScalar(scale);
		}
	}

	getColors() {
	  return this.modelConfig.colors;
	}
	
	getCameraOffset() {
	  return this.modelConfig.cameraOffset;
	}
	
	getArenaId() {
		return this.modelConfig.arena;
	}

}
