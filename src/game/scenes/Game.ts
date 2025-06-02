import { Scene } from 'phaser';

interface GameInfo {
    key: string;
    name: string;
    levels: string[];
}

export class Game extends Scene {
    private games: GameInfo[] = [
        { key: 'DragToCategory', name: 'Βρες την Κατηγορία', levels: ['level-01', 'level-02'] },
        // πρόσθεσε και άλλα παιχνίδια εδώ...
    ];

    private currentMenu: 'games' | 'levels' = 'games';
    private selectedGame?: GameInfo;

    private titleText!: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Container[] = [];
    private backButton?: Phaser.GameObjects.Container;

    constructor() {
        super('Game');
    }

    create() {
        const centerX = this.cameras.main.width / 2;

        this.titleText = this.add.text(centerX, 100, 'Επίλεξε Παιχνίδι', {
            fontFamily: 'Segoe UI',
            fontSize: 40,
            color: '#4a3c31',
            stroke: '#9c8b70',
            strokeThickness: 2,
        }).setOrigin(0.5);

        this.cameras.main.setBackgroundColor(0xf2efe9);

        this.showGamesMenu();
    }

    private clearButtons() {
        this.buttons.forEach(btn => btn.destroy());
        this.buttons = [];
        if (this.backButton) {
            this.backButton.destroy();
            this.backButton = undefined;
        }
    }

    private showGamesMenu() {
        this.currentMenu = 'games';
        this.selectedGame = undefined;
        this.titleText.setText('Επίλεξε Παιχνίδι');

        this.clearButtons();

        const centerX = this.cameras.main.width / 2;
        const startY = 220;
        const spacingY = 90;

        this.games.forEach((game, idx) => {
            const btn = this.createButton(centerX, startY + idx * spacingY, game.name);
            btn.on('pointerdown', () => this.showLevelsMenu(game));
            this.buttons.push(btn);
        });
    }

    private showLevelsMenu(game: GameInfo) {
        this.currentMenu = 'levels';
        this.selectedGame = game;
        this.titleText.setText(`Επίλεξε Επίπεδο για το "${game.name}"`);

        this.clearButtons();

        const centerY = 280;
        const spacingX = 220; // απόσταση ανάμεσα στα κουμπιά
        const totalWidth = (game.levels.length - 1) * spacingX;
        const centerX = this.cameras.main.width / 2;

        game.levels.forEach((levelKey, idx) => {
            const levelName = `Επίπεδο ${idx + 1}`;
            const x = centerX - totalWidth / 2 + idx * spacingX;
            const btn = this.createButton(x, centerY, levelName);
            btn.on('pointerdown', () => {
                this.scene.start(game.key, { level: levelKey });
            });
            this.buttons.push(btn);
        });

        // Κουμπί επιστροφής κάτω από τα επίπεδα, κεντραρισμένο
        this.backButton = this.createButton(centerX, centerY + 100, '← Πίσω');
        this.backButton.on('pointerdown', () => this.showGamesMenu());
    }

    private createButton(x: number, y: number, text: string): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        // Δημιουργούμε προσωρινό text για μέτρηση πλάτους
        const tempText = this.add.text(0, 0, text, {
            fontFamily: 'Segoe UI',
            fontSize: '20px',
            color: '#4a3c31',
        }).setOrigin(0.5);

        const paddingX = 40;
        const paddingY = 20;
        const width = tempText.width + paddingX;
        const height = tempText.height + paddingY;
        const radius = 20;

        tempText.destroy();

        const bg = this.add.graphics();
        bg.fillStyle(0xbfae94, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);

        const btnText = this.add.text(0, 0, text, {
            fontFamily: 'Segoe UI',
            fontSize: '20px',
            color: '#4a3c31',
        }).setOrigin(0.5);

        container.add([bg, btnText]);

        container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0x9c8b70, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0xbfae94, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
        });

        return container;
    }
}
