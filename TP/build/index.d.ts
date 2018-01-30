/// <reference types="babylonjs" />
declare module BABYLON {
    class Main {
        engine: Engine;
        scene: Scene;
        camera: FreeCamera;
        light: PointLight;
        ground: GroundMesh;
        /**
         * Constructor
         */
        constructor();
        /**
         * Setup action for the given cube
         */
        setupActions(cube: Mesh): void;
        /**
         * Setup physics for the given cube
         */
        setupPhysics(cube: Mesh): void;
        /**
         * Runs the engine to render the scene into the canvas
         */
        run(): void;
    }
}
