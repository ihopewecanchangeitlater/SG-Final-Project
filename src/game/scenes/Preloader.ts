import { Scene } from "phaser";

export class Preloader extends Scene {
	constructor() {
		super("Preloader");
	}

	preload() {
		this.load.setPath(`${import.meta.env.BASE_URL}/assets`);
		this.load.image("logo", "logo.png");
	}

	create() {
		this.scene.start("MainMenu");
	}
}
