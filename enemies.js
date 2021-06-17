var enemies = function () {

    Q.component("enemy_default", {
        extend:{

            kill: function (collision) {
                if (!collision.obj.isA("Samus")) return;
                Q.audio.play("../sounds/hit.mp3");
                //collision.obj.p.vy = -5;
                //collision.obj.p.vx = collision.normalX * -500;
                //collision.obj.p.x += collision.normalX * -5;
                collision.obj.die(this.p.damage);
            },

            damage: function (dmg) {
                this.p.lives = this.p.lives - dmg;
                if (this.p.lives == 0) {
                    this.destroy();
                    Q.stage(1).insert(new Q.Explosion({ x: this.p.x, y: this.p.y }));
                    if ((Math.floor(Math.random() * 100) + 1) < 50) {
                        var that = this;
                        setTimeout(function () {
                            Q.stage(1).insert(new Q.Vida({ x: that.p.x, y: that.p.y }));
                        }, 150);
                    }
                }
            }

        }
    });

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
                lives: 2,
                damage: 7,
                vx: 50
            });
            this.add("2d, animation, aiBounce, enemy_default");
            this.play("pinchitos_normal");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
            //this.on(this.p.vy > 0, this, "changeGravity");
        },

        onTop: function (collision) {
            this.destroy();
        }

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
                lives: 2,
                damage: 7,
                vx: 25
            });
            this.add("2d, animation, enemy_default");
            this.play("pinchitos_normal");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
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

//Taladrillo

    Q.Sprite.extend("Taladrillo", {
        init: function (p) {
            this._super(p, {
                sheet: "taladrillo",
                sprite: "taladrillo_anim",
                frame: 0,
                gravity: 0,
                lives: 2,
                damage: 7,
                vx: 0,
                vy: 0,
                dt: 5,
                fall: false,
            });
            this.add("2d, animation, enemy_default");
            this.play("parado");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
        },
    
        step: function (dt) {
            var samus = Q("Samus").first();

            if (samus === undefined) return;

            if (this.p.fall && this.p.vy === 0) {
                this.damage(2);
            }

            if (samus.p.x > (this.p.x - 75) && samus.p.x < (this.p.x + 75)) {
                this.p.gravity = 0.5;
                this.p.fall = true;
                this.play("caida");

            }
            if (this.p.gravity !== 0 && this.p.x > samus.p.x) {
                this.p.gravityX = -350;
                return;
            }
            if (this.p.gravity !== 0 && this.p.x < samus.p.x) {
                this.p.gravityX = 350;
                return;
            }
        },

    });

//Larva

    Q.Sprite.extend("Larva", {
        init: function (p) {
            this._super(p, {
                sheet: "larvas",
                sprite: "larvas_anim",
                frame: 0,
                vx: 60,
                gravity: 0,
                damage: 7,
                lives: 2,
            });
            this.add("2d, aiBounce, animation, enemy_default");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
        },
        
    });

//Saltamontes

    Q.Sprite.extend("Saltamontes", {
        init: function(p) {
            this._super(p,{
            sheet: "saltamontes",
            sprite: "saltamontes_anim",
            frame: 0,
            lives: 3,
            gravity: 0.2,
            damage: 7,
            reload:3,
            reloadTime: 3,
            vx:0,
            vy:0 
            });
            this.add("2d, aiBounce, animation, enemy_default");
            this.play("saltamontes_parado");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");

        },
        step:function(dt){
            this.p.reload -= dt;

            var samus = Q("Samus").first();
            if (samus === undefined) return;

            if (this.p.vy==0) {
                if(this.p.reload < 0){
                  
                    if (samus.p.x > (this.p.x - 75) && samus.p.x < (this.p.x + 75) && samus.p.y > (this.p.y - 150) && samus.p.y < (this.p.y + 150)) {
                        Q.audio.play("../sounds/hopper.mp3");
                    }
                    
                    this.p.reload = this.p.reloadTime;
                    this.play("saltamontes_salto");
                    this.p.vy = -150;
                    if(this.p.x > samus.p.x){
                        this.p.vx = -50;
                    }
                    else if(this.p.x < samus.p.x){
                         this.p.vx = 50;
                    } 
                }
                else{
                    this.p.vx=0;
                    if(this.p.reload < 1){
                        this.play("saltamontes_preparado");
                    }
                    else{
                        this.play("saltamontes_parado");
                    }
                }
            }
        }
    });

//MotherBrain

    Q.Sprite.extend("MotherBrain", {
        init: function (p) {
            this._super(p, {
                sheet: "motherbrain",
                sprite: "motherbrain_anim",
                frame: 0,
                gravity: 0,
                damage: 10,
                lives: 50,
                music: false
            });
            this.add("2d, animation");
            this.play("motherbrain");
            this.on("bump.left, bump.right", this, "kill");


        },
        step:function(dt){
            var samus = Q("Samus").first();
            if (samus === undefined) return;
            if (!this.p.music && samus.p.x > (this.p.x - 400) && samus.p.x < (this.p.x + 400) && samus.p.y > (this.p.y - 200) && samus.p.y < (this.p.y + 200)) {
                Q.audio.stop("../sounds/elevatormusic.mp3");
                Q.audio.play("../sounds/motherbrain.mp3");
                this.p.music=true;
            }
        },
        damage: function (dmg) {
            this.p.lives = this.p.lives - dmg;
            this.p.x = 2195;
            this.play("motherbraindamage");
            if (this.p.lives == 0) {
                Q.audio.stop("../sounds/motherbrain.mp3");
                Q.audio.play("../sounds/ending_alternative.mp3");
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

        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            Q.audio.play("../sounds/hit.mp3");
            collision.obj.p.vy = -200;
            collision.obj.p.vx = collision.normalX*-500;
            collision.obj.p.x += collision.normalX*-5;
            collision.obj.die(this.p.damage);
        }

    });

//Lava

    Q.Sprite.extend("Lava", {
        init: function (p) {
            this._super(p, {
                sheet: "lava",
                sprite: "lava_anim",
                damage: 7,
                frame: 0,
            });
            this.add("2d, aiBounce, animation");
            this.play("lava");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
            //this.on("bump.bottom, bump.left, bump.right", this, "kill");


        },
        
        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            Q.audio.play("../sounds/hit.mp3");
            collision.obj.die(this.p.damage);
        },
        damage: function (dmg) {
        }
    });

//Vidas que sueltan los enemigos al morir

    Q.Sprite.extend("Vida", {
        init: function (p) {
            this._super(p, {
                sheet: "vida",
                sprite: "vida_anim",
                scale: 1,
                sensor: true,
                taken: false,
                time: 0,
            });
            this.on("sensor", this, "hit");
            this.add("tween", "animation");
            //this.play("vida");

        },
        hit: function (collision) {

            if (this.taken) return;
            if (!collision.isA("Samus")) return;
            Q.state.inc("lives", 5);
            this.taken = true;
            this.destroy();
        },
        step: function (dt) {
            if (this.p.time + dt < 0.25) {
                this.p.time += dt;
                return;
            }
            this.p.time = 0;
            if (this.p.frame === 0) this.p.frame = 1;
            else {
                this.p.frame = 0;
            }
        },
        damage: function (dmg) {
        }

    });

//Explosion

    Q.Sprite.extend("Explosion", {
        init: function (p) {
            this._super(p, {
                sheet: "explosion",
                scale: 1,
                frame: 0,
                time: 0,
                points: [[0, 0], [0, 0], [0, 0], [0, 0]], //Para que no tenga colisiones
            });
        },
        step: function (dt) {
            if (this.p.time + dt < 0.1) {
                this.p.time += dt;
                return;
            }
            if (this.p.frame === 3) {
                this.destroy();
                return;
            }
            this.p.time = 0;
            ++this.p.frame;
        },
        damage: function (dmg) {
        }
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////LOADS/////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

    Q.load(["pinchitos.png","pinchitos.json",
            "taladrillo.png", "taladrillo.json",
            "larvas.png", "larvas.json",
            "saltamontes.png", "saltamontes.json",
            "motherbrain.png", "motherbrain.json", 
            "lava.png", "lava.json",
            "vida.png", "vida.json",
            "explosion.png", "explosion.json","../sounds/hopper.mp3","../sounds/motherbrain.mp3","../sounds/elevatormusic.mp3","../sounds/ending_alternative.mp3"],


    function(){

        Q.compileSheets("pinchitos.png", "pinchitos.json");
        Q.compileSheets("taladrillo.png", "taladrillo.json");
        Q.compileSheets("larvas.png", "larvas.json");
        Q.compileSheets("saltamontes.png", "saltamontes.json");
        Q.compileSheets("motherbrain.png", "motherbrain.json");
        Q.compileSheets("lava.png", "lava.json");
        Q.compileSheets("vida.png", "vida.json");
        Q.compileSheets("explosion.png", "explosion.json");

        Q.animations('pinchitos_anim', {
            pinchitos_normal: { frames: [0, 1], rate: 1 / 3 },
            pinchitos_derecha: { frames: [6, 7], rate: 1 / 3 },
            pinchitos_izquierda: { frames: [2, 3], rate: 1 / 3 },
            pinchitos_debajo: { frames: [4, 5], rate: 1 / 3 }
        });
        Q.animations("taladrillo_anim", {
            parado: { frames: [0, 1, 0, 2], rate: 1 },
            caida: { frames: [0, 1, 0, 2], rate: 1 / 2 }
        });
        Q.animations("larva_anim", {
                larva: { frames: [0] }
        });
        Q.animations("saltamontes_anim", {
            saltamontes_parado:     { frames: [0], rate: 1},
            saltamontes_preparado:  { frames: [1], rate: 1},
            saltamontes_salto:      { frames: [2], rate: 1}
        });
        Q.animations("motherbrain_anim", {
            motherbrain: { frames: [0, 1, 2, 3], rate: 1},
            motherbraindamage: { frames: [4], rate:1, next:"motherbrain" }
        });
        Q.animations("lava_anim", {
            lava: { frames: [0, 1], rate: 1 }
        });

        Q.animations("vida_anim", {
            vidas: { frames: [0, 1], rate: 1 / 2 }
        });

    });
}