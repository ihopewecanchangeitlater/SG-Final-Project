import { Boot } from './Boot';
import { GameOver } from './GameOver';
import { Game as MainGame } from './Game';
import { MainMenu } from './MainMenu';
import { AUTO, Game } from 'phaser';
<<<<<<< HEAD:src/game/main.ts
import { Preloader } from './scenes/Preloader';
import { DragToCategory } from  './scenes/DragToCategory';
=======
import { Preloader } from './Preloader';
import NameThePictureScene from './scenes/NameThePictureScene';
>>>>>>> stathis:src/game/scenes/stathis/main.ts

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        NameThePictureScene,    
        Preloader,

        DragToCategory,

        MainMenu,
        MainGame,
        GameOver
        
    ]
};

const StartGame = (parent: string) => {
	return new Game({ ...config, parent });
};

export default StartGame;
