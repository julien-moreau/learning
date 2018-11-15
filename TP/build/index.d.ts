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
declare module BABYLON {
    class OceanMaterial {
        material: ShaderMaterial;
        diffuseSampler1: Texture;
        diffuseSampler2: Texture;
        time: number;
        /**
         * Constructor
         * @param scene the scene where to add the material
         */
        constructor(scene: Scene);
    }
}
