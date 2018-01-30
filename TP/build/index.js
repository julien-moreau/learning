var BABYLON;
(function (BABYLON) {
    var Main = /** @class */ (function () {
        /**
         * Constructor
         */
        function Main() {
            this.engine = new BABYLON.Engine(document.getElementById('renderCanvas'));
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -50.81, 0), new BABYLON.CannonJSPlugin());
            this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(35, 35, 35), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.setTarget(new BABYLON.Vector3(0, 15, 0));
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 32, this.scene);
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            // Create cubes
            var height = 15;
            var width = 10;
            var size = 5;
            var diffuse = new BABYLON.Texture('./assets/diffuse.png', this.scene);
            var normal = new BABYLON.Texture('./assets/normal.png', this.scene);
            for (var i = 0; i < height; i++) {
                var offsetX = -(width / 2) * 5;
                for (var j = 0; j < width; j++) {
                    var cube = BABYLON.Mesh.CreateBox('cube', size, this.scene);
                    cube.position.x = offsetX;
                    cube.position.y = (5 * i) + size / 2;
                    var material = new BABYLON.StandardMaterial('cubemat', this.scene);
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
        Main.prototype.setupActions = function (cube) {
            var _this = this;
            cube.actionManager = new BABYLON.ActionManager(this.scene);
            cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function (evt) {
                var direction = cube.position.subtract(_this.scene.activeCamera.position);
                cube.applyImpulse(direction, new BABYLON.Vector3(0, -1, 0));
            }));
        };
        /**
         * Setup physics for the given cube
         */
        Main.prototype.setupPhysics = function (cube) {
            cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 1
            });
        };
        /**
         * Runs the engine to render the scene into the canvas
         */
        Main.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        return Main;
    }());
    BABYLON.Main = Main;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=index.js.map