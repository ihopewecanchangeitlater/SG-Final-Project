import { Scene } from "phaser";

export class Preloader extends Scene {
	constructor() {
		super("Preloader");
	}

	preload() {
		const isDev = process.env.NODE_ENV === "development";
		const baseUrl = isDev ? "" : import.meta.env.BASE_URL;
		this.load.setPath(`${baseUrl}/assets`);
		this.load.image("logo", "logo.png");
	}

	create() {
		this.scene.start("MainMenu");
	}
}
