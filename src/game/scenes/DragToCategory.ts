import { Scene } from "phaser";

interface ItemData {
	name: string;
	image: string;
	category: string;
}

interface LevelData {
	categories: string[];
	items: ItemData[];
}

const levels: any = {
	"level-01": {
		categories: ["Ζώο", "Φαγητό"],
		items: [
			{
				name: "Κατσίκα",
				image: "assets/images/animal/goat.png",
				category: "Ζώο",
			},
			{
				name: "Κουνέλι",
				image: "assets/images/animal/rabbit.png",
				category: "Ζώο",
			},
			{
				name: "Μήλο",
				image: "assets/images/food/fruits/apple.png",
				category: "Φαγητό",
			},
			{
				name: "Κεράσια",
				image: "assets/images/food/fruits/cherries.png",
				category: "Φαγητό",
			},
			{
				name: "Γουρούνι",
				image: "assets/images/animal/pig.png",
				category: "Ζώο",
			},
			{
				name: "Σκύλος",
				image: "assets/images/animal/dog.png",
				category: "Ζώο",
			},
			{
				name: "Ελέφαντας",
				image: "assets/images/animal/elephant.png",
				category: "Ζώο",
			},
			{
				name: "Αγελάδα",
				image: "assets/images/animal/cow.png",
				category: "Ζώο",
			},
			{
				name: "Καμηλοπάρδαλη",
				image: "assets/images/animal/giraffe.png",
				category: "Ζώο",
			},
			{
				name: "Κρουασάν",
				image: "assets/images/food/sweets/croissant.png",
				category: "Φαγητό",
			},
			{
				name: "Μπισκότο",
				image: "assets/images/food/sweets/cookie.png",
				category: "Φαγητό",
			},
			{
				name: "Παγωτό",
				image: "assets/images/food/sweets/ice-cream.png",
				category: "Φαγητό",
			},
			{
				name: "Μπέικον",
				image: "assets/images/food/meat/bacon.png",
				category: "Φαγητό",
			},
			{
				name: "Λουκάνικο",
				image: "assets/images/food/meat/meat-sausage.png",
				category: "Φαγητό",
			},
		],
	},
	"level-02": {
		categories: ["Γλυκό", "Φρούτο", "Κρέας"],
		items: [
			{
				name: "Σταφύλι",
				image: "assets/images/food/fruits/grapes.png",
				category: "Φρούτο",
			},
			{
				name: "Μήλο",
				image: "assets/images/food/fruits/apple.png",
				category: "Φρούτο",
			},
			{
				name: "Κεράσια",
				image: "assets/images/food/fruits/cherries.png",
				category: "Φρούτο",
			},
			{
				name: "Ανανάς",
				image: "assets/images/food/fruits/pineapple.png",
				category: "Φρούτο",
			},
			{
				name: "Αχλάδι",
				image: "assets/images/food/fruits/pear.png",
				category: "Φρούτο",
			},
			{
				name: "Μπριζόλα",
				image: "assets/images/food/meat/meat-raw.png",
				category: "Κρέας",
			},
			{
				name: "Γαλοπούλα",
				image: "assets/images/food/meat/turkey.png",
				category: "Κρέας",
			},
			{
				name: "Ντόνατ",
				image: "assets/images/food/sweets/donut-sprinkles.png",
				category: "Γλυκό",
			},
			{
				name: "Τηγανίτες",
				image: "assets/images/food/sweets/pancakes.png",
				category: "Γλυκό",
			},
			{
				name: "Κρουασάν",
				image: "assets/images/food/sweets/croissant.png",
				category: "Γλυκό",
			},
			{
				name: "Μπισκότο",
				image: "assets/images/food/sweets/cookie.png",
				category: "Γλυκό",
			},
			{
				name: "Παγωτό",
				image: "assets/images/food/sweets/ice-cream.png",
				category: "Γλυκό",
			},
			{
				name: "Μπέικον",
				image: "assets/images/food/meat/bacon.png",
				category: "Κρέας",
			},
			{
				name: "Λουκάνικο",
				image: "assets/images/food/meat/meat-sausage.png",
				category: "Κρέας",
			},
		],
	},
	"level-03": {
		categories: ["Καλοκαίρι", "Άνοιξη", "Φθινώπορο", "Χειμώνας"],
		items: [
			{
				name: "Φθινοπωρινό δέντρο 01",
				image: "assets/images/season/autumn/autumn-01.png",
				category: "Φθινώπορο",
			},
			{
				name: "Φθινοπωρινό δέντρο 02",
				image: "assets/images/season/autumn/autumn-02.png",
				category: "Φθινώπορο",
			},
			{
				name: "Φθινοπωρινό δέντρο 03",
				image: "assets/images/season/autumn/autumn-03.png",
				category: "Φθινώπορο",
			},
			{
				name: "Λουλούδι",
				image: "assets/images/season/spring/spring-02.png",
				category: "Άνοιξη",
			},
			{
				name: "Ανοιξιάτικο δέντρο 01",
				image: "assets/images/season/spring/spring-03.png",
				category: "Άνοιξη",
			},
			{
				name: "Ανοιξιάτικο δέντρο 02",
				image: "assets/images/season/spring/spring-04.png",
				category: "Άνοιξη",
			},
			{
				name: "Ανοιξιάτικο δέντρο 03",
				image: "assets/images/season/spring/spring-05.png",
				category: "Άνοιξη",
			},
			{
				name: "Ψάρι 01",
				image: "assets/images/season/summer/summer-01.png",
				category: "Καλοκαίρι",
			},
			{
				name: "Ψάρι 02",
				image: "assets/images/season/summer/summer-02.png",
				category: "Καλοκαίρι",
			},
			{
				name: "Φύκια",
				image: "assets/images/season/summer/summer-03.png",
				category: "Καλοκαίρι",
			},
			{
				name: "Άμμος",
				image: "assets/images/season/summer/summer-04.png",
				category: "Καλοκαίρι",
			},
			{
				name: "Χειμερινό δέντρο 01",
				image: "assets/images/season/winter/winter-01.png",
				category: "Χειμώνας",
			},
			{
				name: "Χειμερινό δέντρο 02",
				image: "assets/images/season/winter/winter-02.png",
				category: "Χειμώνας",
			},
			{
				name: "Χειμερινό δέντρο 03",
				image: "assets/images/season/winter/winter-03.png",
				category: "Χειμώνας",
			},
		],
	},
};

export class DragToCategory extends Scene {
	private levelKey: string;
	private levelData!: LevelData;
	private dropZones: { [category: string]: Phaser.GameObjects.Zone } = {};
	private correctSound!: Phaser.Sound.BaseSound;
	private wrongSound!: Phaser.Sound.BaseSound;
	private victorySound!: Phaser.Sound.BaseSound;
	private correctCount: number = 0;
	private totalItems: number = 0;
	private helpPanelOpen: boolean = false;

	constructor() {
		super({ key: "DragToCategory" });
		this.levelKey = "level-01"; // default επίπεδο
	}

	init(data: { level: string }) {
		if (data.level) {
			this.levelKey = data.level;
		}
	}

	preload() {
		const isDev = process.env.NODE_ENV === "development";
		const baseUrl = isDev ? "" : import.meta.env.BASE_URL;
		// 1. Φορτώνουμε βασικά assets (ήχοι, icons)
		this.load.image("basket", `${baseUrl}/assets/images/objects/basket.png`);
		this.load.image("shelf", `${baseUrl}/assets/images/objects/shelf.png`);
		this.load.image("soundOn", `${baseUrl}/assets/ui/volume-icon.png`);
		this.load.image("soundOff", `${baseUrl}/assets/ui/volume-icon_off.png`);
		this.load.audio("correct", `${baseUrl}/assets/audio/correct.mp3`);
		this.load.audio("wrong", `${baseUrl}/assets/audio/wrong.mp3`);
		this.load.audio("victory", `${baseUrl}/assets/audio/victory.mp3`);

		// 2. Φορτώνουμε το JSON του επιπέδου (π.χ. level-02.json)
		this.levelData = levels[this.levelKey];

		if (!this.levelData) {
			console.error("Level data not found");
			this.scene.start("Game");
			return;
		}

		// Φορτώνουμε δυναμικά τα images από το JSON
		this.levelData.items.forEach((item) => {
			this.load.image(item.name, item.image);
		});

		// Όταν φορτωθούν και τα images, κάνε setup
		this.load.once("complete", () => {
			this.setupLevel();
		});

		// Ξεκίνα την αρχική φόρτωση JSON + στατικών assets
		this.load.start();
	}

	create() {
		this.cameras.main.setBackgroundColor("#8e8782");
		this.correctSound = this.sound.add("correct");
		this.wrongSound = this.sound.add("wrong");
		this.victorySound = this.sound.add("victory");

		this.createSoundToggle();
		this.createHelpIcon();
		this.createExitButton();
	}

	private setupLevel() {
		const width = this.scale.width;
		const height = this.scale.height;

		// Δημιουργία drop zones
		const categoryWidth = 280;
		const categoryHeight = 280;
		const spacing = width / (this.levelData.categories.length + 1);

		this.levelData.categories.forEach((category, index) => {
			const x = spacing * (index + 1);
			const y = height - 140;

			const dropZone = this.add
				.zone(x, y, categoryWidth, categoryHeight)
				.setRectangleDropZone(categoryWidth, categoryHeight)
				.setData("category", category);

			const basketImage = this.add
				.image(x, y, "basket")
				.setDisplaySize(categoryWidth, categoryHeight)
				.setDepth(1001);

			basketImage.setAlpha(0.85);

			this.add
				.text(x, y + categoryHeight / 3, category, {
					fontSize: "30px",
					color: "#fff",
					fontFamily: "Arial",
				})
				.setOrigin(0.5);

			this.dropZones[category] = dropZone;
		});

		const targetSize = 90;
		const draggableItems = this.levelData.items.map((item) => {
			const image = this.add
				.image(0, 0, item.name)
				.setData("category", item.category)
				.setInteractive({ draggable: true })
				.setName(item.name)
				.setOrigin(0.5, 0.1);

			// Ομοιόμορφη κλίμακα για όλα τα αντικείμενα
			const scale = Math.min(
				targetSize / image.width,
				targetSize / image.height
			);
			image.setScale(scale);

			this.input.setDraggable(image);
			return image;
		});

		this.totalItems = draggableItems.length;
		draggableItems.forEach((item) => {
			item.setAlpha(0);
			this.tweens.add({
				targets: item,
				alpha: 1,
				duration: 500,
				delay: Phaser.Math.Between(0, 300),
			});
		});

		const shelfY1 = 240; // y-συντεταγμένη 1ου ραφιού
		const shelfY2 = 380; // y-συντεταγμένη 2ου ραφιού

		const shelf1 = this.add
			.image(width / 2, shelfY1, "shelf")
			.setOrigin(0.5, 0.5);
		shelf1.setDisplaySize(920, 40);
		shelf1.setDepth(0);

		const shelf2 = this.add
			.image(width / 2, shelfY2, "shelf")
			.setOrigin(0.5, 0.5);
		shelf2.setDisplaySize(920, 40);
		shelf2.setDepth(0);

		// Τοποθέτηση σε grid
		Phaser.Utils.Array.Shuffle(draggableItems);
		Phaser.Actions.GridAlign(draggableItems, {
			width: 7,
			cellWidth: 120,
			cellHeight: 120,
			x: 110,
			y: 140,
		});

		this.setupAssistAnimation(draggableItems);

		draggableItems.forEach((item) => {
			let hoverTimer: Phaser.Time.TimerEvent | null = null;
			let tooltipText: Phaser.GameObjects.Text | null = null;

			// Flag για το αν το αντικείμενο έχει ήδη χρησιμοποιηθεί
			item.setData("used", false);

			item.on("pointerover", () => {
				// Αν το αντικείμενο είναι ήδη "used", δεν κάνουμε τίποτα
				if (item.getData("used")) return;

				// Δημιουργούμε το timer για το tooltip μετά από 2 δευτερόλεπτα
				hoverTimer = item.scene.time.delayedCall(2000, () => {
					const category = item.getData("category");
					tooltipText = item.scene.add
						.text(item.x, item.y - 20, `Κατηγορία: ${category}`, {
							fontSize: "18px",
							color: "#ffffff",
							backgroundColor: "#000000",
							padding: { x: 10, y: 5 },
						})
						.setOrigin(0.5)
						.setDepth(3000);
				});
			});

			item.on("pointerout", () => {
				// Ακυρώνουμε το timer αν ο χρήστης βγει γρήγορα από το hover
				if (hoverTimer) {
					hoverTimer.remove(false);
					hoverTimer = null;
				}
				// Καταστρέφουμε το tooltip αν υπάρχει
				if (tooltipText) {
					tooltipText.destroy();
					tooltipText = null;
				}
			});

			// Θέτουμε το flag 'used' όταν το αντικείμενο πέσει σωστά
			item.on("dragstart", () => {
				// Εδώ μπορούμε αν θέλουμε να απενεργοποιήσουμε το tooltip κατά το drag
				if (hoverTimer) {
					hoverTimer.remove(false);
					hoverTimer = null;
				}
				if (tooltipText) {
					tooltipText.destroy();
					tooltipText = null;
				}
			});

			item.setDepth(1);
		});

		// Drag and drop handlers
		this.input.on(
			"dragstart",
			(
				_pointer: Phaser.Input.Pointer,
				gameObject: Phaser.GameObjects.Image
			) => {
				this.input.manager.canvas.style.cursor = "grabbing";
				gameObject.setDepth(1000);
			}
		);

		this.input.on(
			"drag",
			(
				_pointer: Phaser.Input.Pointer,
				gameObject: Phaser.GameObjects.Image,
				dragX: number,
				dragY: number
			) => {
				this.input.manager.canvas.style.cursor = "default";

				gameObject.x = dragX;
				gameObject.y = dragY;
			}
		);

		this.input.on(
			"dragend",
			(
				_pointer: Phaser.Input.Pointer,
				gameObject: Phaser.GameObjects.Image,
				dropped: boolean
			) => {
				this.input.manager.canvas.style.cursor = "default";

				if (!dropped) {
					gameObject.setDepth(0);
					gameObject.setPosition(
						gameObject.input!.dragStartX,
						gameObject.input!.dragStartY
					);
				}
			}
		);

		this.input.on(
			"drop",
			(
				_pointer: Phaser.Input.Pointer,
				gameObject: Phaser.GameObjects.Image,
				dropZone: Phaser.GameObjects.Zone
			) => {
				const correctCategory = gameObject.getData("category");
				const dropCategory = dropZone.getData("category");

				if (correctCategory === dropCategory) {
					gameObject.disableInteractive();
					gameObject.setPosition(dropZone.x, dropZone.y);
					this.correctSound.play();
					this.correctCount++;

					gameObject.setData("used", true);

					if (this.correctCount === this.totalItems) {
						this.onLevelComplete();
					}
				} else {
					gameObject.setPosition(
						gameObject.input!.dragStartX,
						gameObject.input!.dragStartY
					);
					this.wrongSound.play();
				}
			}
		);
	}

	private setupAssistAnimation(draggableItems: Phaser.GameObjects.Image[]) {
		const assistItem = draggableItems.find(
			(item) => item.getData("category") === this.levelData.categories[0]
		);
		const assistZone = this.dropZones[this.levelData.categories[0]];

		if (assistItem && assistZone) {
			// Αποθήκευσε ΜΟΝΟ αν δεν υπάρχει ήδη
			if (!assistItem.getData("originalX")) {
				assistItem.setData("originalX", assistItem.x);
				assistItem.setData("originalY", assistItem.y);
			}

			this.tweens.add({
				targets: assistItem,
				x: assistZone.x,
				y: assistZone.y,
				duration: 1000,
				yoyo: true,
				repeat: 0,
				delay: 500,
				onStart: () => assistItem.setDepth(2000),
				onComplete: () => {
					assistItem.setPosition(
						assistItem.getData("originalX"),
						assistItem.getData("originalY")
					);
					assistItem.setDepth(1);
				},
			});
		}
	}

	private createSoundToggle() {
		let isSoundOn = true;

		const soundIcon = this.add
			.image(80, 50, "soundOn")
			.setDisplaySize(50, 50)
			.setOrigin(1, 0)
			.setInteractive({ useHandCursor: true })
			.setDepth(1000);

		soundIcon.on("pointerdown", () => {
			isSoundOn = !isSoundOn;
			soundIcon.setTexture(isSoundOn ? "soundOn" : "soundOff");
			this.sound.mute = !isSoundOn;
		});
	}

	private createHelpIcon() {
		const helpIcon = this.add
			.text(this.scale.width - 30, 50, "?", {
				fontSize: "32px",
				color: "#000",
				backgroundColor: "#fff",
				padding: { x: 10, y: 5 },
			})
			.setOrigin(1, 0)
			.setDepth(1000)
			.setInteractive({ useHandCursor: true });

		helpIcon.on("pointerdown", () => this.showHelpPanel());
	}

	private showHelpPanel() {
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
				"Σύρε τα αντικείμενα στη σωστή κατηγορία\nκαι διασκέδασε μαθαίνοντας!\n\nΑν κάνεις λάθος, μην ανησυχείς, \nμπορείς πάντα να προσπαθήσεις ξανά!",
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

	private onLevelComplete() {
		this.victorySound.play();

		const width = this.scale.width;
		const height = this.scale.height;

		// Στρογγυλεμένο panel με σκιά
		const panel = this.add.graphics().setDepth(1000);

		// Σκιά
		panel.fillStyle(0x000000, 0.4);
		panel.fillRoundedRect(width / 2 - 202, height / 2 - 102, 404, 204, 20);

		// Κύριο panel
		panel.fillStyle(0x333333, 0.9);
		panel.fillRoundedRect(width / 2 - 200, height / 2 - 100, 400, 200, 20);

		// Κείμενο επιβράβευσης με ήρεμο τόνο
		const text = this.add
			.text(
				width / 2,
				height / 2,
				"Το ολοκλήρωσες με επιτυχία.\nΣυγχαρητήρια!",
				{
					fontSize: "26px",
					fontFamily: "Arial",
					color: "#ffffff",
					align: "center",
					wordWrap: { width: 360 },
					lineSpacing: 10,
				}
			)
			.setOrigin(0.5)
			.setDepth(1001);

		// Επιστροφή στο μενού
		this.time.delayedCall(5000, () => {
			panel.destroy();
			text.destroy();
			this.scene.start("Game");
		});
	}

	private createExitButton() {
		const exitButton = this.add
			.text(this.scale.width - 80, 50, "Έξοδος", {
				fontSize: "24px",
				color: "#ffffff",
				backgroundColor: "#cc0000",
				padding: { x: 10, y: 7 },
				fontFamily: "Arial",
			})
			.setOrigin(1, 0)
			.setInteractive({ useHandCursor: true })
			.setDepth(1000);

		exitButton.on("pointerover", () =>
			exitButton.setStyle({ backgroundColor: "#ff3333" })
		);
		exitButton.on("pointerout", () =>
			exitButton.setStyle({ backgroundColor: "#cc0000" })
		);

		exitButton.on("pointerdown", () => {
			this.scene.start("Game");
		});
	}
}
