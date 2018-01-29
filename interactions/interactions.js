var BABYLON;
(function (BABYLON) {
    var Interactions = (function () {
        // Constructor
        function Interactions(scene) {
            this.scene = scene;
        }
        // Create collisions on camera
        Interactions.prototype.setupCollisions = function () {
            var camera = this.scene.activeCamera;
            camera.checkCollisions = true;
            camera.applyGravity = true;
            camera.ellipsoid = new BABYLON.Vector3(2, 3, 2);
            camera.position.y = 150;
            this.scene.gravity = new BABYLON.Vector3(0, -0.81, 0);
            var ground = this.scene.getMeshByID("ground");
            ground.checkCollisions = true;
            var cube = this.scene.getMeshByID("cube");
            cube.checkCollisions = true;
        };
        // Create some actions
        Interactions.prototype.createActions = function () {
            var _this = this;
            var ground = this.scene.getMeshByID("ground");
            var cube = this.scene.getMeshByID("cube");
            cube.isPickable = true;
            cube.actionManager = new BABYLON.ActionManager(this.scene);
            cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function (evt) {
                var random = Math.random();
                var mesh = null;
                if (random > 0.5) {
                    mesh = BABYLON.Mesh.CreateSphere("sphere", 32, 5, _this.scene);
                    mesh.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 1 });
                }
                else {
                    mesh = BABYLON.Mesh.CreateBox("cube", 4.0, _this.scene);
                    mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1 });
                }
                cube.applyImpulse(new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, -1, 0));
                mesh.checkCollisions = true;
                mesh.position.y = 20;
                mesh.position.x += Math.random();
                mesh.position.z += Math.random();
            }));
        };
        // Setup physics and create some bodies
        Interactions.prototype.setupPhysics = function () {
            this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            var cube = this.scene.getMeshByID("cube");
            cube.position.y += 0.5;
            cube.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1 });
            var ground = this.scene.getMeshByID("ground");
            ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0 });
        };
        return Interactions;
    }());
    BABYLON.Interactions = Interactions;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=interactions.js.map