export class Nivel3 extends Phaser.Scene {

    constructor() {
        super('Nivel3');
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
        this.checkpointX = 200;
        this.checkpointY = 200;
        this.plataformaAtual = null;

        this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
        this.clouds = this.add.tileSprite(640, 200, 1280, 300, 'clouds').setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, 12000, 720);
        this.physics.world.setBounds(0, 0, 12000, 820);

        const blockWidth = this.textures.get('ground').getSourceImage().width;
        const groundY = 650;
        const numBlocks = Math.ceil(12000 / blockWidth);

        this.chao = this.physics.add.staticGroup();
        this.plataformasFlutuantes = this.physics.add.staticGroup();
        this.plataformasCaem = this.physics.add.group({ allowGravity: false, immovable: true });
        this.plataformasMoveis = this.add.group();

        const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const buracos = new Set([
            ...range(10, 30),
            ...range(60, 80),
            ...range(100, 115)
        ]);
for (let i = 0; i < numBlocks; i++) {
    const blockX = i * blockWidth;
    if (blockX >= 6500) {
        this.chao.create(blockX, groundY, 'ground').setOrigin(0, 0).refreshBody();
    }
}

        const plataformasFlutuantes = [
            [165, 570, 'plataformaE'], [235, 570, 'plataformaD'],
            [350, 480, 'plataformaE'], [420, 480, 'plataformaD'],
            [650, 390, 'plataformaE'], [720, 390, 'plataformaD'],
            [720, 560, 'plataformaE'], [790, 560, 'plataformaD'],
            [930, 300, 'plataformaE'], [1000, 300, 'plataformaD'],
            [1140, 540, 'plataformaE'], [1210, 540, 'plataformaD'],
            [1350, 410, 'plataformaE'], [1420, 410, 'plataformaD'],       
            [1980, 460, 'plataformaE'], [2050, 460, 'plataformaD'], 
            [2400, 570, 'plataformaE'], [2470, 570, 'plataformaD'],
            [2400, 300, 'plataformaE'], [2470, 300, 'plataformaD'],
            [2610, 680, 'plataformaE'], [2680, 680, 'plataformaD'],
            [2820, 460, 'plataformaE'], [2890, 460, 'plataformaD'],
            [3060, 340, 'plataformaE'], [3130, 340, 'plataformaD'],
            [3240, 430, 'plataformaE'], [3310, 430, 'plataformaD'],
            [3940, 250, 'plataformaE'], [4010, 250, 'plataformaD'],
            [4390, 250, 'plataformaE'], [4460, 250, 'plataformaD'],
            [5340, 580, 'plataformaE'], [5410, 580, 'plataformaD'],
            [5550, 510, 'plataformaE'], [5620, 510, 'plataformaD'],
            [5760, 420, 'plataformaE'], [5830, 420, 'plataformaD'],


            [8000, 580, 'plataformaAltE'],[8070, 540, 'plataformaAltD'],
            [8170, 470, 'plataformaAltE'],[8240, 430, 'plataformaAltD'],
            [8340, 360, 'plataformaAltE'],[8410, 320, 'plataformaAltD'],

            [9360, 540, 'plataformaAltE'],[9430, 580, 'plataformaAltD'],
            [9260, 470, 'plataformaAltD'],[9190, 430, 'plataformaAltE'],
            [9090, 360, 'plataformaAltD'],[9020, 320, 'plataformaAltE'],

            
        ];

        for (let [x, y, texture] of plataformasFlutuantes) {
            const plataforma = this.plataformasFlutuantes.create(x, y, texture).setOrigin(0, 0).refreshBody();
            plataforma.body.checkCollision.up = true;
            plataforma.body.checkCollision.down = false;
            plataforma.body.checkCollision.left = false;
            plataforma.body.checkCollision.right = false;
        }

       
        [
           [1500, 550], [1800, 470], [2200, 390],
            [4000, 620], [4400, 600], [4700, 560],
            [8620, 320], [8830, 320]
        ].forEach(([x, y]) => this.addFallingPlatform(x, y));

        this.adicionarPlataformaOscilante(3450, 300, 'horizontal', 200, 2200);
        this.adicionarPlataformaOscilante(5100, 600, 'horizontal', 200, 2200);
        
        this.adicionarPlataformaOscilante(6100, 470, 'horizontal', 200, 2000);

        this.player = this.physics.add.sprite(7500, 200, 'player_idle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        this.checkpoint = this.physics.add.staticImage(1000, 615, 'checkpoint').setScale(0.015).refreshBody();
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
        const velocidadeAtual = this.shiftKey.isDown ? 290 : 290;

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
        const x = this.checkpointAtivado ? this.checkpointX : 200;
        const y = this.checkpointAtivado ? this.checkpointY : 200;
        this.player.setPosition(x, y);
        this.player.clearTint();
    }
}
