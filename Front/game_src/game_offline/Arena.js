import { Config } from './Config.js'

export class Arena {
	constructor( arenaId ) {
		// Arena propreties
		this.arenaWidth = 2.1;
		this.arenaHeight = 1.1;
		this.arenaDepth = 0.1;
		this.arenaId = arenaId;

		this.loadArenaTextures();
	}

	loadArenaTextures(){
		this.textureLoader = new Config.THREE.TextureLoader();
		//Metal texture
		if (this.arenaId === 1){
			this.albedoMap = this.textureLoader.load('/../../images/models/textures/Metal/Vol_18_2_Base_Color.png');
			this.normalMap = this.textureLoader.load('/../../images/models/textures/Metal/Vol_18_2_Normal.png');
			this.heightMap = this.textureLoader.load('/../../images/models/textures/Metal/Vol_18_2_Height.png');
			this.roughnessMap = this.textureLoader.load('/../../images/models/textures/Metal/Vol_18_2_Roughness.png');
		}
		//Terrain texture
		else if (this.arenaId === 2){
			this.albedoMap = this.textureLoader.load('/../../images/models/textures/Terrain/Vol_19_4_Base_Color.png');
			this.normalMap = this.textureLoader.load('/../../images/models/textures/Terrain/Vol_19_4_Normal.png');
			this.heightMap = this.textureLoader.load('/../../images/models/textures/Terrain/Vol_19_4_Height.png');
			this.roughnessMap = this.textureLoader.load('/../../images/models/textures/Terrain/Vol_19_4_Roughness.png');
		}
		//Tiles texture
		else if (this.arenaId === 3){
			this.albedoMap = this.textureLoader.load('/../../images/models/textures/Tiles/Vol_34_2_Base_Color.png');
			this.normalMap = this.textureLoader.load('/../../images/models/textures/Tiles/Vol_34_2_Normal.png');
			this.heightMap = this.textureLoader.load('/../../images/models/textures/Tiles/Vol_34_2_Height.png');
			this.roughnessMap = this.textureLoader.load('/../../images/models/textures/Tiles/Vol_34_2_Roughness.png');
		}

		// Arena Drawing
		this.geometry = new Config.THREE.BoxGeometry(this.arenaWidth, this.arenaHeight, this.arenaDepth);
		this.material = new Config.THREE.MeshStandardMaterial({
		map: this.albedoMap, // Albedo (base color) texture
		normalMap: this.normalMap, // Normal map
		displacementMap: this.heightMap, // Height/displacement map
		roughnessMap: this.roughnessMap, // Roughness map
		color: 0xffffff, // Base color (if no albedo map is used)
		normalScale: new Config.THREE.Vector2(1, 1), // Adjust normal map strength
		displacementScale: 0, // Adjust height map scale
		roughness: 0.5 // Adjust overall roughness
		});
		this.mesh = new Config.THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, 0);

		// Calculate the center of the arena
		this.mesh.geometry.computeBoundingBox();
		this.box = new Config.THREE.Box3().setFromObject(this.mesh);
		this.arenaCenter = this.box.getCenter(new Config.THREE.Vector3());
	}
}
