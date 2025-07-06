
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_idle_0');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.setScale(0.1);
        this.setCollideWorldBounds(true);

        // Hitbox ajustada e levantada para não afundar no chão
        this.body.setSize(30, 30);
        this.body.setOffset(5, 25);

        this.speed = 50;
        this.isDead = false;

        this.play('enemy_idle');
    }

    update(player) {
        if (this.isDead) return;

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (distance < 200) {
            if (player.x < this.x) {
                this.setVelocityX(-this.speed);
                this.flipX = true;
            } else {
                this.setVelocityX(this.speed);
                this.flipX = false;
            }
        } else {
            this.setVelocityX(0);
        }
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
