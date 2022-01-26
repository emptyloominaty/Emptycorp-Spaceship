
class CanvasMain {
    constructor() {
        //TEST
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(100, 1900 / 550, 1, 2000);
        this.renderer = new THREE.WebGLRenderer( { canvas: spaceShipWindow } )

        this.geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        this.material1 = new THREE.MeshBasicMaterial();
        this.material2 = new THREE.MeshBasicMaterial();
        this.sphere = [new THREE.Mesh(this.geometry, this.material1), new THREE.Mesh(this.geometry, this.material1), new THREE.Mesh(this.geometry, this.material2)];

        this.sphere[0].position.set(1, 1, 1);
        this.sphere[1].position.set(-1, -1, -1);

        this.scene.add(this.sphere[0]);
        this.scene.add(this.sphere[1]);
        this.scene.add(this.sphere[2]);

        this.camera.position.z = 150;


        this.hex = "0x" + "000000".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
        });
        this.sphere[0].material.color.setHex(this.hex);

        this.hex = "0x" + "000000".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
        });
        this.sphere[2].material.color.setHex(this.hex);


        this.render = ()=> {
            requestAnimationFrame(this.render);
            this.renderer.render(this.scene, this.camera);
        };

        this.render();

    }
    run() {
        //this.camera.position.z = 50+playerShip.position.x
        this.camera.rotation.y = (playerShip.position.direction/58.909090909090) //?????????????????? xDDDDddD fix?
    }

}

let shipWindow3D = new CanvasMain