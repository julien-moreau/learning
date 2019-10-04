module BABYLON {
    export interface IInteractions {
        run(): void;
    }

    export class ToBeExtended {
        constructor(param: string) {
            console.log('wahou de lheritage');
        }
    }

    export class Interactions extends ToBeExtended implements IInteractions {
        public engine: Engine;
        public scene: Scene;
        public camera: FreeCamera;
        public cube: Mesh;
        public ground: Mesh;

        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        public constructor(private _canvas: HTMLCanvasElement) {
            super('yo');
            this._init();
            this._initLights();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();

            this.assign(this.cube, {
                maki: 1
            });
        }

        public assign<T extends any, U extends any>(target: T, source: U): T & U {
            for (const key in source) {
                target[key] = source[key];
            }

            return target as T & U;
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

            this.camera = new FreeCamera('freeCamera', new Vector3(15, 15, 15), this.scene);
            this.camera.attachControl(this._canvas);
        }

        private _initLights(): void {
            const light = new PointLight('pointLight', new Vector3(15, 15, 15), this.scene);
        }

        private _initGeometries(): void {
            this.ground = Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;

            this.cube = Mesh.CreateBox('box', 5, this.scene);
            this.cube.position.y = 5;
            this.cube.isPickable = true;

            const std = new StandardMaterial('std', this.scene);
            std.diffuseTexture = new Texture('../assets/maki.jpg', this.scene);
            this.cube.material = std;

            this.camera.setTarget(this.cube.position);

            const skybox = Mesh.CreateBox('skybox', 500, this.scene);
            const skyboxMaterial = new StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;

            std.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
            std.reflectionTexture.coordinatesMode = Texture.INVCUBIC_MODE;
        }

        private _initPhysics(): void {
            this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            this.cube.physicsImpostor = new PhysicsImpostor(this.cube, PhysicsImpostor.BoxImpostor, {
                mass: 1
            });
        }

        private _initInteractions(): void {
            this.scene.onPointerObservable.add((data) => {
                if (data.type !== PointerEventTypes.POINTERUP)
                    return;
                
                if (data.pickInfo.pickedMesh === this.cube) {
                    this.cube.applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                }
            });
        }
    }
}
