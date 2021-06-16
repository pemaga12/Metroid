var game = function () {

    var Q = window.Q = Quintus()
        .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
        .setup("myGame", {
            width: 768,
            height: 720,
        })
        .controls().controls().enableSound().touch();


////////////////////////////////////////////////////////////////////////
////Pantallas, Draw Lines y otros
////////////////////////////////////////////////////////////////////////

    //Title screen

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
        },
        playAnimation: function () {
            this.play("animacion");
        }
    });

    //Start screen

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

    //Pause screen

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
        },
        playAnimation: function () {
        }
    });

    //Win screen

    Q.Sprite.extend("WinScreen", {
        init: function (p) {
            this._super(p, {
                sheet: "win-screen",
                sprite: "win-screen",
                x: 570,
                y: 1470,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            this.add("animation");
        },
        playAnimation: function () {
           //this.play("win_animation");
        }
    });

    //Game Over Screen

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
        },
        playAnimation: function () {}
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

////////////////////////////////////////////////////////////////////////
////Samus
////////////////////////////////////////////////////////////////////////

    Q.Sprite.extend("Samus", {
        init: function (p) {
            this._super(p, {
                sheet: "samus",
                sprite: "samus_anim",
                x: 570, //1536
                y: 1470, 
                frame: 0,
                scale: 1,
                gravityY: 540,
                canBecomeBall: true,
                canBreakWall: true,
                canRedDoors : true,
                opacity:1,
                reloadTime:1,
                reload:1,
                ballmode: false,
                paused: false,
                actualViewport: "horizontal",
                lastVerifiedX: 400,
                lastVerifiedY: 1300,
            });
            this.add("2d , platformerControls, animation, tween, dancer");
            Q.input.on("esc", this, function(){
                if(!this.p.paused){
                    var pause = new Q.PauseScreen();
                    Q.stage(1).insert(pause); 
                    Q.stage(1).unfollow();
                    Q.stage(1).viewport.scale = 1.1;
                    Q.stage(1).viewport.y = 50;
                    Q.stage(1).viewport.x = 200;
                    setTimeout(function () {
                        Q.stage(1).pause();
                    }, 10);
                    Q.audio.play("../sounds/pause.mp3");
                    this.p.paused = true;  

                }
                else{
                    var samus = Q.stage(1).lists.Samus[0];
                    var pause = Q.stage(1).lists.PauseScreen[0];
                    pause.destroy();
                    Q.stage(1).unpause();
                    Q.stage(1).viewport.scale = 3.05;
                    if(this.p.actualViewport == "horizontal") {Q.stage(1).add("viewport").follow(samus, { x: true, y: false }); Q.stage(1).viewport.y = this.p.lastVerifiedY;}
                    else {Q.stage(1).add("viewport").follow(samus, { x: false, y: true }); Q.stage(1).viewport.x = this.p.lastVerifiedX;}
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

            this.p.reload -= dt;
            if(this.p.reload < 0){
                this.p.opacity = 1;
            }
            else{
                this.p.opacity = 0.75;
            }

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
            if (this.p.reload < 0) {
                this.p.reload = this.p.reloadTime;
                this.play("morir");
                Q.state.dec("lives", damage);
                if (Q.state.get("lives") < 0) {
                    this.destroy();
                    Q.stageScene("gameOver", 2);
                    Q.audio.play("../sounds/deathsound.mp3");
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

////////////////////////////////////////////////////////////////////////
////Loads
////////////////////////////////////////////////////////////////////////

    Q.load([
        //pantalla
            "bg.png", "tiles_metroid_!6x16.png", "map1.tmx",
            "title-screen.gif", "title-screen.json", "./titleScreens/pantallainicio/pantallainiciotitulo.png",
            "energia.png", "./titleScreens/pantallainicio/pantallainiciostart.png", "letras.png", "title-start.json",  
            "gameover.png", "game-over.json", "pause.json", "pause.png", "gamewin.png","win-screen.json",
        //samus
            "samus.png", "samus.json", "shot.png",
        //objetos:
            "canion1.png","canion2.png","canion3.png","shot_canion.png", 
            "motherbrainbase.png", "motherbrainup.png", "motherbraindoor.png",
            "metroidreddoor.png", "metroid_door.png", "puertas.json",
            "orbe.json", "orbes.png", 
            "winzone.png",
            "ascensor.png",
            "break_block.png",
        //audios:
            "../sounds/elevatormusic.mp3", "../sounds/titlescreen.mp3", "../sounds/elevatormusic.mp3", "../sounds/ending_alternative.mp3", "../sounds/start.mp3",
            "../sounds/jump.mp3", "../sounds/pause.mp3",  "../sounds/ending_original.mp3", "../sounds/hit.mp3", "../sounds/shot.mp3", "../sounds/go_through_door.mp3",
            "../sounds/lava.mp3", "../sounds/item.mp3", "../sounds/gun.mp3", "../sounds/deathsound.mp3",
        //enemigos:
            "pinchitos.png","pinchitos.json",
            "taladrillo.png", "taladrillo.json",
            "larvas.png", "larvas.json",
            "saltamontes.png", "saltamontes.json",
            "motherbrain.png", "motherbrain.json", 
            "lava.png", "lava.json",
            "vida.png", "vida.json",
            "explosion.png", "explosion.json"],

        function () {

            //Carga de los archivos enemies.js y objects.js
            enemies();
            objects();

            Q.compileSheets("samus.png", "samus.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciotitulo.png", "title-screen.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciostart.png", "title-start.json");
            Q.compileSheets("gamewin.png", "win-screen.json");
            Q.compileSheets("gameover.png", "game-over.json");
            Q.compileSheets("pause.png", "pause.json");

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

            Q.animations("title-screen", {
                animacion: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], rate: 1 }
            });

            Q.animations("start-screen", {
                animacion2: { frames: [1, 2, 3, 4], rate: 1, next: "fin" },
                fin: { frames: [4] }
            });

            Q.animations("win-screen", {
                win_animation: { frames: [0, 1], rate: 1 }
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
                    label_lives.p.label = "" + Q.state.get("lives");
                });
            });

            Q.scene("mainTitle", function (stage) {

                //Q.audio.play("../sounds/titlescreen.mp3", {loop: true});
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Startscreen();
                stage.insert(samus);
                samus.playAnimation();

                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1355;
                stage.viewport.x = 400;

                setTimeout(function () {
                    Q.clearStages();
                    Q.stageScene("map1", 1);
                    Q.stageScene("hud", 2);
                }, 5000);

            });

            Q.scene('winGame', function (stage) {
                Q.audio.stop();
                Q.audio.play("../sounds/ending_original.mp3");
                Q.stageTMX("map1.tmx", stage);

                var win = new Q.WinScreen();
                stage.insert(win);
                win.playAnimation();


                stage.add("viewport").follow(win, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1355;
                stage.viewport.x = 400;

                setTimeout(function () {
                    Q.clearStages();
                    Q.stageScene("startGame", 1);
                }, 10000);

            });

            Q.scene("gameOver", function (stage) {
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
                }, 5000);

            });

            Q.scene("startGame", function (stage) {

                Q.audio.play("../sounds/titlescreen.mp3", { loop: true });
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.TitleScreen();
                stage.insert(samus);
                samus.playAnimation();

                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1350;
                stage.viewport.x = 400;

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
                });

                stage.insert(button);
            });

            Q.stageScene("startGame");

        });
}