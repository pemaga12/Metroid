var game = function () {

    var Q = window.Q = Quintus()
        .include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
        .setup("myGame", {
            width: 800,
            height: 600,
            scaleToFit: true
        })
        .controls().controls().enableSound().touch();





    Q.load(["map2.tmx","tiles_metroid_!6x16.png","tiles.png","title-screen.png"],
        function () {

            // Q.compileSheets("mario_small.png", "mario_small.json");
            // Q.compileSheets("goomba.png", "goomba.json");
            // Q.compileSheets("coin.png", "coin.json");
            // Q.compileSheets("bloopa.png", "bloopa.json");

            Q.scene("level1", function (stage) {

                Q.stageTMX("map2.tmx", stage);

                // mario = new Q.Mario();
                // stage.insert(mario);

                 stage.add("viewport").follow(mario, { x: true, y: false });
                 stage.viewport.scale = 1;
                stage.viewport.offsetX = -200;

                // stage.on("destroy", function () {
                    // mario.destroy();
                // });


         

            });


            Q.scene("mainTitle", function (stage) {
                console.log("main");
                var button = new Q.UI.Button({
                    x: Q.width / 2,
                    y: Q.height / 2,
                    asset: "title-screen.png"
                });
                button.on("click", function () {
                    Q.clearStages();
                    Q.stageScene("level1", 1);
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