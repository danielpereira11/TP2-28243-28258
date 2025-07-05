export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        this.vidas = 3;
        this.isDead = false;
        this.gameOverShown = false;
    }

    preload() {
        this.load.image('sky', 'assets/FundoJogo/CeuAzul.png');
        this.load.image('clouds', 'assets/FundoJogo/Nuvens.png');
        this.load.image('ground', 'assets/ChaoJogo/Chao1.png');
        this.load.image('ground2', 'assets/ChaoJogo/Chao2.png');
        this.load.image('plataformaE', 'assets/ChaoJogo/PontaPlataformaE.png');
        this.load.image('plataformaD', 'assets/ChaoJogo/PontaPlataformaD.png');
        this.load.image('plataformaAltE', 'assets/ChaoJogo/PontaPlataformaAltE.png');
        this.load.image('plataformaAltD', 'assets/ChaoJogo/PontaPlataformaAltD.png');
        this.load.image('head', 'assets/HUD/head.png');

        this.load.spritesheet('player_idle', 'assets/Personagem/Idle.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_run', 'assets/Personagem/Run.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_jump', 'assets/Personagem/Jump.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_fall', 'assets/Personagem/Fall.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_death', 'assets/Personagem/Death.png', { frameWidth: 80, frameHeight: 110 });
    }

    create() {
        this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
        this.clouds = this.add.tileSprite(640, 200, 1280, 300, 'clouds').setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.physics.world.setBounds(0, 0, 10000, 820);

        const groundY = 650;
        const groundTexture = this.textures.get('ground');
        const blockWidth = groundTexture.getSourceImage().width;
        const numBlocks = Math.ceil(10000 / blockWidth);

        this.chao = this.physics.add.staticGroup();
        this.plataformasFlutuantes = this.physics.add.staticGroup();

        const blocosElevados = [
            [28, 480], [29, 480], [30, 480],
        ];

        for (let [i, y] of blocosElevados) {
            this.chao.create(i * blockWidth, y, 'ground').setOrigin(0, 0).refreshBody();
        }

        const blocosManuais = new Set(blocosElevados.map(([i]) => i));
        const buracos = new Set([6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);

        for (let i = 0; i < numBlocks; i++) {
            if (!blocosManuais.has(i) && !buracos.has(i)) {
                this.chao.create(i * blockWidth, groundY, 'ground').setOrigin(0, 0).refreshBody();
            }
        }

        const blocosSuporte = [];
        for (let i = 28; i <= 30; i++) {
            for (let y = 515; y <= 655; y += 35) {
                blocosSuporte.push([i, y]);
            }
        }

        for (let [i, y] of blocosSuporte) {
            this.chao.create(i * blockWidth, y, 'ground2').setOrigin(0, 0).refreshBody();
        }

        const plataformasFlutuantes = [
            [550, 630, 'plataformaE'],
            [620, 630, 'ground'],
            [690, 630, 'plataformaD'],
            [1500, 600, 'plataformaAltE'],
            [1570, 600, 'plataformaAltD'],
            [1700, 550, 'plataformaAltE'],
            [1770, 550, 'plataformaAltD'],
            [2900, 630, 'plataformaE'],
            [2970, 630, 'plataformaD'],
            [3150, 560, 'plataformaE'],
            [3220, 560, 'plataformaD'],
            [2900, 470, 'plataformaE'],
            [2970, 470, 'plataformaD'],
            [2660, 380, 'plataformaE'],
            [2730, 380, 'plataformaD'],
            [2430, 290, 'plataformaAltE'],
            [2500, 290, 'plataformaAltD'],
            [3400, 560, 'plataformaE'],
            [3470, 560, 'plataformaD'],
        ];

        for (let [x, y, texture] of plataformasFlutuantes) {
            const bloco = this.plataformasFlutuantes.create(x, y, texture).setOrigin(0, 0).refreshBody();
            bloco.body.checkCollision.down = false;
        }

        this.player = this.physics.add.sprite(100, 200, 'player_idle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 1, 1, -300, 0);
        this.physics.add.collider(this.player, this.chao);
        this.physics.add.collider(this.player, this.plataformasFlutuantes);

        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('player_fall', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'death', frames: this.anims.generateFrameNumbers('player_death', { start: 0, end: 0 }), frameRate: 5 });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.headIcon = this.add.image(1200, 40, 'head').setScrollFactor(0).setScale(0.6).setOrigin(1, 0);
        this.vidasText = this.add.text(1210, 40, 'x ' + this.vidas, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setScrollFactor(0);
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
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setFlipX(false);
            if (noChao) this.player.anims.play('run', true);
        } else {
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

        if (this.player.y > 720 && !this.isDead) {
            this.perderVida();
        }
    }

    perderVida() {
        this.vidas--;
        if (this.vidas >= 0) {
            this.vidasText.setText('x ' + this.vidas);
        }

        if (this.vidas > 0) {
            this.respawnJogador();
        } else if (!this.gameOverShown) {
            this.isDead = true;
            this.gameOverShown = true;

            this.player.setTint(0xff0000);
            this.player.anims.play('death');

            const gameOverText = this.add.text(
                this.cameras.main.scrollX + 640, 300,
                'GAME OVER',
                {
                    fontSize: '64px',
                    fill: '#ff0000',
                    fontFamily: 'Arial',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            ).setOrigin(0.5);

            this.time.delayedCall(2000, () => {
                this.scene.start('Menu'); 
            });
        }
    }

    respawnJogador() {
        this.player.setVelocity(0, 0);
        this.player.setPosition(100, 200);
        this.player.clearTint();
    }
}
