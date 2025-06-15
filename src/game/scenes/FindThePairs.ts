import { Scene, GameObjects } from "phaser";

type Card = {
	gameObject: GameObjects.Plane;
	flip: (callbackComplete?: () => void) => void;
	destroy: () => void;
	cardName: string;
};
type Heart = GameObjects.Image;

type CardList = Card[];
type HeartList = Heart[];

export class Play extends Scene {
	// All cards names
	cardNames = [
		"card-0",
		"card-1",
		"card-2",
		"card-3",
		"card-4",
		"card-5",
		"card-6",
		"card-7",
	];

	// Cards Game Objects
	cards: CardList = [];

	// History of card opened
	cardOpened?: Card = undefined;

	// Can play the game
	canMove = false;

	lives = 0;

	// Grid configuration
	gridConfiguration = {
		x: 113,
		y: 102,
		paddingX: 10,
		paddingY: 10,
	};

	// Main title properties
	mainTitleColor = "#7f8ecc";
	mainTitleStrokeColor = "#dbdff0";
	hilightedTitleColor = "#d1d5e9";
	hilightedStrokeColor = "#7689d5";
	strokeWidth = 4;

	// Difficulty configuration
	difficultySettings = {
		Easy: { lives: 10, rows: 3, cols: 4 },
		Medium: { lives: 9, rows: 3, cols: 4 },
		Hard: { lives: 8, rows: 3, cols: 4 },
		Expert: { lives: 7, rows: 3, cols: 4 },
	};
	selectedDifficulty = {
		lives: 0,
		rows: 0,
		cols: 0,
	};
	
	helpPanelOpen = false;

	constructor() {
		super({
			key: "Play",
		});
	}

	init(): void {
		this.cameras.main.fadeIn(500);
		this.volumeButton();
	}

	preload() {
		this.load.setPath("assets/");

		this.load.audio("theme-song", "audio/fat-caps-audionatix.mp3");
		this.load.audio("whoosh", "audio/whoosh.mp3");
		this.load.audio("card-flip", "audio/card-flip.mp3");
		this.load.audio("card-match", "audio/card-match.mp3");
		this.load.audio("card-mismatch", "audio/card-mismatch.mp3");
		this.load.audio("card-slide", "audio/card-slide.mp3");
		this.load.audio("victory", "audio/victory.mp3");
		
		this.load.image("background");
		this.load.image("card-back", "images/cards/card-back.png");
		this.load.image("card-0", "images/cards/card-0.png");
		this.load.image("card-1", "images/cards/card-1.png");
		this.load.image("card-2", "images/cards/card-2.png");
		this.load.image("card-3", "images/cards/card-3.png");
		this.load.image("card-4", "images/cards/card-4.png");
		this.load.image("card-5", "images/cards/card-5.png");
		this.load.image("card-6", "images/cards/card-6.png");
		this.load.image("card-7", "images/cards/card-7.png");

		this.load.image("volume-icon", "ui/volume-icon.png");
		this.load.image("volume-icon_off", "ui/volume-icon_off.png");
		this.load.image("heart", "ui/heart.png");
		this.load.image("back-button", "ui/back-button.png");
	}

	create(): void {
		const titleText = this.add
			.text(
				this.sys.game.scale.width / 2,
				this.sys.game.scale.height / 2,
				"Memory Card Game\nClick to Play",
				{
					align: "center",
					fontSize: 40,
					fontStyle: "bold",
					color: this.mainTitleColor,
				}
			)
			.setStroke(this.mainTitleStrokeColor, this.strokeWidth)
			.setOrigin(0.5)
			.setDepth(3)
			.setInteractive();

		// Text Events
		titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
			titleText.setColor(this.hilightedTitleColor);
			titleText.setStroke(this.hilightedStrokeColor, this.strokeWidth);
			this.input.setDefaultCursor("pointer");
		});
		titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
			titleText.setColor(this.mainTitleColor);
			titleText.setStroke(this.mainTitleStrokeColor, this.strokeWidth);
			this.input.setDefaultCursor("default");
		});
		titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.sound.play("whoosh", { volume: 1.3 });
			this.add.tween({
				targets: titleText,
				ease: Phaser.Math.Easing.Bounce.InOut,
				y: -1000,
				onComplete: () => {
					if (!this.sound.get("theme-song")) {
						this.sound.play("theme-song", {
							loop: true,
							volume: 0.5,
						});
					}
					this.selectDifficulty();
				},
			});
		});
	}

	restartGame(): void {
		this.cardOpened = undefined;
		this.cameras.main.fadeOut(200 * this.cards.length);
		this.cards.reverse().map((card, index) => {
			this.add.tween({
				targets: card.gameObject,
				duration: 500,
				y: 1000,
				delay: index * 100,
				onComplete: () => {
					card.gameObject.destroy();
				},
			});
		});

		this.time.addEvent({
			delay: 200 * this.cards.length,
			callback: () => {
				this.cards = [];
				this.canMove = false;
				this.scene.restart();
				this.sound.play("card-slide", { volume: 1.2 });
			},
		});
	}

	createGridCards(): CardList {
		const { rows, cols } = this.selectedDifficulty;
		const totalCards = rows * cols;

		const slicedCards = Phaser.Utils.Array.Shuffle(this.cardNames).slice(
			0,
			totalCards / 2
		);
		const cardNames = Phaser.Utils.Array.Shuffle([
			...slicedCards,
			...slicedCards,
		]);

		const baseCardWidth = 99;
		const baseCardHeight = 128;

		const availableWidth = 450;
		const availableHeight = 430;

		const scaleFactor = 0.85;

		const paddingX = this.gridConfiguration.paddingX * scaleFactor;
		const paddingY = this.gridConfiguration.paddingY * scaleFactor;
		const offsetX =
			((this.sys.game.scale.width - availableWidth) / 2 + 10) * scaleFactor;
		const offsetY =
			((this.sys.game.scale.height - availableHeight) / 2 + 5) * scaleFactor;

		// Calculate total grid size
		const totalGridWidth = cols * (baseCardWidth + paddingX) - paddingX;
		const totalGridHeight = rows * (baseCardHeight + paddingY) - paddingY;

		// Top-left corner to start placing cards from (to center the grid)
		const startX =
			(availableWidth - totalGridWidth) / 2 + baseCardWidth / 2 + offsetX;
		const startY =
			(availableHeight - totalGridHeight) / 2 + baseCardHeight / 2 + offsetY;

		return cardNames.map((name, index) => {
			const col = index % cols;
			const row = Math.floor(index / cols);

			const x = startX + col * (baseCardWidth + paddingX);
			const yStart = -1000; // animate from above
			const yEnd = startY + row * (baseCardHeight + paddingY);

			const newCard = this.createCard({
				scene: this,
				x,
				y: yStart,
				frontTexture: name,
				cardName: name,
				scale: scaleFactor + 0.15,
			});

			this.add.tween({
				targets: newCard.gameObject,
				duration: 800,
				delay: index * 100,
				y: yEnd,
				onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
			});

			return newCard;
		});
	}

	createHearts(): HeartList {
		const offset = (10 - this.lives) * 31 * 0.5;
		return Array.from(new Array(this.lives)).map((_, index) => {
			const heart = this.add
				.image(this.sys.game.scale.width + 1000, 20, "heart")
				.setScale(2);

			this.add.tween({
				targets: heart,
				ease: Phaser.Math.Easing.Expo.InOut,
				duration: 1000,
				delay: 1000 + index * 200,
				x: 140 + offset + 30 * index, // marginLeft + spaceBetween * index
			});
			return heart;
		});
	}

	showHelpPanel() {
		if (this.helpPanelOpen) return;
		this.helpPanelOpen = true;

		const panelWidth = 500;
		const panelHeight = 280;
		const panelX = this.scale.width / 2;
		const panelY = this.scale.height / 2;

		// Δημιουργία στρογγυλεμένου παραθύρου με σκιά
		const panel = this.add.graphics().setDepth(2000);

		// Σκιά
		panel.fillStyle(0x000000, 0.4);
		panel.fillRoundedRect(
			panelX - panelWidth / 2 + 4,
			panelY - panelHeight / 2 + 4,
			panelWidth,
			panelHeight,
			20
		);

		// Κύριο σώμα παραθύρου
		panel.fillStyle(0x222222, 0.95);
		panel.fillRoundedRect(
			panelX - panelWidth / 2,
			panelY - panelHeight / 2,
			panelWidth,
			panelHeight,
			20
		);

		// Κείμενο βοήθειας
		const helpText = this.add
			.text(
				panelX,
				panelY,
				"Ανακάλυψε τα ζευγάρια καρτών\nκαι διασκέδασε μαθαίνοντας!\n\nΑν κάνεις λάθος, μην ανησυχείς, \nμπορείς πάντα να προσπαθήσεις ξανά!",
				{
					fontSize: "20px",
					fontFamily: "Arial",
					color: "#ffffff",
					align: "center",
					wordWrap: { width: 420 },
					lineSpacing: 8,
				}
			)
			.setOrigin(0.5)
			.setDepth(2001);

		// Κουμπί κλεισίματος
		const closeButton = this.add
			.text(panelX + panelWidth / 2 - 16, panelY - panelHeight / 2 + 16, "✕", {
				fontSize: "24px",
				fontFamily: "Arial",
				color: "#ffffff",
				backgroundColor: "#cc3333",
				padding: { left: 10, right: 10, top: 4, bottom: 4 },
			})
			.setOrigin(1, 0)
			.setInteractive({ useHandCursor: true })
			.setDepth(2002);

		closeButton.on("pointerover", () =>
			closeButton.setStyle({ backgroundColor: "#ff4444" })
		);
		closeButton.on("pointerout", () =>
			closeButton.setStyle({ backgroundColor: "#cc3333" })
		);

		// Κλείσιμο παραθύρου
		closeButton.on("pointerdown", () => {
			panel.destroy();
			helpText.destroy();
			closeButton.destroy();
			this.helpPanelOpen = false;
		});
	}

	createHelpIcon() {
		const helpIcon = this.add
			.text(this.scale.width - 3, 5, "?", {
				fontSize: "24px",
				color: "#ffffff",
				backgroundColor: "#5c7fd6",
				padding: { x: 10, y: 5 },
			})
			.setOrigin(1, 0)
			.setDepth(1000)
			.setInteractive({ useHandCursor: true });

		helpIcon.on("pointerdown", () => this.showHelpPanel());
	}

	volumeButton(): void {
		const volumeIcon = this.add
			.image(25, 25, "volume-icon")
			.setName("volume-icon");
		volumeIcon.setInteractive();

		// Mouse enter
		volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
			this.input.setDefaultCursor("pointer");
		});
		// Mouse leave
		volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
			this.input.setDefaultCursor("default");
		});

		volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
			if (this.sound.volume === 0) {
				this.sound.setVolume(1);
				volumeIcon.setTexture("volume-icon");
				volumeIcon.setAlpha(1);
			} else {
				this.sound.setVolume(0);
				volumeIcon.setTexture("volume-icon_off");
				volumeIcon.setAlpha(0.5);
			}
		});
	}

	backButton(): void {
		const mainMenuButton = this.add
			.image(25, 70, "back-button")
			.setName("back-button")
			.setInteractive();

		mainMenuButton.on(Phaser.Input.Events.POINTER_OVER, () => {
			this.input.setDefaultCursor("pointer");
		});
		mainMenuButton.on(Phaser.Input.Events.POINTER_OUT, () => {
			this.input.setDefaultCursor("default");
		});
		mainMenuButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.sound.play("whoosh", { volume: 1.3 });
			this.scene.restart();
		});
	}

	selectDifficulty(): void {
		this.backButton();
		// Keep references to all buttons
		const difficulties = ["Easy", "Medium", "Hard", "Expert"];
		const buttons: GameObjects.Text[] = []; // Store all button references

		difficulties.forEach((level, index) => {
			const yPosition = 200 + index * 60;
			const button = this.add
				.text(this.sys.game.scale.width / 2, yPosition, level, {
					fontSize: 32,
					color: "#ffffff",
					backgroundColor: "#000000",
					padding: { x: 10, y: 5 },
				})
				.setOrigin(0.5)
				.setInteractive();

			buttons.push(button); // Store reference

			button.on(Phaser.Input.Events.POINTER_OVER, () => {
				button.setStyle({ fill: "#f39c12" });
				this.input.setDefaultCursor("pointer");
			});

			button.on(Phaser.Input.Events.POINTER_OUT, () => {
				button.setStyle({ fill: "#ffffff" });
				this.input.setDefaultCursor("default");
			});

			button.on(Phaser.Input.Events.POINTER_DOWN, () => {
				this.selectedDifficulty = this.difficultySettings[level];
				this.sound.play("whoosh", { volume: 1.3 });

				// Disable all buttons from further input
				buttons.forEach((btn) => btn.disableInteractive());

				// Animate the selected one
				this.add.tween({
					targets: button,
					ease: Phaser.Math.Easing.Bounce.InOut,
					y: -1000,
				});

				// Hide or fade out others
				buttons.forEach((btn) => {
					if (btn !== button) {
						this.add.tween({
							targets: btn,
							alpha: 0,
							duration: 300,
							onComplete: () => btn.setVisible(false),
						});
					}
				});

				// Start game after short delay
				this.time.delayedCall(600, () => {
					if (!this.sound.get("theme-song")) {
						this.sound.play("theme-song", {
							loop: true,
							volume: 0.5,
						});
					}
					this.startGame();
				});
			});
		});
	}

	startGame() {
		this.createHelpIcon();

		// Background image
		const bg = this.add
			.image(
				this.gridConfiguration.x - 63,
				this.gridConfiguration.y - 77,
				"background"
			)
			.setOrigin(0)
			.setAlpha(0)
			.setBlendMode(Phaser.BlendModes.SCREEN);

		// WinnerText and GameOverText
		const winnerText = this.add
			.text(this.sys.game.scale.width / 2, -1000, "YOU WON", {
				align: "center",
				strokeThickness: 4,
				fontSize: 40,
				fontStyle: "bold",
				color: "#8c7ae6",
			})
			.setOrigin(0.5)
			.setDepth(3)
			.setInteractive();

		const gameOverText = this.add
			.text(
				this.sys.game.scale.width / 2,
				-1000,
				"GAME OVER\nClick to restart",
				{
					align: "center",
					strokeThickness: 4,
					fontSize: 40,
					fontStyle: "bold",
					color: "#ff0000",
				}
			)
			.setName("gameOverText")
			.setDepth(3)
			.setOrigin(0.5)
			.setInteractive();

		// Set lives
		this.lives = this.selectedDifficulty.lives;

		// Start lifes images
		const hearts = this.createHearts();

		// Create a grid of cards
		this.cards = this.createGridCards();

		// Start canMove
		this.time.addEvent({
			delay: 200 * this.cards.length,
			callback: () => {
				this.canMove = true;
			},
		});

		// Show background
		this.add.tween({
			targets: bg,
			alpha: 1,
			duration: 800,
			ease: Phaser.Math.Easing.Quadratic.Out,
		});

		// Game Logic
		this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: any) => {
			if (this.canMove) {
				const card = this.cards.find((card) =>
					card.gameObject.hasFaceAt(pointer.x, pointer.y)
				);
				this.input.setDefaultCursor(card ? "pointer" : "default");
			}
		});
		this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: any) => {
			if (this.canMove && this.cards.length) {
				const card = this.cards.find((card) =>
					card.gameObject.hasFaceAt(pointer.x, pointer.y)
				);
				if (card) {
					this.canMove = false;

					// Detect if there is a card opened
					if (this.cardOpened !== undefined) {
						// If the card is the same that the opened not do anything
						if (
							this.cardOpened.gameObject.x === card.gameObject.x &&
							this.cardOpened.gameObject.y === card.gameObject.y
						) {
							this.canMove = true;
							return false;
						}

						card.flip(() => {
							if (this.cardOpened?.cardName === card.cardName) {
								// ------- Match -------
								this.sound.play("card-match");
								// Destroy card selected and card opened from history
								this.cardOpened.destroy();
								card.destroy();

								// remove card destroyed from array
								this.cards = this.cards.filter(
									(cardLocal) => cardLocal.cardName !== card.cardName
								);
								// reset history card opened
								this.cardOpened = undefined;
								this.canMove = true;
							} else {
								// ------- No match -------
								this.sound.play("card-mismatch");
								this.cameras.main.shake(600, 0.01);
								// remove life and heart
								const lastHeart = hearts[hearts.length - 1];
								this.add.tween({
									targets: lastHeart,
									ease: Phaser.Math.Easing.Expo.InOut,
									duration: 1000,
									y: -1000,
									onComplete: () => {
										lastHeart.destroy();
										hearts.pop();
									},
								});
								this.lives -= 1;
								// Flip last card selected and flip the card opened from history and reset history
								card.flip();
								this.cardOpened?.flip(() => {
									this.cardOpened = undefined;
									this.canMove = true;
								});
							}

							// Check if the game is over
							if (this.lives === 0) {
								// Show Game Over text
								this.sound.play("whoosh", { volume: 1.3 });
								this.add.tween({
									targets: gameOverText,
									ease: Phaser.Math.Easing.Bounce.Out,
									y: this.sys.game.scale.height / 2,
								});

								this.canMove = false;
							}

							// Check if the game is won
							if (this.cards.length === 0) {
								this.sound.play("whoosh", { volume: 1.3 });
								this.sound.play("victory");

								this.add.tween({
									targets: winnerText,
									ease: Phaser.Math.Easing.Bounce.Out,
									y: this.sys.game.scale.height / 2,
								});
								this.canMove = false;
							}
						});
					} else if (
						this.cardOpened === undefined &&
						this.lives > 0 &&
						this.cards.length > 0
					) {
						// If there is not a card opened save the card selected
						card.flip(() => {
							this.canMove = true;
						});
						this.cardOpened = card;
					}
				}
			}
		});

		// Text events
		winnerText.on(Phaser.Input.Events.POINTER_OVER, () => {
			winnerText.setColor("#FF7F50");
			this.input.setDefaultCursor("pointer");
		});
		winnerText.on(Phaser.Input.Events.POINTER_OUT, () => {
			winnerText.setColor("#8c7ae6");
			this.input.setDefaultCursor("default");
		});
		winnerText.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.sound.play("whoosh", { volume: 1.3 });
			this.add.tween({
				targets: winnerText,
				ease: Phaser.Math.Easing.Bounce.InOut,
				y: -1000,
				onComplete: () => {
					this.restartGame();
				},
			});
		});

		gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
			gameOverText.setColor("#FF7F50");
			this.input.setDefaultCursor("pointer");
		});

		gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
			gameOverText.setColor("#8c7ae6");
			this.input.setDefaultCursor("default");
		});

		gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.add.tween({
				targets: gameOverText,
				ease: Phaser.Math.Easing.Bounce.InOut,
				y: -1000,
				onComplete: () => {
					this.restartGame();
				},
			});
		});
	}

	createCard({
		scene,
		x,
		y,
		frontTexture,
		cardName,
		scale = 1,
	}: {
		scene: Scene;
		x: number;
		y: number;
		frontTexture: string;
		cardName: string;
		scale?: number;
	}): Card {
		let isFlipping = false;
		const rotation = { y: 0 };

		const backTexture = "card-back";

		const card: any = scene.add
			.plane(x, y, backTexture)
			.setName(cardName)
			.setInteractive()
			.setScale(scale);

		// start with the card face down
		card.modelRotationY = 180;

		const flipCard = (callbackComplete?: () => void) => {
			if (isFlipping) {
				return;
			}
			scene.add.tween({
				targets: [rotation],
				y: rotation.y === 180 ? 0 : 180,
				ease: Phaser.Math.Easing.Expo.Out,
				duration: 500,
				onStart: () => {
					isFlipping = true;
					scene.sound.play("card-flip");
					scene.tweens.chain({
						targets: card,
						ease: Phaser.Math.Easing.Expo.InOut,
						tweens: [
							{
								duration: 200,
								scale: 1.1,
							},
							{
								duration: 300,
								scale: 1,
							},
						],
					});
				},
				onUpdate: () => {
					// card.modelRotation.y = Phaser.Math.DegToRad(180) + Phaser.Math.DegToRad(rotation.y);
					card.rotateY = 180 + rotation.y;
					const cardRotation = Math.floor(card.rotateY) % 360;
					if (
						(cardRotation >= 0 && cardRotation <= 90) ||
						(cardRotation >= 270 && cardRotation <= 359)
					) {
						card.setTexture(frontTexture);
					} else {
						card.setTexture(backTexture);
					}
				},
				onComplete: () => {
					isFlipping = false;
					if (callbackComplete) {
						callbackComplete();
					}
				},
			});
		};

		const destroy = () => {
			scene.add.tween({
				targets: [card],
				y: card.y - 1000,
				easing: Phaser.Math.Easing.Elastic.In,
				duration: 500,
				onComplete: () => {
					card.destroy();
				},
			});
		};

		return {
			gameObject: card,
			flip: flipCard,
			destroy,
			cardName,
		};
	}
}
