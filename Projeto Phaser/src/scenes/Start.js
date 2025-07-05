export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('sky', 'assets/FundoJogo/CeuAzul.png');
        this.load.image('clouds', 'assets/FundoJogo/Nuvens.png');
        this.load.image('ground', 'assets/ChaoJogo/Chao1.png');

        this.load.spritesheet('player_idle', 'assets/Personagem/Idle.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_run', 'assets/Personagem/Run.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_jump', 'assets/Personagem/Jump.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_fall', 'assets/Personagem/Fall.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_death', 'assets/Personagem/Death.png', { frameWidth: 80, frameHeight: 110 });

    }

    create() {
        this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
        this.clouds = this.add.tileSprite(640, 200, 1280, 300, 'clouds').setScrollFactor(0);

        const groundY = 650;
        const groundTexture = this.textures.get('ground');
        const blockWidth = groundTexture.getSourceImage().width;
        const numBlocks = Math.ceil(1280 / blockWidth);

        // ✅ Chão com física
        this.chao = this.physics.add.staticGroup();
        for (let i = 0; i < numBlocks; i++) {
            this.chao.create(i * blockWidth, groundY, 'ground').setOrigin(0, 0).refreshBody();
        }

        // ✅ Criar o jogador
        this.player = this.physics.add.sprite(100, 200, 'player_idle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        // ✅ Colisão com o chão
        this.physics.add.collider(this.player, this.chao);

        // ✅ Animações com base nos frames reais
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('player_fall', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'death', frames: this.anims.generateFrameNumbers('player_death', { start: 0, end: 0 }), frameRate: 5 });

        // ✅ Controlos
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.clouds) {
            this.clouds.tilePositionX += 0.3;
        }

        if (!this.player || !this.cursors) return;

        const noChao = this.player.body.blocked.down;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setFlipX(true);
            if (noChao) this.player.anims.play('run', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setFlipX(false);
            if (noChao) this.player.anims.play('run', true);
        }
        else {
            this.player.setVelocityX(0);
            if (noChao) this.player.anims.play('idle', true);
        }

        if (this.cursors.up.isDown && noChao) {
            this.player.setVelocityY(-330);
            this.player.anims.play('jump');
        }

        if (!noChao && this.player.body.velocity.y > 0) {
            this.player.anims.play('fall', true);
        }
    }
}
