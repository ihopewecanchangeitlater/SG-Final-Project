import { Play } from "./scenes/Play";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
	type: AUTO,
	width: 549,
	height: 480,
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	parent: "game-container",
	backgroundColor: "#294ca3",
	scene: [Preloader, Play],
};

const StartGame = (parent: string) => {
	return new Game({ ...config, parent });
};

export default StartGame;
