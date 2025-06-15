import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';


import { Preloader } from './scenes/Preloader';
import { DragToCategory } from './scenes/DragToCategory';
import { NameThePictureScene } from './scenes/NameThePictureScene';
import { FindThePairs } from './scenes/FindThePairs';

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
        Preloader,
        Game,
        DragToCategory,
        FindThePairs,
        NameThePictureScene,
        MainMenu,
        GameOver
    ]
};

const StartGame = (parent: string) => {
	return new Game({ ...config, parent });
};

export default StartGame;
