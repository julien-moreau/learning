module BABYLON {
    export class OceanMaterial {
        // Public members
        public material: ShaderMaterial;
        
        /**
         * Constructor
         * @param scene the scene where to add the material
         */
        constructor (scene: Scene) {
            this.material = new ShaderMaterial('ocean', scene, {
                vertexElement: './shaders/ocean',
                fragmentElement: './shaders/ocean',
            }, {
                attributes: ['position'],
                uniforms: ['worldViewProjection'],
                samplers: [],
                defines: [],
            });

            // Bind
            this.material.onBind = (mesh) => {
                // TODO
            };
        }
    }
}
