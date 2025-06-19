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

export class FindThePairs extends Scene {
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
		x: 200, // or 150–250 based on your visual layout
		y: 150,
		paddingX: 20,
		paddingY: 20,
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

	mute = false;

	constructor() {
		super({
			key: "FindThePairs",
		});
	}

	init(data: { level: string }) {
		this.cameras.main.fadeIn(500);
		if (data.level) {
			this.selectedDifficulty = this.difficultySettings[data.level];
		}
	}

	preload() {
		const isDev = process.env.NODE_ENV === "development";
		const baseUrl = isDev ? "" : import.meta.env.BASE_URL;

		this.load.setPath(`${baseUrl}/assets/audio`);
		this.load.audio("theme-song", "fat-caps-audionatix.mp3");
		this.load.audio("whoosh", "whoosh.mp3");
		this.load.audio("card-flip", "card-flip.mp3");
		this.load.audio("card-match", "card-match.mp3");
		this.load.audio("card-mismatch", "card-mismatch.mp3");
		this.load.audio("card-slide", "card-slide.mp3");
		this.load.audio("victory", "victory.mp3");

		this.load.setPath(`${baseUrl}/assets/images/cards`);
		this.load.image("card-back", "card-back.png");
		this.cardNames.forEach((cardName) => {
			this.load.image(cardName, `${cardName}.png`);
		});

		this.load.setPath(`${baseUrl}/assets/ui`);
		this.load.image("volume-icon", "volume-icon.png");
		this.load.image("volume-icon_off", "volume-icon_off.png");
		this.load.image("heart", "heart.png");
		this.load.image("back-button", "back-button.png");
	}

	create() {
		this.createHelpIcon();
		this.backButton();
		this.volumeButton();

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
		this.cards.forEach((card) => {
			card.gameObject.on(Phaser.Input.Events.POINTER_OVER, () => {
				this.input.setDefaultCursor("pointer");
			});
			card.gameObject.on(Phaser.Input.Events.POINTER_OUT, () => {
				this.input.setDefaultCursor("default");
			});
			card.gameObject.on(Phaser.Input.Events.POINTER_DOWN, () => {
				this.gameLogic(card, hearts, gameOverText);
			});
		});

		// Start canMove
		this.time.addEvent({
			delay: 200 * this.cards.length,
			callback: () => {
				this.canMove = true;
			},
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

	gameLogic(
		card: Card,
		hearts: HeartList,
		gameOverText: GameObjects.Text
	): void {
		this.canMove = false;

		// Detect if there is a card opened
		if (this.cardOpened !== undefined) {
			// If the card is the same that the opened not do anything
			if (
				this.cardOpened.gameObject.x === card.gameObject.x &&
				this.cardOpened.gameObject.y === card.gameObject.y
			) {
				this.canMove = true;
				return;
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
						(cardLocal) => cardLocal !== this.cardOpened && cardLocal !== card
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
					card.flip(() => {
						this.cardOpened?.flip(() => {
							this.cardOpened = undefined;
							this.canMove = true;
						});
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

		const baseCardWidth = 158;
		const baseCardHeight = 204;

		const availableWidth = 800;
		const availableHeight = 600;

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
		const margin = 50;
		const centerX = this.sys.game.scale.width / 2;
		const startX =
			centerX - (this.selectedDifficulty.lives * margin) / 2 + margin / 2;
		return Array.from(new Array(this.lives)).map((_, index) => {
			const heart = this.add
				.image(this.sys.game.scale.width + 1000, 20, "heart")
				.setScale(2);
			this.add.tween({
				targets: heart,
				ease: Phaser.Math.Easing.Expo.InOut,
				duration: 1000,
				delay: 1000 + index * 200,
				x: startX + index * margin,
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
			.text(this.scale.width - 10, 5, "?", {
				fontSize: "32px",
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
			.image(25, 40, "volume-icon")
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
			if (this.mute) {
				this.sound.setVolume(1);
				volumeIcon.setTexture("volume-icon");
				volumeIcon.setAlpha(1);
				this.mute = false;
			} else {
				this.sound.setVolume(0);
				volumeIcon.setTexture("volume-icon_off");
				volumeIcon.setAlpha(0.5);
				this.mute = true;
			}
		});
	}

	backButton(): void {
		const mainMenuButton = this.add
			.image(25, 100, "back-button")
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
			this.scene.start("MainMenu");
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
