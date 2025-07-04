export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        // Pode carregar aqui imagens do menu se quiser
    }

    create() {
        this.cameras.main.setBackgroundColor('#222');
        const title = this.add.text(640, 200, 'Overlord Rising', {
            fontSize: '64px',
            color: '#fff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        const startButton = this.add.text(640, 400, 'Iniciar Jogo', {
            fontSize: '48px',
            color: '#ff0',
            fontFamily: 'Arial',
            backgroundColor: '#444',
            padding: { left: 30, right: 30, top: 10, bottom: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startButton.on('pointerdown', () => {
            this.scene.start('Start');
        });

        startButton.on('pointerover', () => {
            startButton.setStyle({ color: '#fff', backgroundColor: '#666' });
        });
        startButton.on('pointerout', () => {
            startButton.setStyle({ color: '#ff0', backgroundColor: '#444' });
        });
    }
}
