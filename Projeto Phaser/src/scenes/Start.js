import Enemy from '../Enemy.js';
export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
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
        this.load.image('powerup_vida', 'assets/HUD/vida.png');


        this.load.spritesheet('player_idle', 'assets/Personagem/Idle.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_run', 'assets/Personagem/Run.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_jump', 'assets/Personagem/Jump.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_fall', 'assets/Personagem/Fall.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_death', 'assets/Personagem/Death.png', { frameWidth: 80, frameHeight: 110 });

        for (let i = 0; i <= 5; i++) {
            this.load.image('enemy_idle_' + i, 'assets/inimigo/Idle/0_Necromancer_of_the_Shadow_Idle_00' + i + '.png');
        }

        for (let i = 0; i <= 14; i++) {
            const num = i.toString().padStart(3, '0');
            this.load.image('enemy_die_' + i, 'assets/inimigo/Dying/0_Necromancer_of_the_Shadow_Dying_' + num + '.png');
        }

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

        this.cameras.main.setBounds(0, 0, 8000, 720);
        this.physics.world.setBounds(0, 0, 8000, 820);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        const groundY = 650;
        const groundTexture = this.textures.get('ground');
        const blockWidth = groundTexture.getSourceImage().width;
        const numBlocks = Math.ceil(10000 / blockWidth);

        this.chao = this.physics.add.staticGroup();
        this.plataformasFlutuantes = this.physics.add.staticGroup();

        const blocosElevados = [
            [28, 480], [29, 480], [30, 480],
            [63, 580], [64, 510], [65, 440],
            [66, 440], [67, 440], [68, 440],
            [69, 440], [70, 440], [71, 440], [72, 440], [73, 440], [74, 440]
        ];
        for (let [i, y] of blocosElevados) {
            this.chao.create(i * blockWidth, y, 'ground').setOrigin(0, 0).refreshBody();
        }

        const blocosManuais = new Set(blocosElevados.map(([i]) => i));

        const buracos = new Set([
            ...range(6, 12),
            ...range(20, 27),
            ...range(40, 53),
            ...range(75, 94),
        
        ]);

        function range(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }

        for (let i = 0; i < numBlocks; i++) {
            if (!blocosManuais.has(i) && !buracos.has(i)) {
                this.chao.create(i * blockWidth, groundY, 'ground').setOrigin(0, 0).refreshBody();
            }
        }

        const blocosSuporte = [];
        for (let i = 28; i <= 30; i++) {
            for (let y = 510; y <= 655; y += 35) {
                blocosSuporte.push([i, y]);
            }
        }

        for (let i = 66; i <= 74; i++) {
            for (let y = 510; y <= 655; y += 35) {
                blocosSuporte.push([i, y]);
            }
        }

        blocosSuporte.push([63, 650]);
        blocosSuporte.push([64, 650]);
        blocosSuporte.push([64, 580]);
        blocosSuporte.push([65, 650]);
        blocosSuporte.push([65, 580]);
        blocosSuporte.push([65, 510]);

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
            [5430, 390, 'plataformaAltE'],
            [5500, 390, 'plataformaAltD'],
            [5610, 340, 'plataformaAltE'],
            [5680, 340, 'plataformaAltD'],
            [5790, 290, 'plataformaAltE'],
            [5860, 290, 'plataformaAltD'],
            [6120, 290, 'plataformaAltE'],
            [6190, 290, 'ground'],
            [6260, 290, 'plataformaAltD'],
        ];

        for (let [x, y, texture] of plataformasFlutuantes) {
            const bloco = this.plataformasFlutuantes.create(x, y, texture).setOrigin(0, 0).refreshBody();
            bloco.body.checkCollision.down = false;
            bloco.body.checkCollision.left = false;
            bloco.body.checkCollision.right = false;
        }

        this.player = this.physics.add.sprite(100, 200, 'player_idle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        // === CHECKPOINT ===
        this.checkpoint = this.physics.add.staticImage(5000, 400, 'checkpoint').setScale(0.015).refreshBody();

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

        
        // === ANIMAÇÕES DOS INIMIGOS ===
        this.anims.create({
            key: 'enemy_idle',
            frames: [...Array(6).keys()].map(i => ({ key: 'enemy_idle_' + i })),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_die',
            frames: [...Array(15).keys()].map(i => ({
                key: 'enemy_die_' + i
            })),
            frameRate: 12,
            repeat: 0
        });

        // === CRIAR INIMIGOS ===
        this.inimigos = this.physics.add.group();

        const posicoesInimigos = [
        [660, 500],
        [1200, 500],
        [2070, 460],
        [2500, 500],
        [3000, 550],
        [3600, 860],
        [4200, 390],
        [5000, 360],
        [5800, 340],
        [6400, 300]
    ];

    posicoesInimigos.forEach(([x, y]) => {
        const inimigo = new Enemy(this, x, y);
        this.inimigos.add(inimigo);
    });


        // === COLISÕES DOS INIMIGOS ===
        this.physics.add.collider(this.inimigos, this.chao);
        this.physics.add.collider(this.inimigos, this.plataformasFlutuantes);

        this.physics.add.collider(this.player, this.inimigos, (player, inimigo) => {
            const playerBounds = player.getBounds();
            const enemyBounds = inimigo.getBounds();

            const isFalling = player.body.velocity.y > 0;
            const isOnTop = playerBounds.bottom < enemyBounds.top + 10;

            if (isFalling && isOnTop) {
                inimigo.die();
               // this.adicionarPontos(100);  // Por matar inimigo
                player.setVelocityY(-200);
            } else if (!inimigo.isDead) {
                this.vidas -= 1;
                this.vidasText.setText('x ' + this.vidas);
                if (this.vidas <= 0) {
                    this.perderVida();
                } else {
                    this.respawnJogador();
                }
            }
        });

        // POWER-UP DE VIDA 
        this.powerUpsVida = this.physics.add.staticGroup();
        this.powerUpsVida.create(2500, 260, 'vida').setScale(0.07).refreshBody();

        // COLISÃO COM POWER-UP
        this.physics.add.overlap(this.player, this.powerUpsVida, (player, powerup) => {
            if (this.vidas < 4) {
                this.vidas++;
                this.vidasText.setText('x ' + this.vidas);
            }
            powerup.destroy();
        }, null, this);  


        this.cursors = this.input.keyboard.createCursorKeys();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.isDead && this.tempoRestante > 0) {
                    this.tempoRestante--;
                    this.tempoText.setText('Tempo: ' + this.tempoRestante);
                    if (this.tempoRestante === 0) {
                        this.perderVida();
                    }
                }
            },
            loop: true
        });
    

        this.headIcon = this.add.image(1200, 30, 'vida').setScrollFactor(0).setScale(0.05).setOrigin(1, 0);
        this.vidasText = this.add.text(1210, 40, 'x ' + this.vidas, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setScrollFactor(0);

        this.tempoRestante = 300;
        this.pontuacao = 0;
        this.tempoText = this.add.text(970, 40, 'Tempo: ' + this.tempoRestante, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setScrollFactor(0);
        this.pontuacaoText = this.add.text(750, 40, 'Pontos: ' + this.pontuacao, {
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
        const isRunning = this.shiftKey.isDown;
        const speed = isRunning ? 290 : 160;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            if (noChao) this.player.anims.play('run', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
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

        if (this.inimigos) {
            this.inimigos.children.iterate(inimigo => {
                if (inimigo && inimigo.update) {
                    inimigo.update(this.player);
                }
            });
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
        const x = this.checkpointAtivado ? this.checkpointX : 100;
        const y = this.checkpointAtivado ? this.checkpointY : 200;
        this.player.setPosition(x, y);
        this.player.clearTint();
    }

        adicionarPontos(valor) {
        this.pontuacao += valor;
        this.pontuacaoText.setText('Pontos: ' + this.pontuacao);
    }

}
