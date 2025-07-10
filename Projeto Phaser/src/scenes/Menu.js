import { translations } from '../Tradu.js';

export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('fundoMenu', 'assets/FundoJogo/FundoMenu.png');
    }

    create() {
        const lang = localStorage.getItem('lang') || 'pt';
        const t = translations[lang];

       
        this.add.image(640, 360, 'fundoMenu').setOrigin(0.5).setDisplaySize(1280, 720);

       
        this.add.text(640, 100, t.title, {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5);

        
        const buttonStyle = {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#2c2c2c',
            padding: { left: 40, right: 40, top: 15, bottom: 15 },
            align: 'center',
            fixedWidth: 300,
        };

        const menuOptions = [
            { label: t.start, action: () => this.scene.start('Nivel2') },
            { label: t.settings, action: () => this.scene.start('Settings') },
            { label: t.instructions, action: () => this.scene.start('Instrucoes')},
            { label: t.credits, action: () => this.scene.start('Credits') },
        ];

        menuOptions.forEach((option, index) => {
            const button = this.add.text(640, 240 + index * 80, option.label, buttonStyle)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            button.on('pointerdown', option.action);

            button.on('pointerover', () => {
                button.setStyle({ backgroundColor: '#444', color: '#ffcc00' });
                this.tweens.add({
                    targets: button,
                    scale: 1.05,
                    duration: 150,
                    ease: 'Power2',
                });
            });

            button.on('pointerout', () => {
                button.setStyle({ backgroundColor: '#2c2c2c', color: '#ffffff' });
                this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 150,
                    ease: 'Power2',
                });
            });
        });
    }
}
