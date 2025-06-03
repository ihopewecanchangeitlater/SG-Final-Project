import Phaser from 'phaser';

export default class WhatsMissingPreloader extends Phaser.Scene {
  constructor() {
    super({ key: 'WhatsMissingPreloader' });
  }

  preload() {
    // Create loading bar
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    this.add.text(centerX, centerY - 50, 'Loading What\'s Missing Game...', {
      fontSize: '24px',
      color: '#1F2937'
    }).setOrigin(0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(centerX - 160, centerY, 320, 50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x3B82F6, 1);
      progressBar.fillRect(centerX - 150, centerY + 10, 300 * value, 30);
    });

    // Load object images (1.jpg through 10.jpg)
    for (let i = 1; i <= 10; i++) {
      this.load.image(`object${i}`, `assets/images/${i}.jpg`);
    }

    // Load star icon (you can replace this with your own star image)
    this.load.image('star', 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FCD34D">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `));

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      this.scene.start('WhatsMissingScene');
    });
  }

  create() {
    // Example of adding an object image to the scene
    const x = 400; // Replace with desired x coordinate
    const y = 300; // Replace with desired y coordinate
    const objectId = 1; // Replace with the desired object ID (1-10)
    
    this.add.image(x, y, `object${objectId}`);
  }
}