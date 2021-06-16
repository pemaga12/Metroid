var enemies = function () {
//Pinchitos:
    Q.Sprite.extend("Pinchito", {
        init: function (p) {
            this._super(p, {
                sheet: "pinchitos",
                sprite: "pinchitos_anim",
                x: 590,
                y: 1465,
                frame: 0,
                gravityY: 540,
                lives_e: 2,
                damage: 7,
                vx: 50
            });
            //this.add("2d, aiBounce, animation");
            this.add("2d, animation, aiBounce");
            this.play("pinchitos_normal");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
            //this.on(this.p.vy > 0, this, "changeGravity");
            //this.on("bump.bottom, bump.left, bump.right", this, "kill");
        },

        onTop: function (collision) {
            this.destroy();
        },
        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            console.log("Me di contra un pinchito");
            Q.audio.play("../sounds/hit.mp3");
            collision.obj.p.vy = -5;
            collision.obj.p.vx = collision.normalX * -500;
            collision.obj.p.x += collision.normalX * -5;
            collision.obj.die(this.p.damage);
        },
        damage: function (dmg) {
            this.p.lives_e = this.p.lives_e - dmg;
            if (this.p.lives_e == 0) {
                //Q.audio.play("../sounds/gun.mp3");
                this.destroy();
                Q.stage(1).insert(new Q.Explosion({ x: this.p.x, y: this.p.y }));
                if ((Math.floor(Math.random() * 100) + 1) < 50) {
                    var that = this;
                    setTimeout(function () {
                        Q.stage(1).insert(new Q.Vida({ x: that.p.x, y: that.p.y }));
                    }, 150);
                }


            }
        },
    });

    //PinchitosPared:
    Q.Sprite.extend("PinchitoPared", {
        init: function (p) {
            this._super(p, {
                sheet: "pinchitos",
                sprite: "pinchitos_anim",
                x: 590,
                y: 1465,
                frame: 0,
                gravityY: 540,
                lives_e: 2,
                damage: 7,
                vx: 25
            });
            //this.add("2d, aiBounce, animation");
            this.add("2d, animation");
            this.play("pinchitos_normal");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
            //this.on(this.p.vy > 0, this, "changeGravity");
            //this.on("bump.bottom, bump.left, bump.right", this, "kill");
        },

        // onTop: function(collision){
        //     this.destroy();
        // },
        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            console.log("Me di contra un pinchito");
            Q.audio.play("../sounds/hit.mp3");
            collision.obj.die(this.p.damage);
        },
        damage: function (dmg) {
            this.p.lives_e = this.p.lives_e - dmg;
            if (this.p.lives_e == 0) {
                this.destroy();
                Q.stage(1).insert(new Q.Explosion({ x: this.p.x, y: this.p.y }));
                if ((Math.floor(Math.random() * 100) + 1) < 50) {
                    var that = this;
                    setTimeout(function () {
                        Q.stage(1).insert(new Q.Vida({ x: that.p.x, y: that.p.y }));
                    }, 150);
                }
            }


        },
        step: function (dt) {
            if (this.p.vx > 5 && (this.p.vy == 0 || this.p.gravityX == 1000)) {
                this.play("pinchitos_normal");
                this.p.vy = 0;
                this.p.gravityY = 1000;
                this.p.vx = 10;
                this.p.gravityX = 0;

            }
            else if (this.p.vy > 5 && (this.p.vx == 0 || this.p.gravityY == 1000)) {
                this.play("pinchitos_izquierda");
                this.p.vy = 25
                this.p.gravityX = -1000;
                this.p.vx = 0.000000001;
                this.p.gravityY = 0;
            }
            else if (this.p.vx < 5 && (this.p.vy == 0 || this.p.gravityX == -1000)) {
                this.play("pinchitos_debajo");
                this.p.vy = 0;
                this.p.gravityY = -1000;
                this.p.vx = -15;
                this.p.gravityX = 0;
            }

            else if (this.p.vy < 5 && (this.p.vx == 0 || this.p.gravityY == -1000)) {
                this.play("pinchitos_derecha");
                this.p.gravityY = 0;
                this.p.vy = -25;
                this.p.gravityX = 1000;
                this.p.vx = 0;
            }
        }
    });

    Q.load(["pinchitos.png","pinchitos.json"],
    function(){

        Q.compileSheets("pinchitos.png", "pinchitos.json");

        Q.animations('pinchitos_anim', {
            pinchitos_normal: { frames: [0, 1], rate: 1 / 3 },
            pinchitos_derecha: { frames: [6, 7], rate: 1 / 3 },
            pinchitos_izquierda: { frames: [2, 3], rate: 1 / 3 },
            pinchitos_debajo: { frames: [4, 5], rate: 1 / 3 }
        });

    });

    


}