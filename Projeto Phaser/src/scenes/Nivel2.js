import Enemy from '../Enemy.js';
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
        this.load.image('PowerRun1', 'assets/Power/PowerRun1.png');
        this.load.image('PowerRun2', 'assets/Power/PowerRun2.png');
        this.load.image('slash', 'assets/Power/ataque.png');
        this.load.image('head', 'assets/Power/head.png');



        this.load.spritesheet('player_idle', 'assets/Personagem/Idle.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_run', 'assets/Personagem/Run.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_jump', 'assets/Personagem/Jump.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_fall', 'assets/Personagem/Fall.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_death', 'assets/Personagem/Death.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_power_idle', 'assets/Power/PowerIdle.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_power_run', 'assets/Power/PowerRun.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_power_jump', 'assets/Power/PowerJump.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_power_fall', 'assets/Power/PowerFall.png', { frameWidth: 80, frameHeight: 110 });
        this.load.spritesheet('player_power_death', 'assets/Power/PowerDeath.png', { frameWidth: 80, frameHeight: 110 });

        
        for (let i = 0; i <= 5; i++) {
            this.load.image('enemy_idle_' + i, 'assets/inimigo/Idle/0_Necromancer_of_the_Shadow_Idle_00' + i + '.png');
        }

        for (let i = 0; i <= 14; i++) {
            const num = i.toString().padStart(3, '0');
            this.load.image('enemy_die_' + i, 'assets/inimigo/Dying/0_Necromancer_of_the_Shadow_Dying_' + num + '.png');
        }


    }

    create() {
        this.vidas = this.registry.get('vidas') || 3;
        this.temPoder = false;//saber se o jogador tem power
        this.ataques = this.physics.add.group({
            allowGravity: false,
            runChildUpdate: true
        });

        this.teclaAtaque = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z); // tecla Z

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

        // Criar inimigos
        this.inimigos = [];

        this.inimigos.push(new Enemy(this, 1000, 630));
        this.inimigos.push(new Enemy(this, 2000, 630));
        // Adiciona mais se quiseres

        // Colisão inimigos com chão
        this.physics.add.collider(this.inimigos, this.chao);

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
        this.powerUpTroca = this.physics.add.staticImage(1750, 380, 'head').setScale(0.5).refreshBody();

        this.physics.add.overlap(this.player, this.powerUpTroca, () => {
            this.temPoder = true;
            this.powerUpTroca.destroy();
        }, null, this);

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

        this.physics.add.collider(this.inimigos, this.chao); // inimigo com chão
        this.physics.add.overlap(this.ataques, this.inimigos, (ataque, inimigo) => {
            ataque.destroy();

            if(!inimigo.isDead && typeof inimigo.die === 'function') {
                inimigo.die();
                this.adicionarPontos(100); // opcional
            }
        }, null, this);;


        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('player_fall', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'death', frames: this.anims.generateFrameNumbers('player_death', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'power_idle', frames: this.anims.generateFrameNumbers('player_power_idle', { start: 0, end: 0 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'power_run', frames: this.anims.generateFrameNumbers('player_power_run', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'power_jump', frames: this.anims.generateFrameNumbers('player_power_jump', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'power_fall', frames: this.anims.generateFrameNumbers('player_power_fall', { start: 0, end: 0 }), frameRate: 5 });
        this.anims.create({ key: 'power_death', frames: this.anims.generateFrameNumbers('player_power_death', { start: 0, end: 0 }), frameRate: 5 });

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

        this.anims.create({
            key: 'power_run_extendido',
            frames: [
                { key: 'player_power_run', frame: 0 },
                { key: 'player_power_run', frame: 1 },
                { key: 'PowerRun1' },
                { key: 'PowerRun2' }
            ],
            frameRate: 8,
            repeat: -1
        });

                // === CRIAR INIMIGOS ===
                this.inimigos = this.physics.add.group();
        
                const posicoesInimigos = [
                [760, 500],
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
    if (player.body.touching.down && inimigo.body.touching.up && !inimigo.isDead) {
        inimigo.die();
        this.adicionarPontos(250);
        player.setVelocityY(-250);
    } else if (!inimigo.isDead) {
        this.vidas--;
        this.vidasText.setText('x ' + this.vidas);
        if (this.vidas <= 0) {
            this.perderVida();
        } else {
            this.respawnJogador();
        }
    }
});


        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

           this.time.addEvent({
    delay: 1000,
    callback: () => {
        if (!this.isDead) {
            this.tempoRestante--;
            this.tempoText.setText('Tempo: ' + Math.max(this.tempoRestante, 0));

            if (this.tempoRestante <= 0) {
                this.perderVida();
            }
        }
    },
    loop: true
});

        this.headIcon = this.add.image(1200, 30, 'vida').setScrollFactor(0).setScale(0.05).setOrigin(1, 0);
        this.vidasText = this.add.text(1210, 40, 'x ' + this.vidas, {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial'
        }).setScrollFactor(0);

        this.tempoRestante = 300;
        this.pontuacao = this.registry.get('pontos') || 0;
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
            if (noChao) this.player.anims.play(this.temPoder ? 'power_run_extendido' : 'run', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocidadeAtual);
            this.player.setFlipX(false);
            if (noChao) this.player.anims.play(this.temPoder ? 'power_run_extendido' : 'run', true);
        } else {
            this.player.setVelocityX(0);
            if (noChao) this.player.anims.play(this.temPoder ? 'power_idle' : 'idle', true);
        }

        if (this.cursors.up.isDown && noChao) {
            this.player.setVelocityY(-330);
            this.player.anims.play(this.temPoder ? 'power_jump' : 'jump');
        }

        if (!noChao && this.player.body.velocity.y > 0) {
            this.player.anims.play(this.temPoder ? 'power_fall' : 'fall', true);
        }

        if (this.player.y > 720 && !this.isDead) {
            this.perderVida();
        }

        if (Phaser.Input.Keyboard.JustDown(this.teclaAtaque)) {
            this.atacar();
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
        this.temPoder = false; // REMOVE O POWER UP AO MORRER
        if (this.vidas >= 0) this.vidasText.setText('x ' + this.vidas);
        if (this.vidas > 0) {

        if (!this.powerUpTroca || !this.powerUpTroca.active) {
            this.powerUpTroca = this.physics.add.staticImage(1750, 380, 'head').setScale(0.5).refreshBody();
            this.physics.add.overlap(this.player, this.powerUpTroca, () => {
                this.temPoder = true;
                this.powerUpTroca.destroy();
            });
        }    
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
        this.temPoder = false; // <-- opcional aqui também

    }

    adicionarPontos(valor) {
        this.pontuacao += valor;
        this.pontuacaoText.setText('Pontos: ' + this.pontuacao);
    }

atacar() {
    if (!this.temPoder) return;

    const direcao = this.player.flipX ? -1 : 1;
    const startX = this.player.x + direcao * 40;
    const startY = this.player.y;

    let contador = 0;
    const maxAtaques = 3;
    const intervalo = 100; // ms entre cada ataque (ajusta conforme necessário)

    const timer = this.time.addEvent({
        delay: intervalo,
        repeat: maxAtaques - 1,
        callback: () => {
            const ataque = this.physics.add.sprite(
                startX + contador * direcao * 30, // mais à frente a cada repetição
                startY,
                'slash'
            );

            ataque.setScale(0.10);
            ataque.setVelocityX(direcao * 400);
            ataque.body.allowGravity = false;
            ataque.setFlipX(direcao === -1);
            ataque.setSize(40, 40).setOffset(0, 0);

            this.ataques.add(ataque);

            // Gira para dar efeito visual
            this.tweens.add({
                targets: ataque,
                angle: 360,
                duration: 500,
                repeat: -1
            });

            // Auto destruir
            this.time.delayedCall(1000, () => {
                if (ataque && ataque.active) ataque.destroy();
            });

            contador++;
        }
    });
}




    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0);
        this.play('enemy_die');
        this.once('animationcomplete', () => {
            this.destroy();
        });
    }


}
