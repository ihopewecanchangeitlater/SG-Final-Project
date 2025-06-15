import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
	background: GameObjects.Image;
	logo: GameObjects.Image;
	title: GameObjects.Text;

	constructor() {
		super("MainMenu");
	}

	create() {
		this.logo = this.add.image(
			this.sys.game.scale.width / 2,
			this.sys.game.scale.height / 2,
			"logo"
		);
		this.logo.setScale(0.5);

		this.title = this.add
			.text(512, 40, "Main Menu", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.input.once("pointerdown", () => {
			this.scene.start("Game");
		});
	}
}
