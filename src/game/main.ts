import { AUTO, Game } from "phaser";

import { Preloader } from "./scenes/Preloader";
import { MainMenu } from "./scenes/MainMenu";
import { Game as GameScene } from "./scenes/Game";
import { DragToCategory } from "./scenes/DragToCategory";
import { FindThePairs } from "./scenes/FindThePairs";
import { NameThePictureScene } from "./scenes/NameThePictureScene";
import { GameOver } from "./scenes/GameOver";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
	type: AUTO,
	width: 1024,
	height: 768,
	parent: "game-container",
	backgroundColor: "#028af8",
	scene: [
		Preloader,
		MainMenu,
		DragToCategory,
        		GameScene,

		FindThePairs,
		NameThePictureScene,
		GameOver,
		Game,
	],
};

const StartGame = (parent: string) => {
	return new Game({ ...config, parent });
};

export default StartGame;
