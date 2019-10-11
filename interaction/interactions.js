var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var ToBeExtended = /** @class */ (function () {
        function ToBeExtended(param) {
            console.log('wahou de lheritage');
        }
        return ToBeExtended;
    }());
    BABYLON.ToBeExtended = ToBeExtended;
    var Interactions = /** @class */ (function (_super) {
        __extends(Interactions, _super);
        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        function Interactions(_canvas) {
            var _this = _super.call(this, 'yo') || this;
            _this._canvas = _canvas;
            _this._init();
            _this._initLights();
            _this._initGeometries();
            _this._initPhysics();
            _this._initInteractions();
            return _this;
        }
        /**
         * Runs the interactions game.
         */
        Interactions.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        /**
         * Inits the interactions.
         */
        Interactions.prototype._init = function () {
            this.engine = new BABYLON.Engine(this._canvas);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('freeCamera', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.camera.attachControl(this._canvas);
        };
        Interactions.prototype._initLights = function () {
            var light = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(15, 15, 15), this.scene);
        };
        Interactions.prototype._initGeometries = function () {
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.cube = BABYLON.Mesh.CreateBox('box', 5, this.scene);
            this.cube.position.y = 5;
            this.cube.isPickable = true;
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/maki.jpg', this.scene);
            this.cube.material = std;
            this.camera.setTarget(this.cube.position);
            var skybox = BABYLON.Mesh.CreateBox('skybox', 500, this.scene);
            var skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
            std.reflectionTexture = new BABYLON.CubeTexture('../assets/TropicalSunnyDay', this.scene);
            std.reflectionTexture.coordinatesMode = BABYLON.Texture.INVCUBIC_MODE;
        };
        Interactions.prototype._initPhysics = function () {
            this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.cube.physicsImpostor = new BABYLON.PhysicsImpostor(this.cube, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 6
            });
        };
        Interactions.prototype._initInteractions = function () {
            var _this = this;
            this.scene.onPointerObservable.add(function (data) {
                if (data.type !== BABYLON.PointerEventTypes.POINTERUP)
                    return;
                if (data.pickInfo.pickedMesh === _this.cube) {
                    _this.cube.applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                }
            });
        };
        return Interactions;
    }(ToBeExtended));
    BABYLON.Interactions = Interactions;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=interactions.js.map