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

        this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
        this.clouds = this.add.tileSprite(640, 200, 1280, 300, 'clouds').setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.physics.world.setBounds(0, 0, 10000, 820);

        const groundY = 650;
        const blockWidth = this.textures.get('ground').getSourceImage().width;
        const numBlocks = Math.ceil(10000 / blockWidth);

        this.chao = this.physics.add.staticGroup();
        this.plataformasFlutuantes = this.physics.add.staticGroup();

        function range(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }

        const buracos = new Set([
            ...range(7, 51),
            
        
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


            
            
            
            
            [6400, 360, 'plataformaAltE'], [6470, 360, 'plataformaAltD'],
            [7400, 400, 'plataformaE'], [7470, 400, 'plataformaD'],
            [8400, 450, 'plataformaAltE'], [8470, 450, 'plataformaAltD']
        ];

        for (let [x, y, texture] of plataformasFlutuantes) {
            const plataforma = this.plataformasFlutuantes.create(x, y, texture).setOrigin(0, 0).refreshBody();
            plataforma.body.checkCollision.up = true;
            plataforma.body.checkCollision.down = false;
            plataforma.body.checkCollision.left = false;
            plataforma.body.checkCollision.right = false;
        }

        const blocosElevados = [
            [55, 580], [56, 510], [57, 440], [58,370],
            ...range(59, 84).map(i => [i, 370]),
            
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

        blocosSuporte.push([55, 650]);
        blocosSuporte.push([56, 650]); blocosSuporte.push([56, 580]);
        blocosSuporte.push([57, 650]); blocosSuporte.push([57, 580]); blocosSuporte.push([57, 510]);

        blocosSuporte.push([58, 650]);
        blocosSuporte.push([58, 580]);
        blocosSuporte.push([58, 510]);
        blocosSuporte.push([58, 440]);

        for (let [i, y] of blocosSuporte) {
            this.chao.create(i * blockWidth, y, 'ground2').setOrigin(0, 0).refreshBody();
        }

        this.player = this.physics.add.sprite(100, 200, 'player_idle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        this.checkpoint = this.physics.add.staticImage(5500, 340, 'checkpoint').setScale(0.015).refreshBody();
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

        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('player_fall', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'death', frames: this.anims.generateFrameNumbers('player_death', { start: 0, end: 0 }), frameRate: 5 });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.headIcon = this.add.image(1200, 30, 'vida').setScrollFactor(0).setScale(0.05).setOrigin(1, 0);
        this.vidasText = this.add.text(1210, 40, 'x ' + this.vidas, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setScrollFactor(0);
    }

    update() {
    if (this.clouds) this.clouds.tilePositionX += 0.3;
    if (!this.player || !this.cursors) return;

    const noChao = this.player.body.blocked.down;

    const velocidadeNormal = 460;
    const velocidadeCorrida = 280;
    const velocidadeAtual = this.shiftKey.isDown ? velocidadeCorrida : velocidadeNormal;

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
