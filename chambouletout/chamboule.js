var BABYLON;
(function (BABYLON) {
    var Chamboule = /** @class */ (function () {
        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        function Chamboule(_canvas) {
            this._canvas = _canvas;
            this.cubelist = [];
            this.takeBall = false;
            this.NB_CUBE_GAME = 6;
            this.nbBallUsed = 0;
            this._init();
            this._initLights();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();
        }
        /**
         * Runs the interactions game.
         */
        Chamboule.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        /**
         * Inits the interactions.
         */
        Chamboule.prototype._init = function () {
            this.engine = new BABYLON.Engine(this._canvas);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('freeCamera', new BABYLON.Vector3(6, 30, 100), this.scene);
            this.camera.attachControl(this._canvas);
        };
        Chamboule.prototype._initLights = function () {
            //const light = new PointLight('pointLight', new Vector3(15, 50, 15), this.scene);
            var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        };
        Chamboule.prototype._initGeometries = function () {
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            var stdG = new BABYLON.StandardMaterial('std', this.scene);
            var diffuse = stdG.diffuseTexture = new BABYLON.Texture('../assets/herbe.jpg', this.scene);
            diffuse.uScale = diffuse.vScale = 20;
            this.ground.material = stdG;
            this.ground.isPickable = true;
            this.standCube = BABYLON.Mesh.CreateBox('stand', 20, this.scene);
            this.standCube.scaling.z = 0.5;
            this.standBall = BABYLON.Mesh.CreateBox('stand', 25, this.scene);
            this.standBall.scaling.x = 0.3;
            this.standBall.scaling.z = 0.3;
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/stand.png', this.scene);
            this.standCube.material = std;
            this.standBall.material = std;
            this.infoTable = BABYLON.Mesh.CreatePlane("plane", 200, this.scene);
            this.infoTable.parent = this.standCube;
            this.infoTable.position.y = 50;
            this.infoTable.scaling.x = -1; //Change le sens du texte
            this._textMaker("C'est parti !");
            this.ball = BABYLON.Mesh.CreateSphere('ball', 2, 2, this.scene);
            this.ball.isPickable = true;
            for (var _i = 0; _i < this.NB_CUBE_GAME; _i++) {
                this.cubelist[_i] = BABYLON.Mesh.CreateBox('box' + _i, 5, this.scene);
                /*(_i<=(this.NB_CUBE_GAME)/2) ? (
                    this.cubelist[_i].position.y = 2.5 ,
                    this.cubelist[_i].position.x = 5*_i
                ):
                (_i<(this.NB_CUBE_GAME)/2 / 2) ? (this.cubelist[_i].position.y = 8 ,
                    this.cubelist[_i].position.x = 5*_i - ((this.NB_CUBE_GAME/2) *5)
                ):
                    (this.cubelist[_i].position.y = 13,
                    this.cubelist[_i].position.x = _i);
                */
                //this.cubelist[_i].isPickable = true;
                var std_1 = new BABYLON.StandardMaterial('std', this.scene);
                std_1.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
                //std.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
                //std.reflectionTexture.coordinatesMode = Texture.INVCUBIC_MODE;
                this.cubelist[_i].material = std_1;
            }
            this.standCube.position.x = 6;
            this.standCube.position.y = 10;
            this.standBall.position.z = 50;
            this.standBall.position.x = 6;
            this.standBall.position.y = 10;
            this.cubelist[0].position.x = 0;
            this.cubelist[0].position.y = 20 + 2.5;
            this.cubelist[1].position.x = 6;
            this.cubelist[1].position.y = 20 + 2.5;
            this.cubelist[2].position.x = 12;
            this.cubelist[2].position.y = 20 + 2.5;
            this.cubelist[3].position.x = 3;
            this.cubelist[3].position.y = 20 + 7.5;
            this.cubelist[4].position.x = 9;
            this.cubelist[4].position.y = 20 + 7.5;
            this.cubelist[5].position.x = 6;
            this.cubelist[5].position.y = 20 + 12.5;
            this.ball.position.x = 6;
            this.ball.position.y = 26;
            this.ball.position.z = 50;
            this.camera.setTarget(this.ball.position);
            var skybox = BABYLON.Mesh.CreateBox('skybox', 5000, this.scene);
            var skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
            this.advTextureShoot = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            this.shootCursor = new BABYLON.GUI.Image("shoot", "../assets/shoot.png");
            this.shootCursor.width = "100px";
            this.shootCursor.height = "100px";
            this.shootCursor.stretch = BABYLON.GUI.Image.STRETCH_EXTEND;
            this.shootCursor.scaleX = 0;
            this.advTextureShoot.addControl(this.shootCursor);
            BABYLON.SceneLoader.Append("../assets/", "boombox.glb", this.scene, function (scene) {
            });
        };
        Chamboule.prototype._initPhysics = function () {
            // this.ground.checkCollisions=true;
            //this.camera.checkCollisions=true;
            this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.standCube.physicsImpostor = new BABYLON.PhysicsImpostor(this.standCube, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.standBall.physicsImpostor = new BABYLON.PhysicsImpostor(this.standBall, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 1
            });
            this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 1,
                restitution: 0
            });
            for (var _a = 0, _b = this.cubelist; _a < _b.length; _a++) {
                var cube = _b[_a];
                cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.BoxImpostor, {
                    mass: 1.5,
                    restitution: 1
                });
            }
        };
        Chamboule.prototype._initInteractions = function () {
            var _this = this;
            this.scene.onPointerObservable.add(function (data) {
                if (data.type !== BABYLON.PointerEventTypes.POINTERUP)
                    return;
                if (data.pickInfo.pickedMesh === _this.ball) {
                    _this.takeBall = true;
                    _this.shootCursor.scaleX = 1;
                    _this.ball.setEnabled(false);
                    _this._canvas.requestPointerLock();
                }
            });
            this.scene.onPointerDown = function (e) {
                if (e.button === 2) {
                    if (_this.takeBall) {
                        _this.ball.setEnabled(false);
                        var shootedball = _this.ball.createInstance("shootedball");
                        shootedball.position.x = _this.camera.position.x;
                        shootedball.position.y = _this.camera.position.y;
                        shootedball.position.z = _this.camera.position.z;
                        shootedball.physicsImpostor = new BABYLON.PhysicsImpostor(shootedball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.25, restitution: 0 }, _this.scene);
                        shootedball.physicsImpostor.setLinearVelocity(shootedball.physicsImpostor.getLinearVelocity().add(_this.camera.getForwardRay().direction.scale(100)));
                        setTimeout(function () {
                            _this.shootCursor.scaleX = 0;
                            _this.takeBall = false;
                            _this.ball.setEnabled(true);
                            (_this._isFinish())
                                ? _this._textMaker("Bravo ! \n En " + (++_this.nbBallUsed) + " coup(s)")
                                : _this._textMaker(++_this.nbBallUsed + " balle(s) \n utilisée(s)");
                        }, 1000);
                    }
                }
            };
        };
        /*
        * For set the infoTable's text
        */
        Chamboule.prototype._textMaker = function (_text) {
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.infoTable);
            var rect = new BABYLON.GUI.Rectangle();
            rect.width = 0.2;
            rect.height = "40px";
            rect.cornerRadius = 5;
            rect.color = "white";
            rect.thickness = 2;
            rect.background = "Red";
            advancedTexture.addControl(rect);
            var labelRect = new BABYLON.GUI.TextBlock();
            labelRect.text = _text;
            rect.addControl(labelRect);
        };
        /*
        *
        */
        Chamboule.prototype._isFinish = function () {
            for (var _a = 0, _b = this.cubelist; _a < _b.length; _a++) {
                var element = _b[_a];
                if (element.position.y > 10)
                    return false;
            }
            return true;
        };
        return Chamboule;
    }());
    BABYLON.Chamboule = Chamboule;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=chamboule.js.map