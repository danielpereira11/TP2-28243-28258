export class Nivel2 extends Phaser.Scene {

    constructor() {
        super('Nivel2');
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
        this.load.image('vida', 'assets/HUD/vida.png');
        this.load.image('checkpoint', 'assets/HUD/checkpoint.png');

        this.load.spritesheet('player_idle', 'assets/Personagem/Idle.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_run', 'assets/Personagem/Run.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_jump', 'assets/Personagem/Jump.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_fall', 'assets/Personagem/Fall.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_death', 'assets/Personagem/Death.png', { frameWidth: 80, frameHeight: 110 });
    }

    create() {
        this.vidas = 3;
        this.isDead = false;
        this.gameOverShown = false;
        this.checkpointAtivado = false;
        this.checkpointX = 100;
        this.checkpointY = 200;
        this.plataformaAtual = null;

        this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
        this.clouds = this.add.tileSprite(640, 200, 1280, 300, 'clouds').setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, 15000, 720);
        this.physics.world.setBounds(0, 0, 15000, 820);

        const blockWidth = this.textures.get('ground').getSourceImage().width;
        const groundY = 650;
        const numBlocks = Math.ceil(15000 / blockWidth);

        this.chao = this.physics.add.staticGroup();
        this.plataformasFlutuantes = this.physics.add.staticGroup();
        this.plataformasCaem = this.physics.add.group({ allowGravity: false, immovable: true });
        this.plataformasMoveis = this.add.group();

        const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const buracos = new Set([
            ...range(7, 51),
            ...range(85, 150),
            ...range(165, 210)
        ]);

        for (let i = 0; i < numBlocks; i++) {
            if (!buracos.has(i)) {
                this.chao.create(i * blockWidth, groundY, 'ground').setOrigin(0, 0).refreshBody();
            }
        }

        const plataformasFlutuantes = [
            [600, 560, 'plataformaE'], [670, 560, 'plataformaD'],
            [900, 530, 'plataformaAltE'], [970, 530, 'ground'], [1040, 530, 'plataformaAltD'],
            [1300, 500, 'plataformaE'], [1370, 500, 'plataformaD'],
            [1750, 460, 'plataformaAltE'], [1820, 460, 'plataformaAltD'],
            [2265, 560, 'plataformaE'], [2335, 560, 'plataformaD'],
            [2500, 490, 'plataformaE'], [2570, 490, 'plataformaD'],
            [2240, 420, 'plataformaE'], [2310, 420, 'plataformaD'],
            [2560, 350, 'plataformaE'], [2630, 350, 'plataformaD'],
            [2960, 280, 'plataformaE'], [3030, 280, 'plataformaD'],
            [12600, 550, 'plataformaE'], [12670, 550, 'plataformaD']
        ];

        for (let [x, y, texture] of plataformasFlutuantes) {
            const plataforma = this.plataformasFlutuantes.create(x, y, texture).setOrigin(0, 0).refreshBody();
             plataforma.body.checkCollision.up = true;
    plataforma.body.checkCollision.down = false;
    plataforma.body.checkCollision.left = false;
    plataforma.body.checkCollision.right = false;
        }

        const blocosElevados = [
            [55, 580], [56, 510], [57, 440], [58, 370] ,
            ...range(59, 84).map(i => [i, 370])
        ];
        for (let [i, y] of blocosElevados) {
            this.chao.create(i * blockWidth, y, 'ground').setOrigin(0, 0).refreshBody();
        }

        const blocosSuporte = [];
        for (let i = 59; i <= 84; i++) {
            for (let y = 440; y <= 655; y += 35) {
                blocosSuporte.push([i, y]);
            }
        }

        blocosSuporte.push([55, 650], [56, 650], [56, 580], [57, 650], [57, 580], [57, 510],
                           [58, 650], [58, 580], [58, 510], [58, 440], [195, 430], [200, 490], [205, 460]);

        for (let [i, y] of blocosSuporte) {
            this.chao.create(i * blockWidth, y, 'ground2').setOrigin(0, 0).refreshBody();
        }

        [
            [6280, 350], [6810, 550], [7100, 520], [7300, 470],
            [7500, 400], [7750, 310], [8170, 310], [8590, 310],
            [9010, 310], [9530, 650], [9830, 620], [10130, 590]
        ].forEach(([x, y]) => this.addFallingPlatform(x, y));

        this.adicionarPlataformaOscilante(11700, 590, 'horizontal', 150, 2000);
        this.adicionarPlataformaOscilante(12200, 590, 'horizontal', 150, 2000);
        this.adicionarPlataformaOscilante(13000, 480, 'horizontal', 150, 2000);
        this.adicionarPlataformaOscilante(13300, 460, 'horizontal', 150, 2000);

        this.player = this.physics.add.sprite(100, 200, 'player_idle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        this.checkpoint = this.physics.add.staticImage(11000, 615, 'checkpoint').setScale(0.015).refreshBody();
        this.physics.add.overlap(this.player, this.checkpoint, () => {
            if (!this.checkpointAtivado) {
                this.checkpointAtivado = true;
                this.checkpointX = this.player.x;
                this.checkpointY = this.player.y;
                this.checkpoint.setTint(0x00ff00);
            }
        });

        this.cameras.main.startFollow(this.player, true, 1, 1, -300, 0);
        this.physics.add.collider(this.player, this.chao);
        this.physics.add.collider(this.player, this.plataformasFlutuantes);
        this.physics.add.collider(this.player, this.plataformasCaem, this.onFallingPlatform, null, this);

        this.physics.add.collider(this.player, this.plataformasMoveis, (player, plataforma) => {
            if (player.body.blocked.down) {
                this.plataformaAtual = plataforma;
            }
        }, null, this);

        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('player_fall', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'death', frames: this.anims.generateFrameNumbers('player_death', { start: 0, end: 0 }), frameRate: 5 });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.headIcon = this.add.image(1200, 30, 'vida').setScrollFactor(0).setScale(0.05).setOrigin(1, 0);
        this.vidasText = this.add.text(1210, 40, 'x ' + this.vidas, {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial'
        }).setScrollFactor(0);
    }

    adicionarPlataformaOscilante(x, y, tipo = 'horizontal', distancia = 300, tempo = 2000, textura = 'ground') {
        const imagem = this.add.image(x, y, textura).setOrigin(0, 0);
        this.physics.add.existing(imagem);
        imagem.body.setImmovable(true);
        imagem.body.allowGravity = false;
        imagem.body.checkCollision.up = true;
        imagem.body.checkCollision.down = false;
        imagem.body.checkCollision.left = false;
        imagem.body.checkCollision.right = false;


        imagem.prevX = x;
        imagem.prevY = y;

        this.plataformasMoveis.add(imagem);

        const tweenConfig = {
            targets: imagem,
            duration: tempo,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
            onUpdate: () => imagem.body.updateFromGameObject()
        };

        if (tipo === 'horizontal') tweenConfig.x = x + distancia;
        else if (tipo === 'vertical') tweenConfig.y = y + distancia;

        this.tweens.add(tweenConfig);
    }

    addFallingPlatform(x, y) {
        const platform = this.plataformasCaem.create(x, y, 'ground');
        platform.setOrigin(0, 0);
        platform.body.setSize(platform.width, platform.height);
        platform.body.checkCollision.up = true;
        platform.originalX = x;
        platform.originalY = y;
    }

    onFallingPlatform(player, platform) {
        if (!platform.isFalling) {
            platform.isFalling = true;
            this.time.delayedCall(1000, () => {
                platform.setImmovable(false);
                platform.body.allowGravity = true;
            });
            this.time.delayedCall(3000, () => {
                const { originalX, originalY } = platform;
                platform.destroy();
                this.addFallingPlatform(originalX, originalY);
            });
        }
    }

    update() {
        if (this.clouds) this.clouds.tilePositionX += 0.3;
        if (!this.player || !this.cursors) return;

        if (this.plataformaAtual) {
            const plataforma = this.plataformaAtual;
            const deltaX = plataforma.x - (plataforma.prevX ?? plataforma.x);
            const deltaY = plataforma.y - (plataforma.prevY ?? plataforma.y);

            this.player.x += deltaX;
            this.player.y += deltaY;

            plataforma.prevX = plataforma.x;
            plataforma.prevY = plataforma.y;

            if (!this.player.body.blocked.down) {
                this.plataformaAtual = null;
            }
        }

        const noChao = this.player.body.blocked.down;
        const velocidadeAtual = this.shiftKey.isDown ? 290 : 160;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-velocidadeAtual);
            this.player.setFlipX(true);
            if (noChao) this.player.anims.play('run', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocidadeAtual);
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
        if (this.vidas >= 0) this.vidasText.setText('x ' + this.vidas);
        if (this.vidas > 0) {
            this.respawnJogador();
        } else if (!this.gameOverShown) {
            this.isDead = true;
            this.gameOverShown = true;
            this.player.setTint(0xff0000);
            this.player.anims.play('death');
            this.add.text(this.cameras.main.scrollX + 640, 300, 'GAME OVER', {
                fontSize: '64px', fill: '#ff0000', fontFamily: 'Arial', stroke: '#000', strokeThickness: 6
            }).setOrigin(0.5);
            this.time.delayedCall(2000, () => this.scene.start('Menu'));
        }
    }

    respawnJogador() {
        this.player.setVelocity(0, 0);
        const x = this.checkpointAtivado ? this.checkpointX : 100;
        const y = this.checkpointAtivado ? this.checkpointY : 200;
        this.player.setPosition(x, y);
        this.player.clearTint();
    }
}
