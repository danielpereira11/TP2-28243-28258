export class Instrucoes extends Phaser.Scene {
    constructor() {
        super({ key: 'Instrucoes' });
    }
    preload() {
        this.load.image('fundo', 'assets/Personagem/Idle.png');
    }
    create() {
        this.add.image(640, 360, 'fundo').setScale(1.5);

        this.add.text(550, 100, 'Instruções do Jogo', {
            fontSize: '40px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        })
        this.add.text(150, 180, 
`➡ Usa as teclas [←] e [→] para te moveres
➡ Usa a tecla [⬆] para saltar
➡ Usa a tecla [SHIFTESQ] para correr enquanto andas
➡ Usa a tecla [z] para atacar 
💀 Evita inimigos ou salta sobre eles/ ataca para os eliminar
❤️ Começas com 3 vidas
🕐 O tempo conta! Se chegar a 0, perdes 1 vida
🎯 Objetivo: chegar ao final do nível com o máximo de pontos`, 
        {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            lineSpacing: 10
        });
        const voltarBtn = this.add.text(550, 500, 'Voltar', {
            fontSize: '32px',
            fill: '#ffcc00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setInteractive();

        voltarBtn.on('pointerover', () => {
            voltarBtn.setStyle({ fill: '#ffff00' });
        });
        voltarBtn.on('pointerout', () => {
            voltarBtn.setStyle({ fill: '#ffcc00' });
        });

        voltarBtn.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }
}
