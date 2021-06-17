var objects = function () {

////////////////////////////////////////////////////////////////////////
////Componentes
////////////////////////////////////////////////////////////////////////

    Q.component("canions_default", {
        extend:{
            step: function (dt) {
            this.p.reload -= dt;
            this.shot_ball();
            },
            damage: function (dmg) {
            }
        }
    });

////////////////////////////////////////////////////////////////////////
////Funciones
////////////////////////////////////////////////////////////////////////

	function setViewport(door) {
        var samus = Q("Samus").first();
        if (door.p.nextRoom == "horizontal" && door.p.viewport == 2258) {
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

////////////////////////////////////////////////////////////////////////
////Clases
////////////////////////////////////////////////////////////////////////

//Ascensor
    Q.Sprite.extend("Ascensor", {
         init: function (p) {
             this._super(p, {
                 asset: "ascensor.png",
                 frame: 0,
                 vx : 0,
                 gravityY : 0
             });
             this.add("2d, animation");
             this.on("bump.bottom, bump.top, bump.left, bump.right", this, "move");
         },
         move: function (collision) {
            if (!collision.obj.isA("Samus")) return;
            
            this.p.vy = 50;
            var that = this;
            setTimeout(function () {
                that.p.vy = 0;
            }, 5000);
         },
         damage: function (dmg) {
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
            if(samus.p.canRedDoors == false){return;}
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
            if(samus.p.canRedDoors == false){return;}
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

    //MotherBrainDoor

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
            this.taken = true;
            if (this.p.type == "ball") collision.p.canBecomeBall = true;
            else if (this.p.type == "breakWall") collision.p.canBreakWall = true;
            else if (this.p.type == "redDoors") collision.p.canRedDoors = true;
            Q.audio.stop();
            Q.audio.play("../sounds/item.mp3");

            Q.audio.stop("../sounds/generalmusic.mp3");
            setTimeout(function () {
                Q.audio.play("../sounds/generalmusic.mp3");
            }, 5000)
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

            if (this.taken) return;
            if (!collision.obj.isA("Samus")) return;
            
            if (!collision.obj.p.canBreakWall) return;
            if (!collision.obj.p.ballmode) return;
            Q.audio.play("../sounds/breakwall.mp3");
            this.taken = true;
            this.destroy();
        },
        damage: function (dmg) {
        }
    });

     //Cañones: Cañón para abajo y cañones diagonales
    Q.Sprite.extend("Canion", {
        init: function (p) {
            this._super(p, {
                asset: "canion1.png",
                collision: true,
                frequency: 4,
                reload:2,
                gravity:0
            });
            this.add("2d, canions_default");
        },
        shot_ball: function (dmg) {
            if (this.p.reload < 0) {
                this.p.reload = this.p.frequency;
                var samus = Q("Samus").first();
                if (samus === undefined) return;
                if (samus.p.x > (this.p.x - 75) && samus.p.x < (this.p.x + 75)) {
                    Q.audio.play("../sounds/cañon.mp3");
                }
                Q.stage().insert(new Q.CanionBall({ x: this.p.x, y: this.p.y + this.p.h,init: this.p.x }));
            } 
        }
    });

    Q.Sprite.extend("Canion2", {
        init: function (p) {
            this._super(p, {
                asset: "canion2.png",
                collision: true,
                frequency: 5,
                reload:5,
                gravity:0
            });
            this.add("2d, canions_default");
        },
        shot_ball: function (dmg) {
            if (this.p.reload < 0) {
                this.p.reload = this.p.frequency;
                var samus = Q("Samus").first();
                if (samus === undefined) return;
                if (samus.p.x > (this.p.x - 75) && samus.p.x < (this.p.x + 75)) {
                    Q.audio.play("../sounds/cañon.mp3");
                }
                Q.stage().insert(new Q.CanionBall({ x: this.p.x+ this.p.w, y: this.p.y + this.p.h, vx:50,init: this.p.x }));
            } 
        }
    });

    Q.Sprite.extend("Canion3", {
        init: function (p) {
            this._super(p, {
                asset: "canion3.png",
                collision: true,
                frequency: 6,
                reload:3,
                gravity:0
            });
            this.add("2d, canions_default");
        },
        shot_ball: function (dmg) {
            if (this.p.reload < 0) {
                this.p.reload = this.p.frequency;
                var samus = Q("Samus").first();
                if (samus === undefined) return;
                if (samus.p.x > (this.p.x - 75) && samus.p.x < (this.p.x + 75)) {
                    Q.audio.play("../sounds/cañon.mp3");
                }
                Q.stage().insert(new Q.CanionBall({ x: this.p.x - this.p.w, y: this.p.y + this.p.h, vx:-50,init: this.p.x }));
            } 
        }
    });

    // Bala de cañón

    Q.Sprite.extend("CanionBall", {
        init: function (p) {
            this._super(p, {
                asset: "shot_canion.png",
                damage: 5,
                init: 0,
                vy: 50,
                vx: 0,
                destruction_time: 3,
                reload: 3, 
                max: 120
            });

            this.on("hit", this, "collision");

        },

        collision: function (collision) {
            if (collision) {
                if(collision.obj.isA("Samus")){
                    collision.obj.die(this.p.damage);
                }
            }
            this.destroy();
        },

        step: function (dt) {
            this.p.reload -= dt;
            this.p.y += this.p.vy * dt;
            this.p.x += this.p.vx * dt;
            if (this.p.reload < 0) {
                this.p.reload = this.p.destruction_time;
                this.destroy();
            } 
        },
        damage: function (dmg) {
        }

    });

 	// Zona de, bloque que al toque te lleva a la pantalla de partida ganada

	Q.Sprite.extend("WinZone", {
	    init: function(p) {
	        this._super(p,{
	            asset:"winzone.png"
	        });
	        this.add("2d");
	        //this.add("2d, aiBounce, animation");
	        this.on("bump.top, bump.bottom, bump.left, bump.right", this, "win");
	    },
	    win: function(collision){
	        if(!collision.obj.isA("Samus")) return;
	        Q.stageScene("winGame", 2);
	        Q.audio.stop();
	        collision.obj.destroy();
	        this.destroy();
	    },
       	damage: function (dmg) {
        }

    });

    Q.load([
    		"ascensor.png",
    		"metroidreddoor.png", "metroid_door.png", "puertas.json",
    		"motherbraindoor.png",
            "orbe.json", "orbes.png",
            "break_block.png",
            "canion1.png","canion2.png","canion3.png","shot_canion.png",  
            "winzone.png","../sounds/cañon.mp3","../sounds/breakwall.mp3"
    	],

    function(){

    	Q.compileSheets("metroid_door.png", "puertas.json");
        Q.compileSheets("metroidreddoor.png", "puertas.json");
        Q.compileSheets("orbes.png", "orbe.json");

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


    });
}