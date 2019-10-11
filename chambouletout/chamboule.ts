module BABYLON {
    export interface IInteractions {
        run(): void;
    }

    export class Chamboule implements IInteractions {
        public engine: Engine;
        public scene: Scene;
        public camera: FreeCamera;
        public ball: Mesh;
        public standCube: Mesh;
        public standBall: Mesh;
        public infoTable: Mesh;
        public cubelist: Mesh[]= [];
        public ground: Mesh;
        public takeBall: boolean=false;

        public shootCursor: GUI.Image;
        public advTextureShoot: GUI.AdvancedDynamicTexture

        readonly NB_CUBE_GAME: number = 6;
        public nbBallUsed: number = 0;

        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        public constructor(private _canvas: HTMLCanvasElement) {
            this._init();
            this._initLights();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();

        }

        /**
         * Runs the interactions game.
         */
        public run(): void {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }

        /**
         * Inits the interactions.
         */
        private _init(): void {
            this.engine = new Engine(this._canvas);
            this.scene = new Scene(this.engine);

            this.camera = new FreeCamera('freeCamera', new Vector3(6, 30, 100), this.scene);
            this.camera.attachControl(this._canvas);
        }

        private _initLights(): void {
            //const light = new PointLight('pointLight', new Vector3(15, 50, 15), this.scene);
            const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        }

        private _initGeometries(): void {
            this.ground = Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            const stdG = new StandardMaterial('std', this.scene);
            let diffuse = stdG.diffuseTexture = new Texture('../assets/herbe.jpg', this.scene);
            diffuse.uScale = diffuse.vScale = 20;
            this.ground.material = stdG;
            this.ground.isPickable = true;

            this.standCube = Mesh.CreateBox('stand', 20, this.scene);
            this.standCube.scaling.z = 0.5;
            this.standBall = Mesh.CreateBox('stand', 25, this.scene);
            this.standBall.scaling.x = 0.3;this.standBall.scaling.z = 0.3;
            const std = new StandardMaterial('std', this.scene);
            std.diffuseTexture = new Texture('../assets/stand.png', this.scene);
            this.standCube.material = std;
            this.standBall.material = std;

            this.infoTable = BABYLON.Mesh.CreatePlane("plane", 200, this.scene);
            this.infoTable.parent = this.standCube;
            this.infoTable.position.y = 50;
            this.infoTable.scaling.x=-1;//Change le sens du texte
            this._textMaker("C'est parti !");

            this.ball = Mesh.CreateSphere('ball',2,2,this.scene);
            this.ball.isPickable = true;

            for(var _i=0; _i < this.NB_CUBE_GAME; _i ++){
                this.cubelist[_i]= Mesh.CreateBox('box'+_i, 5, this.scene);
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
                const std = new StandardMaterial('std', this.scene);
                std.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
                //std.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
                //std.reflectionTexture.coordinatesMode = Texture.INVCUBIC_MODE;
                this.cubelist[_i].material = std;
            }
            this.standCube.position.x = 6;this.standCube.position.y = 10;this.standBall.position.z = 50;
            this.standBall.position.x = 6;this.standBall.position.y = 10;
            this.cubelist[0].position.x = 0;this.cubelist[0].position.y = 20 + 2.5;
            this.cubelist[1].position.x = 6;this.cubelist[1].position.y = 20 + 2.5;
            this.cubelist[2].position.x = 12;this.cubelist[2].position.y = 20 + 2.5;
            this.cubelist[3].position.x = 3;this.cubelist[3].position.y = 20 + 7.5;
            this.cubelist[4].position.x = 9;this.cubelist[4].position.y = 20 + 7.5;
            this.cubelist[5].position.x = 6;this.cubelist[5].position.y = 20 + 12.5;

            this.ball.position.x = 6;this.ball.position.y = 26;this.ball.position.z = 50;


            this.camera.setTarget(this.ball.position);

            const skybox = Mesh.CreateBox('skybox', 5000, this.scene);
            const skyboxMaterial = new StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;

            this.advTextureShoot = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            this.shootCursor = new BABYLON.GUI.Image("shoot", "../assets/shoot.png");
            this.shootCursor.width = "100px";
            this.shootCursor.height = "100px";
            this.shootCursor.stretch = BABYLON.GUI.Image.STRETCH_EXTEND;
            this.shootCursor.scaleX=0;
            this.advTextureShoot.addControl(this.shootCursor);
           
            SceneLoader.Append("../assets/", "boombox.glb", this.scene, function (scene) {
                
            });
        }

        private _initPhysics(): void {
           // this.ground.checkCollisions=true;
            //this.camera.checkCollisions=true;
            
            this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            this.standCube.physicsImpostor = new PhysicsImpostor(this.standCube, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            this.standBall.physicsImpostor = new PhysicsImpostor(this.standBall, PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 1
            });

            this.ball.physicsImpostor = new PhysicsImpostor(this.ball, PhysicsImpostor.SphereImpostor, {
                mass: 1,
                restitution:0
                
            });

            for (let cube of this.cubelist) {
                cube.physicsImpostor = new PhysicsImpostor(cube, PhysicsImpostor.BoxImpostor, {
                    mass: 1.5,
                    restitution:1
                });
            }
        }

        private _initInteractions(): void {
            this.scene.onPointerObservable.add((data) => {
                if (data.type !== PointerEventTypes.POINTERUP)
                    return;
                if (data.pickInfo.pickedMesh === this.ball) {
                    this.takeBall=true;
                    this.shootCursor.scaleX=1;
                    this.ball.setEnabled(false);
                    this._canvas.requestPointerLock();
                    
                }
                
            });
            
            this.scene.onPointerDown = (e) => {
                if (e.button === 2) {
                    if(this.takeBall){ 
                        this.ball.setEnabled(false);
                        var shootedball = this.ball.createInstance("shootedball");
                        shootedball.position.x = this.camera.position.x;
                        shootedball.position.y = this.camera.position.y;
                        shootedball.position.z = this.camera.position.z;
                        shootedball.physicsImpostor = new BABYLON.PhysicsImpostor(shootedball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.25, restitution: 0 }, this.scene);
                        shootedball.physicsImpostor.setLinearVelocity(
                            shootedball.physicsImpostor.getLinearVelocity().add(this.camera.getForwardRay().direction.scale(100)
                            )
                        );
                        
                        setTimeout(() => {
                            this.shootCursor.scaleX=0;
                            this.takeBall=false;
                            this.ball.setEnabled(true);
                            (this._isFinish()) 
                            ? this._textMaker("Bravo ! \n En " + (++this.nbBallUsed) + " coup(s)")
                            : this._textMaker(++this.nbBallUsed + " balle(s) \n utilisée(s)");
                          }, 1000);
                        
                        
                    }
                }
            }
        }
        /*
        * For set the infoTable's text
        */
        private _textMaker (_text: string): void{
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.infoTable);

            var rect = new BABYLON.GUI.Rectangle();
            rect.width = 0.2;
            rect.height = "40px";rect.cornerRadius = 5;rect.color = "white";rect.thickness = 2;rect.background = "Red";
            advancedTexture.addControl(rect);
            var labelRect = new BABYLON.GUI.TextBlock();
            labelRect.text = _text;
            rect.addControl(labelRect);
        }

        /*
        *
        */
       private _isFinish (): boolean{
        for(const element of this.cubelist) {
            if(element.position.y >10 )
                return false;
        }
            return true;
       }
        
    }
}
