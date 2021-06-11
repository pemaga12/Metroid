var game = function () {

    var Q = window.Q = Quintus()
        .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
        .setup("myGame", {
            width: 768,
            height: 720,
            // scaleToFit: true
        })
        .controls().controls().enableSound().touch();

    
    //pause-screen
    Q.Sprite.extend("PauseScreen", {
        init: function (p) {
            this._super(p, {
                sheet: "pause",
                //sprite: "pause",
                x: 560,
                y: 400,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            //this.add("animation");
            //this.play("title-screen");
        },
        playAnimation: function () {
            //this.play("animacion");
        }
    });

    //title-screen
    Q.Sprite.extend("TitleScreen", {
        init: function (p) {
            this._super(p, {
                sheet: "title-screen",
                sprite: "title-screen",
                x: 570,
                y: 1470,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            this.add("animation");
            //this.play("title-screen");
        },
        playAnimation: function () {
            this.play("animacion");
        }
    });

    //title-screen
    Q.Sprite.extend("Startscreen", {
        init: function (p) {
            this._super(p, {
                sheet: "title-start",
                sprite: "start-screen",
                x: 570,
                y: 1470,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            this.add("animation");
        },
        playAnimation: function () {
            this.play("animacion2");
        }
    });

    //game-over
    Q.Sprite.extend("GameOver", {
        init: function (p) {
            this._super(p, {
                sheet: "game-over",
                //sprite: "title-screen",
                x: 570,
                y: 1470,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            //this.add("animation");
            //this.play("title-screen");
        },
        playAnimation: function () {
            //this.play("animacion");
        }
    });

    function drawLines(ctx) {
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        for (var x = 0; x < 1000; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 800);
            ctx.stroke();
        }
        ctx.restore();
    }

    function setViewport(door) {
        var samus = Q("Samus").first();
        if (door.p.nextRoom == "horizontal" && door.p.viewport == 2258) {
            console.log("sala con lava");
            Q.audio.play("../sounds/lava.mp3", { loop: true });
        }
        else Q.audio.stop("../sounds/lava.mp3");

        if (door.p.nextRoom === "vertical") {
            door.stage.add("viewport").follow(samus, { x: false, y: true });
            door.stage.viewport.x = door.p.viewport;
            samus.p.actualViewport = "vertical";
            samus.p.lastVerifiedX = door.p.viewport;
        } else {
            door.stage.add("viewport").follow(samus, { x: true, y: false });
            door.stage.viewport.y = door.p.viewport;
            samus.p.actualViewport = "horizontal";
            samus.p.lastVerifiedY = door.p.viewport;
        }

    }

    //Samus
    Q.Sprite.extend("Samus", {
        init: function (p) {
            this._super(p, {
                sheet: "samus",
                sprite: "samus_anim",
                x: 1920, //x:570
                y: 1470,
                frame: 0,
                scale: 1,
                gravityY: 540,
                canBecomeBall: false,
                canBreakWall: false,
                canRedDoors : false,
                canBeHit: true,
                ballmode: false,
                paused: false,
                actualViewport: "horizontal",
                lastVerifiedX: 400,
                lastVerifiedY: 1300,
            });
            this.add("2d , platformerControls, animation, tween, dancer");
            Q.input.on("esc", this, function(){
                if(!this.p.paused){
                    console.log("Pongo el juego en pause");
                    var pause = new Q.PauseScreen();
                    //console.log(pause);
                    console.log(Q.stage(1));
                    Q.stage(1).insert(pause); 
                    Q.stage(1).unfollow();
                    //Q.stage(1).centerOn(560, 400);
                    Q.stage(1).viewport.scale = 1.1;
                    Q.stage(1).viewport.y = 50;
                    Q.stage(1).viewport.x = 200;
                    //console.log(Q.stage(1));
                    setTimeout(function () {
                        Q.stage(1).pause();
                    }, 10);
                    Q.audio.play("../sounds/pause.mp3");
                    this.p.paused = true;  

                }
                else{
                    console.log("Reanudo el juego");
                    var samus = Q.stage(1).lists.Samus[0];
                    var pause = Q.stage(1).lists.PauseScreen[0];
                    //Q("PauseScreen").first();
                    console.log(pause);
                    pause.destroy();
                    Q.stage(1).unpause();
                    //Q.stage(1).viewport.y = 570;
                    //Q.stage(1).viewport.x = 400;
                    Q.stage(1).viewport.scale = 3.05;
                    if(this.p.actualViewport == "horizontal") {Q.stage(1).add("viewport").follow(samus, { x: true, y: false }); Q.stage(1).viewport.y = this.p.lastVerifiedY;}
                    else {Q.stage(1).add("viewport").follow(samus, { x: false, y: true }); Q.stage(1).viewport.x = this.p.lastVerifiedX;}
                    //Q.stage(1).viewport.scale = 3.1;
                    //Q.stage(1).viewport.y = 1350;
                    //Q.stage(1).viewport.x = 400;
                    //Q.stage(1).viewport.follow(samus, { x: true, y: false });
                    Q.audio.play("../sounds/pause.mp3");
                    this.p.paused = false; 
                }
            });
            Q.input.on("up", this, function () {
                // this.p.ballmode = false;
                if (this.p.ballmode)
                    return;

                this.p.points = [[-this.p.w / 2, -this.p.h / 2], [this.p.w / 2, -this.p.h / 2], [this.p.w / 2, this.p.h / 2], [-this.p.w / 2, this.p.h / 2]];
                if (this.p.vy == 0) {
                    this.play("jump_left");
                    Q.audio.play("../sounds/jump.mp3");
                }
            });
            Q.input.on("left", this, function () {
                this.p.direction = "left";
            });
            Q.input.on("right", this, function () {
                this.p.direction = "right";
            });
            Q.input.on("down", this, function () {
                //this.p.sheet = "samusball";

                
                if (this.p.canBecomeBall) {
                    this.play("samusball");
                    this.p.points = [[-this.p.w / 2, -this.p.h / 32], [this.p.w / 2, -this.p.h / 32], [this.p.w / 2, this.p.h / 2], [-this.p.w / 2, this.p.h / 2]];
                    this.p.ballmode = true;
                }
            });
            Q.input.on("top", this, function () {
                if(this.p.ballmode){
                    this.p.ballmode = false;
                    this.p.points = [[-this.p.w / 2, -this.p.h / 2], [this.p.w / 2, -this.p.h / 2], [this.p.w / 2, this.p.h / 2], [-this.p.w / 2, this.p.h / 2]];
                }
                if (this.p.direction == "right") {
                    this.play("parado_up_r");
                    this.p.direction = "up";
                }
                else {
                    this.play("parado_up_l");
                    this.p.direction = "up";
                }
            });

            Q.input.on("fire", this, "shoot");

        },
        step: function (dt) {
            if (this.p.vx > 0) {
                if (this.p.ballmode) {
                    this.play("samusball");
                }
                else {
                    this.play("walk_right");
                }
            } else if (this.p.vx < 0) {
                if (this.p.ballmode) {
                    this.play("samusball");
                }
                else {
                    this.play("walk_left");
                }
            }


            if (this.p.vy < 0) {
                if (!this.p.ballmode) {
                    if (this.p.vx < 0) {
                        this.play("jump_left");
                    }
                    else if (this.p.vx > 0) {
                        this.play("jump_right");
                    }
                }
            }

            if (!this.p.canBeHit) {
                var that = this;
                setInterval(function () {
                    that.p.canBeHit = true;
                }, 1000);
            }
        },
        shoot: function () {
            Q.audio.play("../sounds/shot.mp3");

            if (this.p.ballmode){
                this.p.ballmode = false;
                this.p.points = [[-this.p.w / 2, -this.p.h / 2], [this.p.w / 2, -this.p.h / 2], [this.p.w / 2, this.p.h / 2], [-this.p.w / 2, this.p.h / 2]];
            }

            if (this.p.direction == "right") {
                this.play("shoot_r");
                Q.stage(1).insert(new Q.Bala({ x: this.p.x + this.p.w, y: this.p.y, direction: this.p.direction, vx: 400, init: this.p.x }));
            }
            else if (this.p.direction == "left") {
                this.play("shoot_l");
                Q.stage(1).insert(new Q.Bala({ x: this.p.x - this.p.w, y: this.p.y, direction: this.p.direction, vx: -400, init: this.p.x }));
            }
            else {
                Q.stage(1).insert(new Q.Bala({ x: this.p.x, y: this.p.y - (this.p.h - 10), direction: this.p.direction, vy: -400, init: this.p.y }));
            }
        },

        die: function (damage) {
            console.log(Q.state.get("lives"));
            if (this.p.canBeHit) {
                this.p.canBeHit = false;
                this.play("morir");
                Q.state.dec("lives", damage);
                if (Q.state.get("lives") < 0) {
                    this.destroy();
                    Q.stageScene("gameOver", 2);
                    //Q.audio.play("../sounds/deathsound.mp3");
                }
            }
        }
    });

    Q.Sprite.extend("Bala", {
        init: function (p) {
            this._super(p, {
                asset: "shot.png",
                damage: 1,
                vx: -400,
                direction: "left",
                init: 0,
                max: 120
            });

            this.on("hit", this, "collision");

        },

        collision: function (col) {
            if (col) {
                col.obj.damage(this.p.damage);
            }

            this.destroy();
        },

        step: function (dt) {
            if (this.p.direction == "up") {
                this.p.y += this.p.vy * dt;
                if (this.p.y < this.p.init - this.p.max || this.p.y > this.p.init + this.p.max)
                    this.destroy();
            }
            else {
                this.p.x += this.p.vx * dt;
                if (this.p.x < this.p.init - this.p.max || this.p.x > this.p.init + this.p.max)
                    this.destroy();
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
                lives_e: 2,
                damage: 7,
                vx: 0,
                vy: 0,
                dt: 5,
                fall: false,
            });
            //this.add("2d, aiBounce, animation");
            this.add("2d, animation");
            this.play("parado");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
        },
        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            Q.audio.play("../sounds/hit.mp3");
            console.log("Me di contra un taladrillo");
            collision.obj.p.vy = -5;
            collision.obj.p.vx = collision.normalX * -500;
            collision.obj.p.x += collision.normalX * -5;
            collision.obj.die(this.p.damage);
            this.damage(2);
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

    //PuertaIzquierda
    Q.Sprite.extend("PuertaIzquierda", {
        init: function (p) {
            this._super(p, {

                sheet: "puertas",
                sprite: "puerta_anim",
                frame: 3,
                scale: 1,
                gravity: 0,
                is_open: false,
                lives: 2

            });
            this.add("2d, animation");
            //this.on("sensor", this, "open");
            this.on("bump.left", this, "open");
        },

        open: function (collision) {
            if (collision.obj.isA("Samus") && this.p.is_open) {
                console.log("he tocado una puerta");
                this.play("puerta_izquierda");

                Q.audio.play("../sounds/go_through_door.mp3");
                collision.obj.p.x += 81;

                setViewport(this);

                var that = this;
                setTimeout(function () {
                    that.play("puerta_iz_arreglando");
                }, 5000);
            }
        },

        damage: function (dmg) {
            this.p.lives = this.p.lives - dmg;
            if (this.p.lives == 1) {
                this.play("puerta_iz_rompiendo");
            }
            else if (this.p.lives == 0) {
                this.play("puerta_rota");
                this.p.is_open = true;
                var that = this;
                setTimeout(function () {
                    that.p.lives = 2;
                    that.p.is_open = false;
                    that.play("puerta_iz_arreglando");
                }, 5000);
            }
        }
    });
    //PuertaDerecha
    Q.Sprite.extend("PuertaDerecha", {
        init: function (p) {
            this._super(p, {
                sheet: "puertas",
                sprite: "puerta_anim",
                frame: 0,
                scale: 1,
                gravity: 0,
                is_open: false,
                lives: 2
            });
            this.add("2d, animation");
            this.on("bump.right", this, "open");
        },

        open: function (collision) {
            if (collision.obj.isA("Samus") && this.p.is_open) {
                console.log("he tocado una puerta");
                this.play("puerta_derecha");
                Q.audio.play("../sounds/go_through_door.mp3");
                collision.obj.p.x -= 81;

                setViewport(this);

                var that = this;
                setTimeout(function () {
                    that.play("puerta_der_arreglando");
                }, 5000);
            }
        },
        damage: function (dmg) {
            this.p.lives = this.p.lives - dmg;
            if (this.p.lives == 1) {
                this.play("puerta_der_rompiendo");
            }
            else if (this.p.lives == 0) {
                this.play("puerta_rota");
                this.p.is_open = true;
                var that = this;
                setTimeout(function () {
                    that.p.lives = 2;
                    that.p.is_open = false;
                    that.play("puerta_der_arreglando");
                }, 5000);
            }
        }
    });

    //PuertaIzquierdaRoja
    Q.Sprite.extend("PuertaRojaIzquierda", {
        init: function (p) {
            this._super(p, {

                sheet: "puertaRoja",
                sprite: "puerta_roja_anim",
                frame: 3,
                scale: 1,
                gravity: 0,
                is_open: false,
                lives: 2

            });
            this.add("2d, animation");
            //this.on("sensor", this, "open");
            this.on("bump.left", this, "open");
        },

        open: function (collision) {
            if (collision.obj.isA("Samus") && this.p.is_open) {
                console.log("he tocado una puerta");
                this.play("puerta_izquierda");

                Q.audio.play("../sounds/go_through_door.mp3");
                collision.obj.p.x += 81;

                setViewport(this);

                var that = this;
                setTimeout(function () {
                    that.play("puerta_iz_arreglando");
                }, 5000);
            }
        },

        damage: function (dmg) {
            var samus = Q("Samus").first();
            //if(samus.p.canRedDoors == false){return;}
            this.p.lives = this.p.lives - dmg;
            if (this.p.lives == 1) {
                this.play("puerta_iz_rompiendo");
            }
            else if (this.p.lives == 0) {
                this.play("puerta_rota");
                this.p.is_open = true;
                var that = this;
                setTimeout(function () {
                    that.p.lives = 2;
                    that.p.is_open = false;
                    that.play("puerta_iz_arreglando");
                }, 5000);
            }
        }
    });

    //PuertaDerechaRoja
    Q.Sprite.extend("PuertaRojaDerecha", {
        init: function (p) {
            this._super(p, {
                sheet: "puertaRoja",
                sprite: "puerta_roja_anim",
                frame: 0,
                scale: 1,
                gravity: 0,
                is_open: false,
                lives: 2
            });
            this.add("2d, animation");
            this.on("bump.right", this, "open");
        },

        open: function (collision) {
            if (collision.obj.isA("Samus") && this.p.is_open) {
                console.log("he tocado una puerta");
                this.play("puerta_derecha");
                Q.audio.play("../sounds/go_through_door.mp3");
                collision.obj.p.x -= 81;

                setViewport(this);

                var that = this;
                setTimeout(function () {
                    that.play("puerta_der_arreglando");
                }, 5000);
            }
        },
        damage: function (dmg) {
            var samus = Q("Samus").first();
            //if(samus.p.canRedDoors == false){return;}
            this.p.lives = this.p.lives - dmg;
            if (this.p.lives == 1) {
                this.play("puerta_der_rompiendo");
            }
            else if (this.p.lives == 0) {
                this.play("puerta_rota");
                this.p.is_open = true;
                var that = this;
                setTimeout(function () {
                    that.p.lives = 2;
                    that.p.is_open = false;
                    that.play("puerta_der_arreglando");
                }, 5000);
            }
        }
    });

    Q.Sprite.extend("Orbe", {
        init: function (p) {
            this._super(p, {
                sheet: "orbes",
                frame: 0,
                scale: 1,
                gravity: 0,
                sensor: true,
                taken: false
            });
            this.add("2d, tween");

            this.on("sensor", this, "hit");
        },
        hit: function (collision) {
            if (this.taken) return;
            if (!collision.isA("Samus")) return;
            console.log(this);
            this.taken = true;
            if (this.p.type == "ball") collision.p.canBecomeBall = true;
            else if (this.p.type == "breakWall") collision.p.canBreakWall = true;
            else if (this.p.type == "redDoors") collision.p.canRedDoors = true;
            console.log("He cogido el orbe de doors ", collision.p.canRedDoors);
            Q.audio.stop();
            Q.audio.play("../sounds/item.mp3");

            Q.audio.stop("../sounds/elevatormusic.mp3");
            setTimeout(function () {
                Q.audio.play("../sounds/elevatormusic.mp3");
            }, 3000)
            //collision.p.vy = -400;
            //Q.audio.play("1up.mp3");
            this.destroy();
        },
        damage: function (dmg) {
        }
    });

    Q.Sprite.extend("BreakBlock", {
        init: function (p) {
            this._super(p, {
                asset: "break_block.png",
                //sensor: true
                collision: true
            });
            this.add("2d, tween");
            this.on("bump.left, bump.right", this, "hit");
        },
        hit: function (collision) {
            console.log("Me di");
            if (this.taken) return;
            if (!collision.obj.isA("Samus")) return;
            console.log(collision.obj);
            if (!collision.obj.p.canBreakWall) return;
            if (!collision.obj.p.ballmode) return;
            console.log("Mec");
            this.taken = true;
            this.destroy();
        },
        damage: function (dmg) {
        }
    });

    //Larva
    Q.Sprite.extend("Larva", {
        init: function (p) {
            this._super(p, {
                sheet: "larvas",
                sprite: "larvas_anim",
                //x:400+(Math.random()*200),
                //y:250,
                frame: 0,
                vx: 60,
                gravity: 0,
                damage: 7,
                lives: 2,
            });
            this.add("2d, aiBounce, animation");
            //this.play("goomba");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
            //this.on("bump.bottom, bump.left, bump.right", this, "kill");


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

        },
        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            Q.audio.play("../sounds/hit.mp3");
            //collision.obj.p.vy = -200;
            //collision.obj.p.vx = collision.normalX*-500;
            //collision.obj.p.x += collision.normalX*-5;
            console.log("Me he chocado contra una larva");
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
            //collision.obj.p.vy = -200;
            //collision.obj.p.vx = collision.normalX*-500;
            //collision.obj.p.x += collision.normalX*-5;
            console.log("Me he caido en la lava");
            Q.audio.play("../sounds/hit.mp3");
            collision.obj.die(this.p.damage);
        },
        damage: function (dmg) {
        }
    });

    //Vidas
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
                //sprite: "explosion_anim",
                scale: 1,
                frame: 0,
                time: 0,
                points: [[0, 0], [0, 0], [0, 0], [0, 0]], //Para que no tenga colisiones
            });
            //this.add("animation");
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

    //Ascensor
    Q.Sprite.extend("Ascensor", {
         init: function (p) {
             this._super(p, {
                 sheet: "ascensor",
                 //sprite: "ascensor_anim",
                 //damage: 7,
                 frame: 0,
                 vx : 0,
                 gravityY : 0
             });
             this.add("2d, animation");
             this.on("bump.bottom, bump.top, bump.left, bump.right", this, "move");
             //this.on("bump.bottom, bump.left, bump.right", this, "kill");


         },
         move: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            //collision.obj.p.vy = -200;
            //collision.obj.p.vx = collision.normalX*-500;
            //collision.obj.p.x += collision.normalX*-5;
            console.log("Me he caido en un ascensor");
            
            this.p.vy = 30;
            var that = this;
            setTimeout(function () {
                console.log(that);
                that.p.vy = 0;
                //Q.stageScene("hud", 2);
                //Q.stageScene("gameOver", 1);
            }, 5000);
             //collision.obj.die(this.p.damage);

             //collision.obj.die(this.p.damage);
         },
         damage: function (dmg) {
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
                lives: 1,
            });
            this.add("2d, animation");
            this.play("motherbrain");
            this.on("bump.left, bump.right", this, "kill");


        },
        damage: function (dmg) {
            console.log(this.p.x);
            this.p.lives = this.p.lives - dmg;
            this.p.x=2705;
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

        },
        kill: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            Q.audio.play("../sounds/hit.mp3");
            collision.obj.p.vy = -200;
            collision.obj.p.vx = collision.normalX*-500;
            collision.obj.p.x += collision.normalX*-5;
            console.log("Me he chocado contra motherbrain");
            collision.obj.die(this.p.damage);
        }

    });

    //MotherBrain

    Q.Sprite.extend("MotherBrainDoor", {
        init: function (p) {
            this._super(p, {
                asset: "motherbraindoor.png",
                //sensor: true
                collision: true
            });
            this.add("2d, tween");
            this.on("bump.left, bump.right", this, "hit");
        },
        hit: function (collision) {
            if (this.taken) return;
            if (!collision.obj.isA("Bala")) return;
            this.taken = true;
            this.destroy();
        },
        damage: function (dmg) {
        }
        
    });

    Q.load(["bg.png", "tiles_metroid_!6x16.png", "title-screen.gif", "taladrillo.png", "taladrillo.json", "samus.png", "samus.json", "map1.tmx", "../sounds/elevatormusic.mp3",
        "../sounds/titlescreen.mp3", "../sounds/elevatormusic.mp3", "../sounds/ending_alternative.mp3", "../sounds/start.mp3", "title-screen.json", "./titleScreens/pantallainicio/pantallainiciotitulo.png",
        "metroid_door.png", "puertas.json", "energia.png", "./titleScreens/pantallainicio/pantallainiciostart.png", "titleScreen.tsx", "letras.png", "Startscreen.tsx", "title-start.json", "../sounds/jump.mp3", "break_block.png",
        "../sounds/shot.mp3", "../sounds/go_through_door.mp3", "shot.png", "orbes.tsx", "orbe.json", "orbes.png", "pinchitos.png", "pinchitos.json", "lava.png", "lava.json", "larvas.png", "larvas.json", "larvas.tsx", "pinchitosPared.tsx",
        "../sounds/lava.mp3", "../sounds/item.mp3", "../sounds/gun.mp3", "../sounds/deathsound.mp3", "gameover.png", "game-over.json", "gameOver.tsx", "../sounds/ending_original.mp3",
        "vida.png", "vida.json", "explosion.png", "explosion.json", "ascensor.png", "ascensor.tsx", "ascensor.json", "pause.json", "pause.tsx", "pause.png", "../sounds/pause.mp3",
        "../sounds/hit.mp3", "motherbrainbase.png" , "motherbrainup.png" , "motherbraindoor.png" , "motherbrain.png" , "metroidreddoor.png", "motherbrain.json"],
        function () {

            Q.compileSheets("samus.png", "samus.json");
            Q.compileSheets("taladrillo.png", "taladrillo.json");
            Q.compileSheets("pinchitos.png", "pinchitos.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciotitulo.png", "title-screen.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciostart.png", "title-start.json");
            Q.compileSheets("metroid_door.png", "puertas.json");
            Q.compileSheets("metroidreddoor.png", "puertaRoja.json");
            Q.compileSheets("orbes.png", "orbe.json");
            Q.compileSheets("larvas.png", "larvas.json");
            Q.compileSheets("lava.png", "lava.json");
            Q.compileSheets("gameover.png", "game-over.json");
            Q.compileSheets("vida.png", "vida.json");
            Q.compileSheets("explosion.png", "explosion.json");
            Q.compileSheets("ascensor.png", "ascensor.json");
            Q.compileSheets("pause.png", "pause.json");
            Q.compileSheets("motherbrain.png", "motherbrain.json");

            Q.state.set({
                lives: 30,
                pause: false,
                enJuego: false //States
            });


            Q.animations("samus_anim", {
                walk_right: { frames: [15, 16, 17], rate: 1 / 6, next: "parado_r" },
                walk_left: { frames: [30, 31, 32], rate: 1 / 6, next: "parado_l" },
                jump_right: { frames: [7, 8, 9, 10], rate: 1 / 6, next: "parado_r" },
                jump_left: { frames: [7, 8, 9, 10], rate: 1 / 6, next: "parado_l" },
                parado_r: { frames: [53] },
                parado_l: { frames: [52] },
                parado_up_r: { frames: [2] },
                parado_up_l: { frames: [29] },
                shoot_r: { frames: [1] },
                shoot_l: { frames: [28] },
                morir: { frames: [49, 48], rate: 1 / 50 },
                samusball: { frames: [11, 12, 13, 14], rate: 1 / 6 }
            });

            /*
            Q.animations("ascensor_anim", {
                ascensor:{frames: [0]}
            });
            */
            

            Q.animations("larva_anim", {
                larva: { frames: [0] }
            });

            Q.animations("taladrillo_anim", {
                parado: { frames: [0, 1, 0, 2], rate: 1 },
                caida: { frames: [0, 1, 0, 2], rate: 1 / 2 }
            });

            Q.animations("title-screen", {
                animacion: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], rate: 1 }
            });

            Q.animations("start-screen", {
                animacion2: { frames: [1, 2, 3, 4], rate: 1, next: "fin" },
                fin: { frames: [4] }
            }); 

            Q.animations("motherbrain_anim", {
                motherbrain: { frames: [0, 1, 2, 3], rate: 1},
                motherbraindamage: { frames: [4], rate:1, next:"motherbrain" }
            });

            Q.animations("puerta_anim", {
                puerta_derecha: { frames: [0, 1, 2], rate: 1 / 6, next: "puerta_rota" },
                puerta_rota: { frames: [2] },
                puerta_izquierda: { frames: [3, 4, 5], rate: 1 / 6, next: "puerta_rota" },
                puerta_iz_arreglada: { frames: [3] },
                puerta_iz_rompiendo: { frames: [4] },
                puerta_der_rompiendo: { frames: [1] },
                puerta_der_arreglada: { frames: [0] },
                puerta_iz_arreglando: { frames: [5, 4, 3], rate: 1 / 6, next: "puerta_iz_arreglada" },
                puerta_der_arreglando: { frames: [0, 1, 2], rate: 1 / 6, next: "puerta_der_arreglada" }
            });

            Q.animations("puerta_roja_anim", {
                puerta_derecha: { frames: [0, 1, 2], rate: 1 / 6, next: "puerta_rota" },
                puerta_rota: { frames: [2] },
                puerta_izquierda: { frames: [3, 4, 5], rate: 1 / 6, next: "puerta_rota" },
                puerta_iz_arreglada: { frames: [3] },
                puerta_iz_rompiendo: { frames: [4] },
                puerta_der_rompiendo: { frames: [1] },
                puerta_der_arreglada: { frames: [0] },
                puerta_iz_arreglando: { frames: [5, 4, 3], rate: 1 / 6, next: "puerta_iz_arreglada" },
                puerta_der_arreglando: { frames: [0, 1, 2], rate: 1 / 6, next: "puerta_der_arreglada" }
            });


            Q.animations('pinchitos_anim', {
                pinchitos_normal: { frames: [0, 1], rate: 1 / 3 },
                pinchitos_derecha: { frames: [6, 7], rate: 1 / 3 },
                pinchitos_izquierda: { frames: [2, 3], rate: 1 / 3 },
                pinchitos_debajo: { frames: [4, 5], rate: 1 / 3 }
            });

            Q.animations("lava_anim", {
                lava: { frames: [0, 1], rate: 1 }
            });

            Q.animations("vida_anim", {
                vidas: { frames: [0, 1], rate: 1 / 2 }
            });

            Q.scene("map1", function (stage) {
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Samus();
                stage.insert(samus);

                //stage.on('postrender',drawLines);
                //Q.debug = true;

                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.05;
                stage.viewport.offsetX = 0;//-200
                stage.viewport.offsetY = 55;
                stage.viewport.y = 1300;

                // stage.add("viewport").follow(samus, { x: true, y: true });
                // stage.viewport.scale = 1.7;
                // stage.viewport.offsetX = 0;
                // stage.viewport.offsetY = 70;
                Q.audio.stop();
                Q.audio.play("../sounds/start.mp3");

                setTimeout(function () {
                    Q.audio.play("../sounds/elevatormusic.mp3", { loop: true });
                }, 5000);

                stage.on("destroy", function () {
                    samus.destroy();
                });

                Q.state.reset({ lives: 30 });

            });

            Q.scene("hud", function (stage) {
                var life_icon = stage.insert(new Q.UI.Button({
                    x: 80,
                    y: 70,
                    asset: 'energia.png'
                }));
                var label_lives = new Q.UI.Text({
                    family: "Metroid-Fusion",
                    color: "white",
                    x: 155,
                    y: 45,
                    size: 30,
                    label: "30"
                });
                stage.insert(label_lives);
                Q.state.on("change.lives", this, function () {
                    //console.log(Q.state.get("lives"));
                    label_lives.p.label = "" + Q.state.get("lives");
                });
            });

            Q.scene("mainTitle", function (stage) {

                console.log("Voy a contar la historia");
                //Q.audio.play("../sounds/titlescreen.mp3", {loop: true});
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Startscreen();
                stage.insert(samus);
                samus.playAnimation();

                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1355;
                stage.viewport.x = 400;

                console.log("Ya he generado el titleScreen");

                setTimeout(function () {
                    Q.clearStages();
                    Q.stageScene("map1", 1);
                    Q.stageScene("hud", 2);
                }, 5000);

            });

            Q.scene("gameOver", function (stage) {

                console.log("Se acabo el juego");
                Q.audio.stop();
                Q.audio.play("../sounds/ending_original.mp3");
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.GameOver();
                stage.insert(samus);
                samus.playAnimation();


                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1355;
                stage.viewport.x = 400;

                setTimeout(function () {
                    Q.clearStages();
                    Q.stageScene("startGame", 1);
                    //Q.stageScene("hud", 2);
                    //Q.stageScene("gameOver", 1);
                }, 5000);

                console.log("Ya he generado el gameOver");
            });

            Q.scene("startGame", function (stage) {

                console.log("Pantalla del principio del todo");
                Q.audio.play("../sounds/titlescreen.mp3", { loop: true });
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.TitleScreen();
                stage.insert(samus);
                samus.playAnimation();

                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1350;
                stage.viewport.x = 400;

                console.log("Ya he generado el titleScreen");

                var button = new Q.UI.Button({
                    x: 574,
                    y: 1480,
                    scale: 0.3,
                    font: "Metroid-Fusion",
                    label: "PULSA AQUI PARA CONTINUAR",
                    asset: "letras.png"
                });


                button.on("click", function () {
                    Q.clearStages();
                    Q.stageScene("mainTitle", 1);
                    //Q.stageScene("hud", 2);
                });

                stage.insert(button);
            });

            Q.scene('endGame', function (stage) {
                var container = stage.insert(new Q.UI.Container({
                    x: Q.width / 2,
                    y: Q.height / 2,
                    fill: "rgba(1, 81, 135, 0.75)"
                }));
                var button = container.insert(new Q.UI.Button({
                    x: 0,
                    y: 0,
                    fill: "#CCCCCC",
                    label: "Play Again"
                }));
                var label = container.insert(new Q.UI.Text({
                    x: 0,
                    y: -15 - button.p.h,
                    color: "red",
                    label: "Game Over"
                }));

                button.on("click", function () {
                    Q.clearStages();
                    Q.stageScene("mainTitle", 1);
                });
                container.fit(20);
            });

            Q.scene('winGame', function (stage) {
                var container = stage.insert(new Q.UI.Container({
                    x: Q.width / 2, y: Q.height / 2, fill: "rgba(0,0,0,0.5)"
                }));
                var button2 = container.insert(new Q.UI.Button({
                    x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
                }));
                var label = container.insert(new Q.UI.Text({
                    x: 10, y: -10 - button2.p.h, label: "You Won!"
                }));
                button2.on("click", function () {
                    Q.clearStages();
                    Q.stageScene('mainTitle');
                });
                container.fit(20);
            });

            Q.stageScene("startGame");

        });
}