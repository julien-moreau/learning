var BABYLON;
(function (BABYLON) {
    var Main = /** @class */ (function () {
        /**
         * Constructor
         */
        function Main() {
            this.engine = new BABYLON.Engine(document.getElementById('renderCanvas'));
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(15, 15, 15), this.scene);
            // Ground and amterial
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 32, this.scene);
            this.ground.position.y = -15;
            this.ground.material = new BABYLON.OceanMaterial(this.scene).material;
        }
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
var BABYLON;
(function (BABYLON) {
    var OceanMaterial = /** @class */ (function () {
        /**
         * Constructor
         * @param scene the scene where to add the material
         */
        function OceanMaterial(scene) {
            this.material = new BABYLON.ShaderMaterial('ocean', scene, {
                vertexElement: './shaders/ocean',
                fragmentElement: './shaders/ocean',
            }, {
                attributes: ['position'],
                uniforms: ['worldViewProjection'],
                samplers: [],
                defines: [],
            });
            // Bind
            this.material.onBind = function (mesh) {
                // TODO
            };
        }
        return OceanMaterial;
    }());
    BABYLON.OceanMaterial = OceanMaterial;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=index.js.map