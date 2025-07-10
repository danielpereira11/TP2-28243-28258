import { translations } from '../Tradu.js';

export class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }

    create() {
        let lang = localStorage.getItem('lang') || 'pt';
        const t = translations[lang];

        this.cameras.main.setBackgroundColor('#111');

        this.add.text(640, 100, t.settingsTitle, {
            fontSize: '48px',
            color: '#fff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

       
        this.add.text(300, 200, t.controls, {
            fontSize: '32px',
            color: '#fff',
        });

        const changeControlsBtn = this.add.text(600, 200, t.change, {
            fontSize: '28px',
            color: '#ff0',
            backgroundColor: '#444',
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive({ useHandCursor: true }).setOrigin(0.5);

        changeControlsBtn.on('pointerdown', () => {
            console.log('Alterar controles');
        });

   
        this.add.text(300, 280, t.volume, {
            fontSize: '32px',
            color: '#fff',
        });

        const volumeDown = this.add.text(550, 280, '-', {
            fontSize: '32px',
            color: '#fff',
        }).setInteractive().setOrigin(0.5);

        const volumeUp = this.add.text(650, 280, '+', {
            fontSize: '32px',
            color: '#fff',
        }).setInteractive().setOrigin(0.5);

        let volume = 5;
        const volumeText = this.add.text(600, 280, volume.toString(), {
            fontSize: '32px',
            color: '#ff0',
        }).setOrigin(0.5);

        volumeDown.on('pointerdown', () => {
            if (volume > 0) volume--;
            volumeText.setText(volume.toString());
        });

        volumeUp.on('pointerdown', () => {
            if (volume < 10) volume++;
            volumeText.setText(volume.toString());
        });

     
        this.add.text(300, 360, t.language, {
            fontSize: '32px',
            color: '#fff',
        });

        const languageBtn = this.add.text(600, 360, lang === 'pt' ? t.portuguese : t.english, {
            fontSize: '28px',
            color: '#ff0',
            backgroundColor: '#444',
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive({ useHandCursor: true }).setOrigin(0.5);

        languageBtn.on('pointerdown', () => {
            lang = lang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('lang', lang);
            this.scene.restart();
        });

       
        const backBtn = this.add.text(640, 500, t.back, {
            fontSize: '32px',
            color: '#fff',
            backgroundColor: '#333',
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive({ useHandCursor: true }).setOrigin(0.5);

        backBtn.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }
}
