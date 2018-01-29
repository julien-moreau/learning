module BABYLON {
    export class Interactions {
        // Public members
        public scene: Scene;

        // Constructor
        constructor (scene: Scene) {
            this.scene = scene;
        }

        // Create collisions on camera
        public setupCollisions () {
            var camera = <FreeCamera> this.scene.activeCamera;
            camera.checkCollisions = true;
            camera.applyGravity = true;
            camera.ellipsoid = new Vector3(2, 3, 2);
            camera.position.y = 150;

            this.scene.gravity = new Vector3(0, -0.81, 0);

            var ground = this.scene.getMeshByID("ground");
            ground.checkCollisions = true;

            var cube = this.scene.getMeshByID("cube");
            cube.checkCollisions = true;
        }

        // Create some actions
        public createActions () {
            var ground = this.scene.getMeshByID("ground");

            var cube = this.scene.getMeshByID("cube");
            cube.isPickable = true;
            cube.actionManager = new ActionManager(this.scene);

            cube.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, (evt) => {
                var random = Math.random();
                var mesh: Mesh = null;

                if (random > 0.5) {
                    mesh = Mesh.CreateSphere("sphere", 32, 5, this.scene);
                    mesh.setPhysicsState(PhysicsEngine.SphereImpostor, { mass: 1 });
                }
                else {
                    mesh = Mesh.CreateBox("cube", 4.0, this.scene);
                    mesh.setPhysicsState(PhysicsEngine.BoxImpostor, { mass: 1 });
                }

                cube.applyImpulse(new Vector3(0, 10, 0), new Vector3(0, -1, 0));

                mesh.checkCollisions = true;
                mesh.position.y = 20;
                mesh.position.x += Math.random();
                mesh.position.z += Math.random();
            }));
        }

        // Setup physics and create some bodies
        public setupPhysics () {
            this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

            var cube = this.scene.getMeshByID("cube");
            cube.position.y += 0.5;
            cube.setPhysicsState(PhysicsEngine.BoxImpostor, { mass: 1 });

            var ground = this.scene.getMeshByID("ground");
            ground.setPhysicsState(PhysicsEngine.BoxImpostor, { mass: 0 });
        }
    }
}
