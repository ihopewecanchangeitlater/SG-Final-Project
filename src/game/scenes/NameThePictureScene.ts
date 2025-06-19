// src/game/scenes/NameThePictureScene.ts
import Phaser from "phaser";

// ... (All code BEFORE showFeedbackPopup remains the same as your last provided version) ...
// Helper to decode HTML entities (like Σ for Σ)
function decodeHtmlEntities(text: string | any): string {
	if (typeof text !== "string") return text;
	const textArea = document.createElement("textarea");
	textArea.innerHTML = text;
	return textArea.value;
}

const gameTitle = decodeHtmlEntities("Τι βλέπεις στην φωτογραφία;");
const gameSubtitle = decodeHtmlEntities("Άσκηση αντιστοίχισης");
const gameInstructionsRaw = decodeHtmlEntities(
	'Επέλεξε τις λέξεις δίπλα στις εικόνες.<br />Μόλις τελειώσεις πάτα "Έλεγχος".'
);
const checkButtonText = decodeHtmlEntities("Έλεγχος");
const correctIndicator = decodeHtmlEntities(":-)");
const incorrectIndicator = decodeHtmlEntities("X");
const yourScoreIsText = decodeHtmlEntities("Βαθμολογία: ");
const correctResponseText = decodeHtmlEntities("Μπράβο!");
const incorrectResponseText = decodeHtmlEntities("Λυπάμαι! Δοκίμασε ξανά.");
const initialOptionText = decodeHtmlEntities("???");

interface ItemData {
	id: number;
	imageKey: string;
	imagePath: string;
	correctAnswer: string;
	imageWidth?: number;
	imageHeight?: number;
}
const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? "" : import.meta.env.BASE_URL;

const masterItemsData: ItemData[] = [
	/* ... your item data ... */
	{
		id: 0,
		imageKey: "dog",
		imagePath: `${baseUrl}/assets/images/name-the-picture/adorable-animal-breed-981062.jpg`,
		correctAnswer: decodeHtmlEntities("Σκύλος"),
	},
	{
		id: 1,
		imageKey: "car",
		imagePath: `${baseUrl}/assets/images/name-the-picture/adventure-automobile-car-849835.jpg`,
		correctAnswer: decodeHtmlEntities("Αμάξι"),
	},
	{
		id: 2,
		imageKey: "cat",
		imagePath: `${baseUrl}/assets/images/name-the-picture/manja-vitolic-gKXKBY-C-Dk-unsplash.jpg`,
		correctAnswer: decodeHtmlEntities("Γάτα"),
	},
	{
		id: 3,
		imageKey: "flag",
		imagePath: `${baseUrl}/assets/images/name-the-picture/america-american-flag-blue-sky-951382.jpg`,
		correctAnswer: decodeHtmlEntities("Σημαία"),
	},
	{
		id: 4,
		imageKey: "camera",
		imagePath: `${baseUrl}/assets/images/name-the-picture/aperture-blur-bokeh-1561081.jpg`,
		correctAnswer: decodeHtmlEntities("Φωτογραφική μηχανή"),
	},
	{
		id: 5,
		imageKey: "coffee",
		imagePath: `${baseUrl}/assets/images/name-the-picture/art-blur-cappuccino-302899.jpg`,
		correctAnswer: decodeHtmlEntities("Φλυτζάνι με καφέ"),
	},
	{
		id: 6,
		imageKey: "biscuits",
		imagePath: `${baseUrl}/assets/images/name-the-picture/background-black-colors-239581.jpg`,
		correctAnswer: decodeHtmlEntities("Μπισκότα"),
	},
	{
		id: 7,
		imageKey: "sandwich",
		imagePath: `${baseUrl}/assets/images/name-the-picture/beef-blur-bread-1053769.jpg`,
		correctAnswer: decodeHtmlEntities("Χάμπουγκερ-Σάντουιτς"),
	},
	{
		id: 8,
		imageKey: "watermelon",
		imagePath: `${baseUrl}/assets/images/name-the-picture/close-up-delicious-fruit-1068534.jpg`,
		correctAnswer: decodeHtmlEntities("Καρπούζι"),
	},
	{
		id: 9,
		imageKey: "motorbike",
		imagePath: `${baseUrl}/assets/images/name-the-picture/bike-broken-city-1045535.jpg`,
		correctAnswer: decodeHtmlEntities("Μηχανή"),
		imageHeight: 100,
	},
];

const allPossibleAnswers: string[] = [];
masterItemsData.forEach((item) => {
	if (!allPossibleAnswers.includes(item.correctAnswer)) {
		allPossibleAnswers.push(item.correctAnswer);
	}
});
Phaser.Utils.Array.Shuffle(allPossibleAnswers);

interface ItemElement {
	id: number;
	imageSprite: Phaser.GameObjects.Image;
	answerTextSprite: Phaser.GameObjects.Text;
	feedbackTextSprite: Phaser.GameObjects.Text | null;
	rowContainer: Phaser.GameObjects.Container;
	imageBorderGfx: Phaser.GameObjects.Graphics;
}

const ITEMS_PER_ROUND = 4;
const CAT_IMAGE_KEY = "cat";

const IMAGE_DISPLAY_WIDTH = 140;
const IMAGE_BORDER_PADDING = 4;

export class NameThePictureScene extends Phaser.Scene {
	private itemsToDisplayThisRound: ItemData[] = [];
	private selectedAnswers: { [key: number]: string | null } = {};
	private itemElements: ItemElement[] = [];
	private score: number = 0;
	private gameEnded: boolean = false;

	private wordChoicePanel: Phaser.GameObjects.Container | null = null;
	private activeItemElementForPanel: ItemElement | null = null;
	private checkButton!: Phaser.GameObjects.Text;
	private feedbackPopup: Phaser.GameObjects.Container | null = null;

	private levelKey?: string;

	constructor() {
		super({ key: "NameThePictureScene" });
	}

	//init() {
	init(data: { level?: string } = {}) {
		this.backButton();

		this.levelKey = data.level;

		this.gameEnded = false;
		this.score = 0;
		this.itemsToDisplayThisRound = [];
		this.selectedAnswers = {};
		this.itemElements.forEach((el) => {
			if (el.rowContainer && el.rowContainer.scene) el.rowContainer.destroy();
		});
		this.itemElements = [];

		if (this.wordChoicePanel && this.wordChoicePanel.scene)
			this.wordChoicePanel.destroy();
		this.wordChoicePanel = null;
		this.activeItemElementForPanel = null;

		if (this.checkButton && this.checkButton.scene) this.checkButton.destroy();
		if (this.feedbackPopup && this.feedbackPopup.scene)
			this.feedbackPopup.destroy();
		this.feedbackPopup = null;
	}

	preload() {
		masterItemsData.forEach((item) => {
			if (!this.textures.exists(item.imageKey)) {
				this.load.image(item.imageKey, item.imagePath);
			}
		});
	}

	create() {
		const gameWidth = this.cameras.main.width;
		const gameHeight = this.cameras.main.height;
		const topPadding = 30;
		const headerContentPadding = 40;
		const titleFontSize = 28;
		const subtitleFontSize = 20;
		const instructionFontSize = 16;

		const itemsColumnMarginLeft = 60;
		const itemsColumnVerticalPadding = 20;
		const itemRowVerticalSpacing = 20;
		const imageBorderThickness = 3;
		const answerTextWidth = 210;
		const elementSpacingInRow = 15;

		const checkButtonColumnMarginRight = 80;
		const checkButtonWidth = 150;

		let tempShuffledMasterList = Phaser.Utils.Array.Shuffle([
			...masterItemsData,
		]);
		this.itemsToDisplayThisRound = tempShuffledMasterList.slice(
			0,
			ITEMS_PER_ROUND
		);

		const catItemIndex = this.itemsToDisplayThisRound.findIndex(
			(item) => item.imageKey === CAT_IMAGE_KEY
		);
		if (catItemIndex > -1 && catItemIndex < ITEMS_PER_ROUND - 1) {
			const catItem = this.itemsToDisplayThisRound.splice(catItemIndex, 1)[0];
			this.itemsToDisplayThisRound.push(catItem);
		}

		let headerCurrentY = topPadding;

		this.add
			.text(gameWidth / 2, headerCurrentY, gameTitle, {
				fontSize: `${titleFontSize}px`,
				color: "#000000",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: gameWidth - headerContentPadding * 2 },
			})
			.setOrigin(0.5, 0);
		headerCurrentY += titleFontSize + 8;

		this.add
			.text(gameWidth / 2, headerCurrentY, gameSubtitle, {
				fontSize: `${subtitleFontSize}px`,
				color: "#111111",
				align: "center",
				wordWrap: { width: gameWidth - headerContentPadding * 2 },
			})
			.setOrigin(0.5, 0);
		headerCurrentY += subtitleFontSize + 12;

		const instructionsArray = gameInstructionsRaw
			.replace(/<br \/>/g, "\n")
			.split("\n");
		instructionsArray.forEach((line) => {
			this.add
				.text(gameWidth / 2, headerCurrentY, line, {
					fontSize: `${instructionFontSize}px`,
					color: "#333333",
					align: "center",
					wordWrap: { width: gameWidth - headerContentPadding * 2 },
				})
				.setOrigin(0.5, 0);
			headerCurrentY += instructionFontSize + 4;
		});

		let preCalcItemsBlockHeight = 0;
		this.itemsToDisplayThisRound.forEach((itemData) => {
			const tempImage = this.textures.get(itemData.imageKey).getSourceImage();
			let displayHeight =
				(tempImage.height / tempImage.width) * IMAGE_DISPLAY_WIDTH;
			if (itemData.imageHeight) displayHeight = itemData.imageHeight;
			preCalcItemsBlockHeight +=
				displayHeight +
				IMAGE_BORDER_PADDING * 2 +
				imageBorderThickness * 2 +
				itemRowVerticalSpacing;
		});
		if (this.itemsToDisplayThisRound.length > 0) {
			preCalcItemsBlockHeight -= itemRowVerticalSpacing;
		}

		const remainingSpaceY = gameHeight - headerCurrentY;
		const interactiveBlockStartY =
			headerCurrentY +
			Math.max(
				itemsColumnVerticalPadding,
				(remainingSpaceY - preCalcItemsBlockHeight) / 2
			);

		let itemsCurrentY = interactiveBlockStartY;
		const itemRowsStartX = itemsColumnMarginLeft;
		let actualItemsBlockHeight = 0;

		this.itemsToDisplayThisRound.forEach((itemData) => {
			const rowContainer = this.add.container(itemRowsStartX, itemsCurrentY);

			const tempImage = this.textures.get(itemData.imageKey).getSourceImage();
			let displayHeight =
				(tempImage.height / tempImage.width) * IMAGE_DISPLAY_WIDTH;
			if (itemData.imageHeight) displayHeight = itemData.imageHeight;

			const borderWidthWithPadding =
				IMAGE_DISPLAY_WIDTH + IMAGE_BORDER_PADDING * 2;
			const borderHeightWithPadding = displayHeight + IMAGE_BORDER_PADDING * 2;

			const imageBorderGfx = this.add.graphics();
			imageBorderGfx.lineStyle(imageBorderThickness, 0x888888, 1);
			imageBorderGfx.strokeRect(
				-IMAGE_BORDER_PADDING,
				-(displayHeight / 2) - IMAGE_BORDER_PADDING,
				borderWidthWithPadding,
				borderHeightWithPadding
			);
			rowContainer.add(imageBorderGfx);

			const img = this.add.image(0, 0, itemData.imageKey).setOrigin(0, 0.5);
			img.setDisplaySize(
				itemData.imageWidth || IMAGE_DISPLAY_WIDTH,
				displayHeight
			);
			rowContainer.add(img);

			const answerTextX =
				IMAGE_DISPLAY_WIDTH + IMAGE_BORDER_PADDING * 2 + elementSpacingInRow;
			const answerText = this.add
				.text(answerTextX, 0, initialOptionText, {
					fontSize: "17px",
					color: "#0000FF",
					backgroundColor: "#EEEEEE",
					padding: { x: 10, y: 5 },
					fixedWidth: answerTextWidth,
					align: "center",
				})
				.setOrigin(0, 0.5)
				.setInteractive({ useHandCursor: true });
			rowContainer.add(answerText);

			const currentItemElement: ItemElement = {
				id: itemData.id,
				imageSprite: img,
				answerTextSprite: answerText,
				feedbackTextSprite: null,
				rowContainer: rowContainer,
				imageBorderGfx: imageBorderGfx,
			};
			this.itemElements.push(currentItemElement);
			this.selectedAnswers[itemData.id] = null;

			answerText.on(Phaser.Input.Events.POINTER_DOWN, () => {
				if (this.gameEnded || (this.feedbackPopup && this.feedbackPopup.active))
					return;
				this.activeItemElementForPanel = currentItemElement;
				const globalAnswerTextBounds =
					currentItemElement.answerTextSprite.getBounds();
				this.showWordChoicePanel(
					globalAnswerTextBounds.right + 10,
					globalAnswerTextBounds.top - 5
				);
			});

			const currentRowVisualHeight =
				borderHeightWithPadding + imageBorderThickness * 2;
			itemsCurrentY += currentRowVisualHeight + itemRowVerticalSpacing;
			actualItemsBlockHeight += currentRowVisualHeight + itemRowVerticalSpacing;
		});
		if (this.itemsToDisplayThisRound.length > 0) {
			actualItemsBlockHeight -= itemRowVerticalSpacing;
		}

		const checkButtonX =
			gameWidth - checkButtonColumnMarginRight - checkButtonWidth / 2;
		const checkButtonY = interactiveBlockStartY + actualItemsBlockHeight / 2;

		this.checkButton = this.add
			.text(checkButtonX, checkButtonY, checkButtonText, {
				fontSize: "20px",
				color: "#FFFFFF",
				backgroundColor: "#28a745",
				padding: { x: 20, y: 10 },
				fixedWidth: checkButtonWidth,
				align: "center",
			})
			.setOrigin(0.5, 0.5);
		this.checkButton.setInteractive({ useHandCursor: true });
		this.checkButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
			if (this.gameEnded || (this.feedbackPopup && this.feedbackPopup.active))
				return;
			this.checkButton.setActive(false).setAlpha(0.7);
			this.checkAllAnswers();
		});
	}

	showWordChoicePanel(x: number, y: number) {
		// ... (This method remains the same) ...
		if (this.wordChoicePanel && this.wordChoicePanel.scene) {
			this.wordChoicePanel.destroy();
		}
		this.wordChoicePanel = null;

		const panelPadding = 10;
		const itemHeight = 35;
		const panelWidth = 250;
		const panelHeight =
			allPossibleAnswers.length * itemHeight + panelPadding * 2;

		let panelX = x;
		let panelY = y;

		if (panelX + panelWidth > this.cameras.main.width - panelPadding) {
			if (this.activeItemElementForPanel) {
				const bounds =
					this.activeItemElementForPanel.answerTextSprite.getBounds();
				panelX = bounds.left - panelWidth - panelPadding;
				if (panelX < panelPadding) panelX = panelPadding;
			} else {
				panelX = this.cameras.main.width - panelWidth - panelPadding;
			}
		}
		if (panelX < panelPadding) panelX = panelPadding;

		if (panelY + panelHeight > this.cameras.main.height - panelPadding) {
			panelY = this.cameras.main.height - panelHeight - panelPadding;
		}
		if (panelY < panelPadding) panelY = panelPadding;

		this.wordChoicePanel = this.add.container(panelX, panelY);
		this.wordChoicePanel.setDepth(1000);

		const background = this.add.graphics();
		background.fillStyle(0xf8f9fa, 0.98);
		background.fillRoundedRect(0, 0, panelWidth, panelHeight, 8);
		background.lineStyle(1, 0xadb5bd, 1);
		background.strokeRoundedRect(0, 0, panelWidth, panelHeight, 8);
		this.wordChoicePanel.add(background);

		allPossibleAnswers.forEach((word, index) => {
			const wordText = this.add
				.text(panelPadding, panelPadding + index * itemHeight, word, {
					fontSize: "17px",
					color: "#212529",
					padding: {
						top: (itemHeight - 17) / 2 - 1,
						bottom: (itemHeight - 17) / 2 + 1,
						x: 8,
					},
					fixedWidth: panelWidth - panelPadding * 2,
					align: "left",
				})
				.setInteractive({ useHandCursor: true });

			wordText.on(Phaser.Input.Events.POINTER_OVER, () =>
				wordText.setBackgroundColor("#E9ECEF")
			);
			wordText.on(Phaser.Input.Events.POINTER_OUT, () =>
				wordText.setBackgroundColor("rgba(0,0,0,0)")
			);

			wordText.on(Phaser.Input.Events.POINTER_DOWN, () => {
				if (this.activeItemElementForPanel) {
					this.activeItemElementForPanel.answerTextSprite.setText(word);
					this.selectedAnswers[this.activeItemElementForPanel.id] = word;
				}
				if (this.wordChoicePanel && this.wordChoicePanel.scene) {
					this.wordChoicePanel.destroy();
				}
				this.wordChoicePanel = null;
				this.activeItemElementForPanel = null;
			});

			if (this.wordChoicePanel) {
				this.wordChoicePanel.add(wordText);
			}
		});
	}

	checkAllAnswers() {
		// ... (This method remains largely the same, ensure score commenting is correct) ...
		if (this.gameEnded) return;
		this.gameEnded = true;
		if (this.wordChoicePanel && this.wordChoicePanel.scene) {
			this.wordChoicePanel.destroy();
		}
		this.wordChoicePanel = null;

		let correctCount = 0;
		const totalQuestions = this.itemsToDisplayThisRound.length;
		const imageBorderThickness = 3;

		this.itemElements.forEach((element) => {
			const originalItemData = masterItemsData.find((d) => d.id === element.id);
			if (!originalItemData) return;

			const selected = this.selectedAnswers[element.id];
			const isCorrect = selected === originalItemData.correctAnswer;

			const feedbackIndicator = isCorrect
				? correctIndicator
				: incorrectIndicator;
			const feedbackBorderColor = isCorrect ? 0x00cc00 : 0xff0000;

			element.imageBorderGfx.clear();
			element.imageBorderGfx.lineStyle(
				imageBorderThickness,
				feedbackBorderColor,
				1
			);

			const tempImage = this.textures
				.get(element.imageSprite.texture.key)
				.getSourceImage();
			let displayHeight =
				(tempImage.height / tempImage.width) * IMAGE_DISPLAY_WIDTH;
			const itemDataForBorder = this.itemsToDisplayThisRound.find(
				(it) => it.id === element.id
			);
			if (itemDataForBorder && itemDataForBorder.imageHeight)
				displayHeight = itemDataForBorder.imageHeight;

			const borderWidthWithPadding =
				IMAGE_DISPLAY_WIDTH + IMAGE_BORDER_PADDING * 2;
			const borderHeightWithPadding = displayHeight + IMAGE_BORDER_PADDING * 2;
			element.imageBorderGfx.strokeRect(
				-IMAGE_BORDER_PADDING,
				-(displayHeight / 2) - IMAGE_BORDER_PADDING,
				borderWidthWithPadding,
				borderHeightWithPadding
			);

			if (element.feedbackTextSprite && element.feedbackTextSprite.scene) {
				element.feedbackTextSprite.destroy();
			}
			const answerTextRightEdge =
				element.answerTextSprite.x + element.answerTextSprite.width;
			element.feedbackTextSprite = this.add
				.text(
					answerTextRightEdge + 8,
					element.answerTextSprite.y,
					feedbackIndicator,
					{
						fontSize: "20px",
						color: isCorrect ? "#009900" : "#FF0000",
						fontStyle: "bold",
					}
				)
				.setOrigin(0, 0.5);
			element.rowContainer.add(element.feedbackTextSprite);

			element.answerTextSprite.disableInteractive().setColor("#555555");
			if (isCorrect) correctCount++;
		});

		this.score = Math.floor((correctCount / totalQuestions) * 100);
		// let overallFeedbackMessage = `${yourScoreIsText}${this.score}%. `; // SCORE DISPLAY COMMENTED OUT
		let overallFeedbackMessage = ""; // Start with an empty message
		overallFeedbackMessage +=
			this.score === 100 ? correctResponseText : incorrectResponseText;

		this.showFeedbackPopup(overallFeedbackMessage);
	}

	showFeedbackPopup(message: string) {
		if (this.feedbackPopup && this.feedbackPopup.scene) {
			this.feedbackPopup.destroy();
		}

		const gameWidth = this.cameras.main.width;
		const checkButtonTopY =
			this.checkButton.y - this.checkButton.height * this.checkButton.originY; // Get precise top of check button
		const popupMarginFromButton = 15; // Gap between popup and check button

		// --- Define Popup Dimensions ---
		const popupWidth = gameWidth * 0.45; // Approx half screen, adjust as needed
		const popupHeight = 180;
		const panelPadding = 20;
		const buttonHeight = 38;
		// --- End Popup Dimensions ---

		// --- Calculate Popup Position ---
		// X: Position its center such that its left edge is roughly at gameWidth / 2
		const popupX = gameWidth / 2 + popupWidth / 2;
		// Y: Position its bottom edge above the check button
		const popupY = checkButtonTopY - popupMarginFromButton - popupHeight / 2;
		// --- End Position Calculation ---

		this.feedbackPopup = this.add.container(popupX, popupY);
		this.feedbackPopup.setDepth(900);

		const bg = this.add.graphics();
		bg.fillStyle(0xfafafa, 0.97);
		bg.fillRoundedRect(
			-popupWidth / 2,
			-popupHeight / 2,
			popupWidth,
			popupHeight,
			10
		);
		bg.lineStyle(2, 0xcccccc, 1);
		bg.strokeRoundedRect(
			-popupWidth / 2,
			-popupHeight / 2,
			popupWidth,
			popupHeight,
			10
		);
		this.feedbackPopup.add(bg);

		const feedbackText = this.add
			.text(0, -popupHeight / 2 + panelPadding + 5, message, {
				fontSize: "17px",
				color: "#333333",
				align: "center",
				wordWrap: { width: popupWidth - panelPadding * 2 },
			})
			.setOrigin(0.5, 0);
		this.feedbackPopup.add(feedbackText);

		const buttonsY = popupHeight / 2 - buttonHeight - panelPadding + 5;

		const playAgainButton = this.add
			.text(-popupWidth / 4, buttonsY, "Παίξε Ξανά", {
				fontSize: "15px",
				color: "#FFFFFF",
				backgroundColor: "#17A2B8",
				padding: { x: 10, y: (buttonHeight - 15) / 2 },
				fixedWidth: popupWidth / 2.2 - panelPadding, // Adjust button width based on new popupWidth
				align: "center",
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });
		playAgainButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
			if (this.feedbackPopup && this.feedbackPopup.scene)
				this.feedbackPopup.destroy();
			this.feedbackPopup = null;
			this.scene.restart();
		});
		this.feedbackPopup.add(playAgainButton);

		const closeButton = this.add
			.text(popupWidth / 4, buttonsY, "Κλείσιμο", {
				fontSize: "15px",
				color: "#FFFFFF",
				backgroundColor: "#6C757D",
				padding: { x: 10, y: (buttonHeight - 15) / 2 },
				fixedWidth: popupWidth / 2.2 - panelPadding, // Adjust button width
				align: "center",
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });
		closeButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
			if (this.feedbackPopup && this.feedbackPopup.scene)
				this.feedbackPopup.destroy();
			this.feedbackPopup = null;
			this.scene.start("Game");
		});
		this.feedbackPopup.add(closeButton);
	}

	backButton(): void {
		const mainMenuButton = this.add
			.text(25, 100, "Επιστροφή στο Μενού")
			.setStyle({
				fontSize: "16px",
				color: "#FFFFFF",
				backgroundColor: "#28a745",
				padding: { x: 10, y: 5 },
			})
			.setName("back-button")
			.setInteractive();

		mainMenuButton.on(Phaser.Input.Events.POINTER_OVER, () => {
			this.input.setDefaultCursor("pointer");
		});
		mainMenuButton.on(Phaser.Input.Events.POINTER_OUT, () => {
			this.input.setDefaultCursor("default");
		});
		mainMenuButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
			this.scene.start("MainMenu");
		});
	}
}
