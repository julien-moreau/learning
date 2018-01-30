module BABYLON {
    export class OceanMaterial {
        // Public members
        public material: ShaderMaterial;

        public diffuseSampler1: Texture;
        public diffuseSampler2: Texture;
        public time: number = 0;
        
        /**
         * Constructor
         * @param scene the scene where to add the material
         */
        constructor (scene: Scene) {
            this.material = new ShaderMaterial('ocean', scene, {
                vertexElement: './shaders/ocean',
                fragmentElement: './shaders/ocean',
            }, {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'time'],
                samplers: ['diffuseSampler1', 'diffuseSampler2'],
                defines: [],
            });

            // Textures
            this.diffuseSampler1 = new Texture('./assets/diffuse.png', scene);
            this.diffuseSampler2 = this.diffuseSampler1.clone(); // new Texture('./assets/diffuse.png', scene);

            // Bind
            this.material.onBind = (mesh) => {
                this.time += scene.getEngine().getDeltaTime() * 0.003;

                this.material.setFloat('time', this.time);
                this.material.setTexture('diffuseSampler1', this.diffuseSampler1);
                this.material.setTexture('diffuseSampler2', this.diffuseSampler2);
            };
        }
    }
}
