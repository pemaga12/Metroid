var game = function () {

    var Q = window.Q = Quintus()
        .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
        .setup("myGame", {
            width: 800,
            height: 600,
            scaleToFit: true
        })
        .controls().controls().enableSound().touch();


    //title-screen
    Q.Sprite.extend("Titlescreen", {
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
            this.add("2d , platformerControls, animation, tween");
            this.play("animation");
        }
    });

    //Samus
    Q.Sprite.extend("Samus",{
        init: function(p) {
            this._super(p,{
                sheet: "samus",
                sprite: "samus_anim",
                x:570,
                y:1470,
                frame: 0,
                scale: 1,
                gravityY: 550
            });
            this.add("2d , platformerControls, animation, tween, dancer");
            Q.input.on("up", this, function(){
        
            if (this.p.vy == 0){
                Q.audio.play("/sounds/elevatormusic.mp3");
            }
        });
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
        }
    });

    //Taladrillo
    Q.Sprite.extend("Taladrillo",{

    });


    Q.load(["bg.png", "tiles_metroid_!6x16.png","title-screen.gif", "./Enemys/taladrillo.png", "taladrillo.json","samus.png", "samus.json", "map1.tmx", "../sounds/elevatormusic.mp3", 
    "../sounds/titlescreen.mp3", "../sounds/elevatormusic.mp3", "../sounds/ending_alternative.mp3", "../sounds/start.mp3", "title-screen.json", "./titleScreens/pantallainicio/pantallainicio.png"],
        function () {
            
            Q.compileSheets("samus.png", "samus.json");
            Q.compileSheets("./Enemys/taladrillo.png", "taladrillo.json");
            Q.compileSheets("./Enemys/pinchitos.png", "pinchito.json");
            Q.compileSheets("./titleScreens/pantallainicio/pantallainicio.png","title-screen.json");

            Q.state.set({ lives: 4,
                pause:false,enJuego:false, //States
            });


            Q.animations("samus_anim",{
                walk_right: {frames: [11,12,13,14,15,16,17,18,19],rate: 1/6, next: "parado_r" },
                walk_left: {frames: [27,26,25,24],rate: 1/6, next: "parado_l" },
                jump_right: {frames: [7,8,9,10],rate: 1/6, next: "parado_r" },
                jump_left: {frames: [7,8,9,10],rate: 1/6, next: "parado_l" },
                parado_r: {frames: [53] },
                parado_l: {frames: [52] },
                morir:{frames: [49,48],rate:1/50},
                ball:{frames: [11,12,13,14], rate:1/6, next: "parado_r"}
            });

            Q.animations("title-screen",{
                animation: {frames: [0,1,2,3,4,5,6,7], rate: 1/6}
            });
            

            Q.scene("map1", function (stage) {
                Q.stageTMX("map1.tmx", stage);

                var samus = new Q.Samus();
                stage.insert(samus);
                Q.audio.stop();
                Q.audio.play("../sounds/start.mp3");
                setTimeout(function(){
                    Q.audio.play("../sounds/elevatormusic.mp3");
                }, 5000);
                

                stage.add("viewport").follow(samus, { x: true, y: true });
                stage.viewport.scale = 1.7;
                stage.viewport.offsetX = 0;
                stage.viewport.offsetY = 70;

                stage.on("destroy", function () {
                    samus.destroy();
                });

                Q.state.reset({lives: 4, coins: 0, score: 0});


            });


            Q.scene("mainTitle", function (stage) {
                console.log("main");
                Q.audio.play("../sounds/titlescreen.mp3");
                
                var button = new Q.UI.Button({
                    x: Q.width / 2,
                    y: Q.height / 2,
                    asset: "title-screen.gif"
                });
                
                // var titlescreen = new Q.Titlescreen();
                //stage.insert(titlescreen);      \(>.<)/  
                button.on("click", function () {
                    Q.clearStages();
                    Q.stageScene("map1", 1);
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

            Q.stageScene("mainTitle");

        });
} 