import { Menu } from './scenes/Menu.js';
import { Settings } from './scenes/Settings.js';
import { Start } from './scenes/Start.js';
import { Nivel2 } from './scenes/Nivel2.js';
import { Nivel3 } from './scenes/Nivel3.js'; 
import { Instrucoes } from './scenes/Instrucoes.js';


const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#4488aa',
    pixelArt: false,

    scene: [Menu,Nivel2, Nivel3, Start, Settings, Instrucoes],


     
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: true,
        }
    },
    
  
    

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
