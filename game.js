var game = function () {

    var Q = window.Q = Quintus()
        .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
        .setup("myGame", {
            width: 768,
            height: 720,
            // scaleToFit: true
        })
        .controls().controls().enableSound().touch();


    //title-screen
    Q.Sprite.extend("TitleScreen", {
        init: function(p) {
            this._super(p,{
                sheet: "title-screen",
                sprite: "title-screen",
                x:570,
                y:1470,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            this.add("animation");
            //this.play("title-screen");
        },
        playAnimation: function(){
            this.play("animacion");
        }
    });

    //title-screen
    Q.Sprite.extend("Startscreen", {
        init: function(p) {
            this._super(p,{
                sheet: "title-start",
                sprite: "start-screen",
                x:570,
                y:1470,
                frame: 0,
                scale: 1,
                gravityY: 0
            });
            this.add("animation");
        },
        playAnimation: function(){
            this.play("animacion2");
        }
    });
    
    function drawLines(ctx) {
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        for(var x = 0;x < 1000;x+=100) {
            ctx.beginPath();
            ctx.moveTo(x,0);
            ctx.lineTo(x,800);
            ctx.stroke();
        }
        ctx.restore();
        }

    function setViewport(door){
        var samus = Q("Samus").first();

        if(door.p.nextRoom === "vertical"){
            door.stage.add("viewport").follow(samus, { x: false, y: true });
            door.stage.viewport.x = door.p.viewport;
        }else{
            door.stage.add("viewport").follow(samus, { x: true, y: false });
            door.stage.viewport.y = door.p.viewport;
        }
        
    }

    //Samus
    Q.Sprite.extend("Samus",{
        init: function (p) {
            this._super(p, {
                sheet: "samus",
                sprite: "samus_anim",
                x: 570,
                y: 1470,
                frame: 0,
                scale: 1,
                gravityY: 540
            });
            this.add("2d , platformerControls, animation, tween, dancer");
            Q.input.on("up", this, function () {
                if (this.p.vy == 0) {
                    this.play("jump_left");
                    Q.audio.play("../sounds/jump.mp3");
                }
            });

            Q.input.on("fire", this, "shoot");

        },
        step: function (dt) {
            if (this.p.vx > 0) {
                this.play("walk_right");
            } else if (this.p.vx < 0) {
                this.play("walk_left");
            }
            

            if (this.p.vy < 0) {
                if (this.p.vx < 0)
                    this.play("jump_left");

                else if (this.p.vx > 0)
                    this.play("jump_right");
            }
        },
        shoot: function (){
            Q.audio.play("../sounds/shot.mp3");
            if(this.p.direction == "right"){
                Q.stage(1).insert(new Q.Bala({x: this.p.x + this.p.w, y: this.p.y, direction: this.p.direction, vx: 400, init: this.p.x}));
            }
            else if(this.p.direction == "left"){
                Q.stage(1).insert(new Q.Bala({x: this.p.x - this.p.w, y: this.p.y, direction: this.p.direction, vx: -400, init: this.p.x}));
            }
            else{
                Q.stage(1).insert(new Q.Bala({x: this.p.x, y: this.p.y - this.p.w, direction: this.p.direction, vy: -400, init: this.p.y}));
            }
        }
    });

    Q.Sprite.extend("Bala", {
        init: function(p){
            this._super(p, {
                asset: "shot.png",
                damage: 1,
                vx: -400,
                direction: "left",
                init: 0,
                max: 1000
            });

            this.on("hit" , this, "collision");

        },

        collision: function(col){
           col.obj.damage(this.p.damage)
		   this.destroy();
        },

        step: function(dt){
            this.p.x += this.p.vx * dt;
			if(this.p.x < this.p.init - this.p.max || this.p.x > this.p.init + this.p.max)
				this.destroy();
        }
    });

    //Taladrillo
    Q.Sprite.extend("Taladrillo",{

    });

    //PuertaIzquierda
    Q.Sprite.extend("PuertaIzquierda",{
        init: function(p) {
            this._super(p,{
                
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
        
        open: function(collision){
            console.log("he tocado una puerta"); 
            this.play("puerta_izquierda");

            Q.audio.play("../sounds/go_through_door.mp3");
            collision.obj.p.x += 81;

            setViewport(this);
            
            var that = this;
            setTimeout(function(){
               that.play("puerta_iz_arreglando");
            }, 5000); 
        }
    });
    //PuertaDerecha
    Q.Sprite.extend("PuertaDerecha",{
        init: function(p) {
            this._super(p,{
                sheet: "puertas",
                sprite: "puerta_anim",
                frame: 0,
                scale: 1
            });
            this.add("2d, animation");
            this.on("bump.right", this, "open");
        },

        open: function(collision){
            console.log("he tocado una puerta");
            this.play("puerta_derecha");
            Q.audio.play("../sounds/go_through_door.mp3");
            collision.obj.p.x -= 81;

            setViewport(this);

            var that = this;
            setTimeout(function(){
               that.play("puerta_der_arreglando");
            }, 5000);
        }
    });


    Q.load(["bg.png", "tiles_metroid_!6x16.png","title-screen.gif", "./Enemys/taladrillo.png", "taladrillo.json","samus.png", "samus.json", "map1.tmx", "../sounds/elevatormusic.mp3", 
    "../sounds/titlescreen.mp3", "../sounds/elevatormusic.mp3", "../sounds/ending_alternative.mp3", "../sounds/start.mp3", "title-screen.json", "./titleScreens/pantallainicio/pantallainiciotitulo.png",
    "metroid_door.png", "puertas.json","energia.png", "./titleScreens/pantallainicio/pantallainiciostart.png", "titleScreen.tsx", "letras.png", "Startscreen.tsx", "title-start.json", "../sounds/jump.mp3",
    "../sounds/shot.mp3", "../sounds/go_through_door.mp3", "shot.png"],
        
        function () {
            
            Q.compileSheets("samus.png", "samus.json");
            Q.compileSheets("./Enemys/taladrillo.png", "taladrillo.json");
            Q.compileSheets("./Enemys/pinchitos.png", "pinchito.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciotitulo.png","title-screen.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciostart.png", "title-start.json");
            Q.compileSheets("metroid_door.png", "puertas.json");

            Q.state.set({ energy: 30,
                pause:false,enJuego:false, //States
            });


            Q.animations("samus_anim",{
                walk_right: {frames: [15,16,17],rate: 1/6, next: "parado_r" },
                walk_left: {frames: [30,31,32],rate: 1/6, next: "parado_l" },
                jump_right: {frames: [7,8,9,10],rate: 1/6, next: "parado_r" },
                jump_left: {frames: [7,8,9,10],rate: 1/6, next: "parado_l" },
                parado_r: {frames: [53] },
                parado_l: {frames: [52] },
                parado_up_r: {frames: [2]},
                parado_up_l: {frames:[29]},
                morir:{frames: [49,48],rate:1/50},
                ball:{frames: [11,12,13,14], rate:1/6, next: "parado_r"}
            });

            Q.animations("title-screen",{
                animacion: {frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], rate: 1/4}
            });

            Q.animations("start-screen" , {
                animacion2: {frames: [1,2,3,4] , rate: 1/4, next: "fin"},
                fin: {frames: [4]}
            });
            
            Q.animations("puerta_anim", {
                puerta_derecha: {frames: [0,1,2], rate: 1/6, next: "puerta_rota"},
                puerta_rota: {frames:[2]},
                puerta_izquierda: {frames: [3,4,5], rate: 1/6, next: "puerta_rota"},
                puerta_iz_arreglada: {frames: [3]},
                puerta_der_arreglada: {frames: [0]},
                puerta_iz_arreglando: {frames: [5,4,3], rate: 1/6, next: "puerta_iz_arreglada"},
                puerta_der_arreglando: {frames: [2,1,0], rate: 1/6, next: "puerta_der_arreglada"}
            });

            Q.scene("map1", function (stage) {
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Samus();
                stage.insert(samus);
                // stage.on('postrender',drawLines);
                
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
                setTimeout(function(){
                    Q.audio.play("../sounds/elevatormusic.mp3", {loop: true});
                }, 5000);
    

                stage.on("destroy", function () {
                    samus.destroy();
                });

                Q.state.reset({lives: 4, coins: 0, score: 0});

                
                // Q.debug = true;
            });


            Q.scene("mainTitle", function (stage) {
               
                console.log("Voy a contar la historia");
                //Q.audio.play("../sounds/titlescreen.mp3", {loop: true});
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Startscreen();
                stage.insert(samus);     //\(>.<)/ 
                samus.playAnimation();
                
                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1350;
                stage.viewport.x = 400;
                
                console.log("Ya he generado el titleScreen");
                
                setTimeout(function(){
                    Q.clearStages();
                    Q.stageScene("map1", 1);
                    Q.stageScene("hud", 2);
                }, 5000);
    
               

            });

            Q.scene("startGame", function(stage){
                
                console.log("Pantalla del principio del todo");
                Q.audio.play("../sounds/titlescreen.mp3", {loop: true});
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.TitleScreen();
                stage.insert(samus);     //\(>.<)/ 
                samus.playAnimation();
                
                stage.add("viewport").follow(samus, { x: true, y: false });
                stage.viewport.scale = 3.1;
                stage.viewport.y = 1350;
                stage.viewport.x = 400;
                
                console.log("Ya he generado el titleScreen");
                
                var button = new Q.UI.Button({
                    x: 574,
                    y: 1480,
                    scale:0.3,
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
                    x: Q.width / 2, y: Q.height / 2, fill: "rgba(0,0,0,0.5)"
                }));
                var button2 = container.insert(new Q.UI.Button({
                    x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
                }));
                var label = container.insert(new Q.UI.Text({
                    x: 10, y: -10 - button2.p.h, label: "You Lose!"
                }));
                button2.on("click", function () {
                    Q.clearStages();
                    Q.stageScene('mainTitle');
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

            Q.scene("hud", function(stage){
                var life_icon = stage.insert(new Q.UI.Button({
                    x:80,
                    y:70,
                    asset: 'energia.png'
                }));
                label_lives = new Q.UI.Text({
                    family: "Metroid-Fusion",
                    color: "white",
                    x:155, 
                    y:45, 
                    size: 30,
                    label: "30"});
                stage.insert(label_lives);
                Q.state.on("change.energy", this, function(){
                  label_lives.p.label = Q.state.get("energy");
                });
            });

            Q.stageScene("startGame");
           

            // Q.stageScene("map1", 1);
            // Q.stageScene("hud", 2);

        });
} 