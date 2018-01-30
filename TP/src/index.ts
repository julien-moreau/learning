module BABYLON {
    export class Main {
        // Public members
        public engine: Engine;
        public scene: Scene;

        public camera: FreeCamera;
        public light: PointLight;

        public ground: GroundMesh;

        /**
         * Constructor
         */
        constructor () {
            this.engine = new Engine(<HTMLCanvasElement> document.getElementById('renderCanvas'));

            this.scene = new Scene(this.engine);
            this.scene.enablePhysics(new Vector3(0, -50.81, 0), new CannonJSPlugin());

            this.camera = new FreeCamera('camera', new Vector3(35, 35, 35), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.setTarget(new Vector3(0, 15, 0));

            this.light = new PointLight('light', new Vector3(15, 15, 15), this.scene);

            this.ground = <GroundMesh> Mesh.CreateGround('ground', 512, 512, 32, this.scene);
            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            // Create cubes
            const height = 15;
            const width = 10;
            const size = 5;

            const diffuse = new Texture('./assets/diffuse.png', this.scene);
            const normal = new Texture('./assets/normal.png', this.scene);

            for (let i = 0; i < height; i++) {
                let offsetX = -(width / 2) * 5;

                for (let j = 0; j < width; j++) {
                    const cube = Mesh.CreateBox('cube', size, this.scene);
                    cube.position.x = offsetX;
                    cube.position.y = (5 * i) + size / 2;

                    const material = new StandardMaterial('cubemat', this.scene);
                    material.diffuseTexture = diffuse;
                    material.bumpTexture = normal;
                    cube.material = material;

                    offsetX += size;

                    this.setupActions(cube);
                    this.setupPhysics(cube);
                }
            }
        }

        /**
         * Setup action for the given cube
         */
        public setupActions (cube: Mesh): void {
            cube.actionManager = new ActionManager(this.scene);
            cube.actionManager.registerAction(new ExecuteCodeAction(
                ActionManager.OnLeftPickTrigger,
                (evt) => {
                    const direction = cube.position.subtract(this.scene.activeCamera.position);
                    cube.applyImpulse(direction, new Vector3(0, -1, 0));
                }
            ));
        }

        /**
         * Setup physics for the given cube
         */
        public setupPhysics (cube: Mesh): void {
            cube.physicsImpostor = new PhysicsImpostor(cube, PhysicsImpostor.BoxImpostor, {
                mass: 1
            });
        }

        /**
         * Runs the engine to render the scene into the canvas
         */
        public run () {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }
    }
}
