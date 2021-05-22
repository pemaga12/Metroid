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
                gravityY: 540,
                canBecomeBall: false,
                canBreakWall: false,
                ballmode: false
            });
            this.add("2d , platformerControls, animation, tween, dancer");
            Q.input.on("up", this, function () {
                this.p.ballmode = false;
                this.p.points =  [ [ -this.p.w/2, -this.p.h/2 ], [ this.p.w/2, -this.p.h/2 ], [ this.p.w/2, this.p.h/2 ], [-this.p.w/2, this.p.h/2 ] ];
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
                
                if(this.p.canBecomeBall){
                    this.play("samusball");
                    this.p.points =  [ [ -this.p.w/2, -this.p.h/32 ], [ this.p.w/2, -this.p.h/32 ], [ this.p.w/2, this.p.h/2 ], [-this.p.w/2, this.p.h/2 ] ];
                    this.p.ballmode = true;
                }
            });
            Q.input.on("action", this, function () {
                if(this.p.direction == "right"){
                    this.play("parado_up_r");
                    this.p.direction= "up";
                }
                else{
                    this.play("parado_up_l");
                    this.p.direction= "up";
                }
            });

            Q.input.on("fire", this, "shoot");

        },
        step: function (dt) {
            if (this.p.vx > 0) {
                if(this.p.ballmode){
                    this.play("samusball");
                }
                else{
                    this.play("walk_right");
                }
            } else if (this.p.vx < 0) {
                if(this.p.ballmode){
                    this.play("samusball");
                }
                else{
                    this.play("walk_left");
                }
            }
            

            if (this.p.vy < 0) {
                if (this.p.vx < 0){
                    this.play("jump_left");
                }
                else if (this.p.vx > 0){
                    this.play("jump_right");
                }
            }
        },
        shoot: function (){
            Q.audio.play("../sounds/shot.mp3");
            if(this.p.direction == "right"){
                this.play("shoot_r");
                Q.stage(1).insert(new Q.Bala({x: this.p.x + this.p.w, y: this.p.y, direction: this.p.direction, vx: 400, init: this.p.x}));
            }
            else if(this.p.direction == "left"){
                this.play("shoot_l");
                Q.stage(1).insert(new Q.Bala({x: this.p.x - this.p.w, y: this.p.y, direction: this.p.direction, vx: -400, init: this.p.x}));
            }
            else{
                Q.stage(1).insert(new Q.Bala({x: this.p.x, y: this.p.y - (this.p.h - 10), direction: this.p.direction, vy: -400, init: this.p.y}));
            }
        },

        die: function (damage){
            console.log("Auch");
            /*
            Q.state.dec("energy", damage);
            if(Q.state.get("energy") < 0){
              this.destroy();
            }
            */
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
                max: 120
            });

            this.on("hit" , this, "collision");

        },

        collision: function(col){
            if(col){
                col.obj.damage(this.p.damage);
            }
           
		   this.destroy();
        },

        step: function(dt){
            if(this.p.direction == "up"){
                this.p.y += this.p.vy*dt;
                if(this.p.y < this.p.init - this.p.max || this.p.y > this.p.init + this.p.max)
                    this.destroy();
            }
            else{
                this.p.x += this.p.vx * dt;
			    if(this.p.x < this.p.init - this.p.max || this.p.x > this.p.init + this.p.max)
				    this.destroy();
            }
            
        }
    });

    //Taladrillo
    Q.Sprite.extend("Taladrillo",{

    });

    //Pinchitos:
    Q.Sprite.extend("Pinchitos", {
        init: function(p) {
            this._super(p,{
            sheet: "pinchitos",
            sprite: "pinchitos_anim",
            x: 590,
            y: 1465,
            frame: 0,
            gravityY: 540,
            lives:3,
            damage:5,
            vx: 25
            });
            this.add("2d, aiBounce, animation");
            this.play("pinchitos_normal");
            this.on("bump.bottom, bump.top, bump.left, bump.right", this, "kill");
            //this.on("bump.bottom, bump.left, bump.right", this, "kill");
        }, 

        onTop: function(collision){
            this.destroy();
        },
        kill: function(collision){
            if(!collision.obj.isA("Samus")) return;
            console.log("te di HEHE");
            collision.obj.p.vy = -200;
            collision.obj.p.vx = collision.normalX*-500;
            collision.obj.p.x += collision.normalX*-5;
            collision.obj.die(this.p.damage);
        },
        damage: function(dmg){
            this.p.lives = this.p.lives - dmg;
            if(this.p.lives == 0){
                this.destroy();
            }
            
        }
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
        
        open: function (collision) {
            if (collision.obj.isA("Samus") && this.p.is_open){
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

        damage: function(dmg){
            this.p.lives = this.p.lives - dmg;
            if(this.p.lives == 1){
                this.play("puerta_iz_rompiendo");
            }
            else if(this.p.lives == 0){
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
    Q.Sprite.extend("PuertaDerecha",{
        init: function(p) {
            this._super(p,{
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
        damage: function(dmg){
            this.p.lives = this.p.lives - dmg;
            if(this.p.lives == 1){
                this.play("puerta_der_rompiendo");
            }
            else if(this.p.lives == 0){
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

    Q.Sprite.extend("Orbe",{
        init: function(p) {
            this._super(p,{
                sheet: "orbes",
                sprite: "orbe_anim",
                //frame: 0,
                scale: 1,
                gravity: 0,
                sensor: true,
                taken: false
            });
            this.add("2d, tween");

            this.on("sensor", this, "hit");
        },
        hit: function(collision){
            if(this.taken) return;
            if(!collision.isA("Samus")) return;
            console.log(this);
            this.taken = true;
            if(this.p.type == "ball") collision.p.canBecomeBall = true;
            else if(this.p.type == "breakWall") collision.p.canBreakWall = true;
            console.log("He cogido el orbe ", collision.p.canBecomeBall);
            //collision.p.vy = -400;
            //Q.audio.play("1up.mp3");
            this.destroy();
        }
    });


    Q.load(["bg.png", "tiles_metroid_!6x16.png","title-screen.gif", "./Enemys/taladrillo.png", "taladrillo.json","samus.png", "samus.json", "map1.tmx", "../sounds/elevatormusic.mp3", 
    "../sounds/titlescreen.mp3", "../sounds/elevatormusic.mp3", "../sounds/ending_alternative.mp3", "../sounds/start.mp3", "title-screen.json", "./titleScreens/pantallainicio/pantallainiciotitulo.png",
    "metroid_door.png", "puertas.json","energia.png", "./titleScreens/pantallainicio/pantallainiciostart.png", "titleScreen.tsx", "letras.png", "Startscreen.tsx", "title-start.json", "../sounds/jump.mp3",
    "../sounds/shot.mp3", "../sounds/go_through_door.mp3", "shot.png", "orbes.tsx", "orbe.json", "orbes.png", "./Enemys/pinchitos.png", "pinchitos.json"],
        
        function () {
            
            Q.compileSheets("samus.png", "samus.json");
            Q.compileSheets("./Enemys/taladrillo.png", "taladrillo.json");
            Q.compileSheets("./Enemys/pinchitos.png", "pinchitos.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciotitulo.png","title-screen.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainiciostart.png", "title-start.json");
            Q.compileSheets("metroid_door.png", "puertas.json");
            Q.compileSheets("orbes.png", "orbe.json");

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
                shoot_r : {frames: [1]},
                shoot_l : {frames: [28]},
                morir:{frames: [49,48],rate:1/50},
                samusball:{frames: [11,12,13,14], rate:1/6}
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
                puerta_iz_rompiendo: {frames: [4]},
                puerta_der_rompiendo: {frames: [1]},
                puerta_der_arreglada: {frames: [0]},
                puerta_iz_arreglando: {frames: [5,4,3], rate: 1/6, next: "puerta_iz_arreglada"},
                puerta_der_arreglando: {frames: [0,1,2], rate: 1/6, next: "puerta_der_arreglada"}
            });

            Q.animations('pinchitos_anim', {
                pinchitos_normal: { frames: [0,1], rate: 1/3},
                pinchitos_derecha: { frames: [6,7], rate: 1/3},
                pinchitos_izquierda: { frames: [2,3], rate: 1/3},
                pinchitos_arriba: { frames: [4,5], rate: 1/3},
            });

            Q.scene("map1", function (stage) {
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Samus();
                stage.insert(samus);
                //stage.on('postrender',drawLines);
                var pin = new Q.Pinchitos();
                stage.insert(pin);

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

                 Q.state.reset({energy: 30});

                 //Q.debug = true;
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