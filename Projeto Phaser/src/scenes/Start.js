export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        // Carregar o fundo do céu e as nuvens
        this.load.image('sky', 'assets/FundoJogo/CeuAzul.png');
        this.load.image('clouds', 'assets/FundoJogo/Nuvens.png');
        // Carregar o sprite do chão
        this.load.image('ground', 'assets/ChaoJogo/Chao1.png');
    }

    create() {
        // Fundo de céu azul (parado)
        this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
        // Nuvens (parallax)
        this.clouds = this.add.tileSprite(640, 200, 1280, 300, 'clouds').setScrollFactor(0);

        // Adicionar uma linha de blocos de chão perfeitamente conectados
        const groundY = 650; // Ajuste conforme necessário
        // Obter a largura real do sprite do chão
        const groundTexture = this.textures.get('ground');
        const blockWidth = groundTexture.getSourceImage().width;
        const numBlocks = Math.ceil(1280 / blockWidth); // Preencher toda a largura do jogo

        for (let i = 0; i < numBlocks; i++) {
            this.add.image(i * blockWidth, groundY, 'ground').setOrigin(0, 0);
        }
    }

    update() {
        // Parallax das nuvens
        if (this.clouds) {
            this.clouds.tilePositionX += 0.3;
        }
    }
    
}
