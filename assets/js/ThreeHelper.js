class ThreeHelper {
    constructor() {
        this.callback;
        this.mixers = [];
        this.action = [];
        this.objects = [];
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 2));
        this.axesHelper = new THREE.AxesHelper(100);
        //this.scene.add(this.axesHelper);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.position.set(0, 0, 230);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.setAttribute('class', 'mainCanvas');
        document.body.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
        //调取陀螺仪进行原点相机旋转（因为兼容性问题，弃用）
        //window.addEventListener('deviceorientation', (event) => {
        //    //alpha = event.alpha,
        //    // beta = event.beta,
        //    //gamma = event.gamma;

        //    this.camera.rotation.x += event.alpha;

        //}, false);
        this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.control.rotateSpeed = 0.1;
        this.control.update();
        this.render();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        var time = this.clock.getDelta();
        for (const mixer of this.mixers) {
            mixer.update(time);
        }
        window.requestAnimationFrame(() => {
            this.render();
        });
    }
}
//# sourceMappingURL=ThreeHelper.js.map