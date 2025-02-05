import { Config } from './Config.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class TextManager {
	constructor( scene, arena ) {
		this.THREE = Config.THREE;
		this.scene = scene;
		this.arena = arena;
		this.font = null;
		this.fontLoader = new FontLoader();

        this.fontLoaded = new Promise((resolve, reject) => {
            this.fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.145.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                this.font = font;
                resolve(font);
            }, undefined, (error) => {
                reject(error);
            });
        });
	}


    async createText(text, size, depth, color, position) {
        await this.fontLoaded;
        const material = new this.THREE.MeshBasicMaterial({ color });
        const geometry = new TextGeometry(text, {
            font: this.font,
            size,
            depth,
        });
        const mesh = new this.THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        this.scene.group.add(mesh);
        return mesh;
    }

	async updateText( mesh, text, size, depth ){
		if (mesh.geometry){
			mesh.geometry.dispose();
		}
		mesh.geometry = new TextGeometry(text, {
			font: this.font,
			size,
			depth,
		});
	}
}
