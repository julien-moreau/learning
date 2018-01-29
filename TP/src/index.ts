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

            this.camera = new FreeCamera('camera', new Vector3(15, 15, 15), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());

            this.light = new PointLight('light', new Vector3(15, 15, 15), this.scene);

            // Ground and amterial
            this.ground = <GroundMesh> Mesh.CreateGround('ground', 512, 512, 32, this.scene);
            this.ground.position.y = -15;

            this.ground.material = new OceanMaterial(this.scene).material;
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
