import Phaser from 'phaser';

interface GameState {
  gamePhase: 'initial' | 'memorize' | 'missing' | 'choose' | 'feedback';
  originalObjects: number[];
  missingObject: number | null;
  selectedAnswer: number | null;
  score: number;
  isCorrect: boolean | null;
  timeLeft: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en' | 'gr';
}

export default class WhatsMissingScene extends Phaser.Scene {
  private gameState!: GameState;
  private objectImages: Phaser.GameObjects.Image[] = [];
  private choiceImages: Phaser.GameObjects.Image[] = [];
  private timerText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Text;
  private endGameButton!: Phaser.GameObjects.Text;
  private newRoundButton!: Phaser.GameObjects.Text;
  private difficultyButtons: Phaser.GameObjects.Text[] = [];
  private languageButtons: Phaser.GameObjects.Text[] = [];
  private stars: Phaser.GameObjects.Image[] = [];
  private gameTimer?: Phaser.Time.TimerEvent;

  private texts = {
    en: {
      title: "What's Missing?",
      memorize: "Memorize these objects...",
      choose: "Which object is missing?",
      correct: "Correct! Well done!",
      incorrect: "Try again!",
      startGame: "Start Game",
      newRound: "New Round",
      endGame: "End Game",
      score: "Score",
      selectDifficulty: "Select Difficulty",
      selectLanguage: "Language",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard"
    },
    gr: {
      title: "Τι Έλειπε;",
      memorize: "Θυμήσου αυτά τα αντικείμενα...",
      choose: "Ποιο αντικείμενο λείπει;",
      correct: "Σωστά! Μπράβο!",
      incorrect: "Ξαναπροσπάθησε!",
      startGame: "Έναρξη Παιχνιδιού",
      newRound: "Νέος Γύρος",
      endGame: "Τέλος Παιχνιδιού",
      score: "Σκορ",
      selectDifficulty: "Επιλέξτε Δυσκολία",
      selectLanguage: "Γλώσσα",
      easy: "Εύκολο",
      medium: "Μέτριο",
      hard: "Δύσκολο"
    }
  };

  private difficultySettings = {
    easy: { 
      objectCount: 3, 
      memorizeTime: 8000, 
      chooseTime: 60000,
      availableObjects: [1, 2, 3, 4, 5] 
    },
    medium: { 
      objectCount: 5, 
      memorizeTime: 6000, 
      chooseTime: 45000,
      availableObjects: [1, 2, 3, 4, 5, 6, 7, 8] 
    },
    hard: { 
      objectCount: 7, 
      memorizeTime: 4000, 
      chooseTime: 30000,
      availableObjects: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 
    }
  };

  constructor() {
    super({ key: 'WhatsMissingScene' });
  }

  create() {
    this.gameState = {
      gamePhase: 'initial',
      originalObjects: [],
      missingObject: null,
      selectedAnswer: null,
      score: 0,
      isCorrect: null,
      timeLeft: 0,
      difficulty: 'medium',
      language: 'en'
    };

    this.createBackground();
    this.createUI();
    this.showInitialScreen();
  }

  private createBackground() {
    // Create gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x3B82F6, 0x8B5CF6, 0xEC4899, 0xF59E0B, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
  }

  private createUI() {
    const centerX = this.cameras.main.width / 2;
    
    // Title
    this.titleText = this.add.text(centerX, 80, this.texts[this.gameState.language].title, {
      fontSize: '48px',
      color: '#1F2937',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Score
    this.scoreText = this.add.text(centerX, 140, `${this.texts[this.gameState.language].score}: 0`, {
      fontSize: '24px',
      color: '#1F2937',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Timer
    this.timerText = this.add.text(centerX, 180, '', {
      fontSize: '20px',
      color: '#2563EB',
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);

    // Instructions
    this.instructionText = this.add.text(centerX, 220, '', {
      fontSize: '24px',
      color: '#374151'
    }).setOrigin(0.5);

    // Buttons
    this.startButton = this.add.text(centerX, 500, this.texts[this.gameState.language].startGame, {
      fontSize: '24px',
      color: '#FFFFFF',
      backgroundColor: '#3B82F6',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.newRoundButton = this.add.text(centerX, 500, this.texts[this.gameState.language].newRound, {
      fontSize: '24px',
      color: '#FFFFFF',
      backgroundColor: '#3B82F6',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

    this.endGameButton = this.add.text(centerX, 600, this.texts[this.gameState.language].endGame, {
      fontSize: '20px',
      color: '#FFFFFF',
      backgroundColor: '#DC2626',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Event handlers
    this.startButton.on('pointerdown', () => this.startNewRound());
    this.newRoundButton.on('pointerdown', () => this.startNewRound());
    this.endGameButton.on('pointerdown', () => this.scene.start('MainMenuScene'));

    this.createDifficultyButtons();
    this.createLanguageButtons();
  }

  private createDifficultyButtons() {
    const centerX = this.cameras.main.width / 2;
    const difficulties = ['easy', 'medium', 'hard'] as const;
    
    this.add.text(centerX, 300, this.texts[this.gameState.language].selectDifficulty, {
      fontSize: '20px',
      color: '#374151',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    difficulties.forEach((diff, index) => {
      const button = this.add.text(centerX + (index - 1) * 150, 340, this.texts[this.gameState.language][diff], {
        fontSize: '18px',
        color: this.gameState.difficulty === diff ? '#FFFFFF' : '#374151',
        backgroundColor: this.gameState.difficulty === diff ? '#3B82F6' : '#F3F4F6',
        padding: { x: 15, y: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      button.on('pointerdown', () => {
        this.gameState.difficulty = diff;
        this.updateDifficultyButtons();
      });

      this.difficultyButtons.push(button);
    });
  }

  private createLanguageButtons() {
    const centerX = this.cameras.main.width / 2;
    
    this.add.text(centerX, 380, this.texts[this.gameState.language].selectLanguage, {
      fontSize: '20px',
      color: '#374151',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const languages = [{ key: 'en', label: 'English' }, { key: 'gr', label: 'Ελληνικά' }];
    
    languages.forEach((lang, index) => {
      const button = this.add.text(centerX + (index - 0.5) * 120, 420, lang.label, {
        fontSize: '18px',
        color: this.gameState.language === lang.key ? '#FFFFFF' : '#374151',
        backgroundColor: this.gameState.language === lang.key ? '#3B82F6' : '#F3F4F6',
        padding: { x: 15, y: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      button.on('pointerdown', () => {
        this.gameState.language = lang.key as 'en' | 'gr';
        this.updateLanguageButtons();
        this.updateTexts();
      });

      this.languageButtons.push(button);
    });
  }

  private updateDifficultyButtons() {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    this.difficultyButtons.forEach((button, index) => {
      const isSelected = this.gameState.difficulty === difficulties[index];
      button.setStyle({
        color: isSelected ? '#FFFFFF' : '#374151',
        backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6'
      });
    });
  }

  private updateLanguageButtons() {
    const languages = ['en', 'gr'];
    this.languageButtons.forEach((button, index) => {
      const isSelected = this.gameState.language === languages[index];
      button.setStyle({
        color: isSelected ? '#FFFFFF' : '#374151',
        backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6'
      });
    });
  }

  private updateTexts() {
    this.titleText.setText(this.texts[this.gameState.language].title);
    this.scoreText.setText(`${this.texts[this.gameState.language].score}: ${this.gameState.score}`);
    this.startButton.setText(this.texts[this.gameState.language].startGame);
    this.newRoundButton.setText(this.texts[this.gameState.language].newRound);
    this.endGameButton.setText(this.texts[this.gameState.language].endGame);
    
    // Update difficulty button texts
    const difficulties = ['easy', 'medium', 'hard'] as const;
    this.difficultyButtons.forEach((button, index) => {
      button.setText(this.texts[this.gameState.language][difficulties[index]]);
    });
  }

  private showInitialScreen() {
    this.gameState.gamePhase = 'initial';
    this.clearObjects();
    this.clearChoices();
    
    this.instructionText.setText('Ready to test your memory?');
    this.startButton.setVisible(this.gameState.score === 0);
    this.newRoundButton.setVisible(this.gameState.score > 0);
    this.timerText.setVisible(false);
    
    // Show difficulty and language selection
    this.difficultyButtons.forEach(button => button.setVisible(true));
    this.languageButtons.forEach(button => button.setVisible(true));
  }

  private startNewRound() {
    this.gameState.gamePhase = 'memorize';
    this.clearObjects();
    this.clearChoices();
    
    // Hide setup UI
    this.startButton.setVisible(false);
    this.newRoundButton.setVisible(false);
    this.difficultyButtons.forEach(button => button.setVisible(false));
    this.languageButtons.forEach(button => button.setVisible(false));
    
    // Generate objects
    const settings = this.difficultySettings[this.gameState.difficulty];
    const shuffled = [...settings.availableObjects].sort(() => Math.random() - 0.5);
    this.gameState.originalObjects = shuffled.slice(0, settings.objectCount);
    
    const missingIndex = Math.floor(Math.random() * this.gameState.originalObjects.length);
    this.gameState.missingObject = this.gameState.originalObjects[missingIndex];
    
    this.instructionText.setText(this.texts[this.gameState.language].memorize);
    this.gameState.timeLeft = settings.memorizeTime / 1000;
    this.timerText.setVisible(true);
    this.timerText.setText(`${this.gameState.timeLeft}s`);
    
    this.displayObjects(this.gameState.originalObjects);
    
    // Start memorize timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      repeat: this.gameState.timeLeft - 1
    });
    
    // After memorize time, show missing phase
    this.time.delayedCall(settings.memorizeTime, () => {
      this.showMissingPhase();
    });
  }

  private showMissingPhase() {
    this.gameState.gamePhase = 'missing';
    this.instructionText.setText('Look carefully...');
    this.timerText.setText('2s');
    this.gameState.timeLeft = 2;
    
    // Remove the missing object
    const objectsWithoutMissing = this.gameState.originalObjects.filter(
      obj => obj !== this.gameState.missingObject
    );
    this.displayObjects(objectsWithoutMissing);
    
    // After brief pause, show choices
    this.time.delayedCall(2000, () => {
      this.showChoicePhase();
    });
  }

  private showChoicePhase() {
    this.gameState.gamePhase = 'choose';
    this.instructionText.setText(this.texts[this.gameState.language].choose);
    
    const settings = this.difficultySettings[this.gameState.difficulty];
    this.gameState.timeLeft = settings.chooseTime / 1000;
    this.timerText.setText(`Time: ${this.gameState.timeLeft}s`);
    
    this.displayChoices();
    
    // Start choose timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      repeat: this.gameState.timeLeft - 1
    });
  }

  private updateTimer() {
    this.gameState.timeLeft--;
    if (this.gameState.gamePhase === 'memorize') {
      this.timerText.setText(`${this.gameState.timeLeft}s`);
    } else if (this.gameState.gamePhase === 'choose') {
      this.timerText.setText(`Time: ${this.gameState.timeLeft}s`);
    }
  }

  private displayObjects(objects: number[]) {
    this.clearObjects();
    
    const centerX = this.cameras.main.width / 2;
    const startY = 280;
    const cols = 3;
    const spacing = 120;
    
    objects.forEach((objectId, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = centerX + (col - 1) * spacing;
      const y = startY + row * spacing;
      
      const image = this.add.image(x, y, `object${objectId}`);
      image.setDisplaySize(80, 80);
      image.setAlpha(0);
      
      // Animate in
      this.tweens.add({
        targets: image,
        alpha: 1,
        scale: 1.1,
        duration: 300,
        delay: index * 100,
        ease: 'Back.easeOut'
      });
      
      this.objectImages.push(image);
    });
  }

  private displayChoices() {
    this.clearChoices();
    
    const settings = this.difficultySettings[this.gameState.difficulty];
    const shuffledOptions = [...settings.availableObjects].sort(() => Math.random() - 0.5);
    
    const centerX = this.cameras.main.width / 2;
    const startY = 450;
    const cols = 5;
    const spacing = 100;
    
    shuffledOptions.forEach((objectId, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = centerX + (col - 2) * spacing;
      const y = startY + row * spacing;
      
      const image = this.add.image(x, y, `object${objectId}`);
      image.setDisplaySize(60, 60);
      image.setInteractive({ useHandCursor: true });
      
      image.on('pointerdown', () => this.handleAnswerSelect(objectId));
      image.on('pointerover', () => {
        this.tweens.add({
          targets: image,
          scale: 1.2,
          duration: 200
        });
      });
      image.on('pointerout', () => {
        this.tweens.add({
          targets: image,
          scale: 1,
          duration: 200
        });
      });
      
      this.choiceImages.push(image);
    });
  }

  private handleAnswerSelect(selectedObject: number) {
    if (this.gameTimer) {
      this.gameTimer.remove();
    }
    
    const correct = selectedObject === this.gameState.missingObject;
    this.gameState.isCorrect = correct;
    this.gameState.selectedAnswer = selectedObject;
    
    if (correct) {
      this.gameState.score++;
      this.addStar();
    }
    
    this.showFeedback();
  }

  private showFeedback() {
    this.gameState.gamePhase = 'feedback';
    this.clearChoices();
    
    const feedbackText = this.gameState.isCorrect 
      ? this.texts[this.gameState.language].correct 
      : this.texts[this.gameState.language].incorrect;
    
    this.instructionText.setText(feedbackText);
    this.instructionText.setStyle({ 
      color: this.gameState.isCorrect ? '#059669' : '#DC2626',
      fontSize: '32px',
      fontStyle: 'bold'
    });
    
    this.scoreText.setText(`${this.texts[this.gameState.language].score}: ${this.gameState.score}`);
    this.timerText.setVisible(false);
    
    if (this.gameState.isCorrect) {
      // Show star animation
      const star = this.add.image(this.cameras.main.width / 2, 350, 'star');
      star.setScale(0);
      this.tweens.add({
        targets: star,
        scale: 2,
        duration: 500,
        ease: 'Bounce.easeOut',
        onComplete: () => {
          this.time.delayedCall(1000, () => star.destroy());
        }
      });
    }
    
    // Return to initial screen after feedback
    this.time.delayedCall(3000, () => {
      this.instructionText.setStyle({ 
        color: '#374151',
        fontSize: '24px',
        fontStyle: 'normal'
      });
      this.showInitialScreen();
    });
  }

  private addStar() {
    const starX = 100 + this.stars.length * 40;
    const star = this.add.image(starX, 140, 'star');
    star.setScale(0.5);
    this.stars.push(star);
  }

  private clearObjects() {
    this.objectImages.forEach(image => image.destroy());
    this.objectImages = [];
  }

  private clearChoices() {
    this.choiceImages.forEach(image => image.destroy());
    this.choiceImages = [];
  }
}