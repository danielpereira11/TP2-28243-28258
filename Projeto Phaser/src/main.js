import { Menu } from './scenes/Menu.js';
import { Settings } from './scenes/Settings.js';
import { Start } from './scenes/Start.js'; // Certifique-se de que esta cena existe
 // Opcional, se já tiveres esta cena

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#4488aa',
    pixelArt: false,

    scene: [Menu, Start, Settings],


     
    // ✅ ATIVAR A FÍSICA
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    
  
    

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
