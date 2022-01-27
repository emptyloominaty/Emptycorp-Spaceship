class CanvasMain {
    constructor() {

        //TEST
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(60, 1900 / 550, 0.1, 200000)
        this.renderer = new THREE.WebGLRenderer( { canvas: spaceShipWindow } )
        this.camera.rotation.order = 'YXZ' // fixed rotation shitshow

        this.geometry = new THREE.SphereGeometry(30, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2)
        this.material1 = new THREE.MeshBasicMaterial()
        this.material2 = new THREE.MeshBasicMaterial()
        this.sphere = [new THREE.Mesh(this.geometry, this.material1), new THREE.Mesh(this.geometry, this.material2), new THREE.Mesh(this.geometry, this.material2), new THREE.Mesh(this.geometry, this.material2)]


       /* //grid
        let size = 10000
        let step = 100
        let gridHelper = new THREE.GridHelper(size, step)
        gridHelper.setColors(new THREE.Color(0xFFFFFF), new THREE.Color(0xFFFF00))
        this.scene.add(gridHelper)*/


        this.sphere[0].position.set(0, 0, 0) //x z y
        this.sphere[1].position.set(6500, 500, 2300)
        this.sphere[2].position.set(-2000, 1000, -1000)
        this.sphere[3].position.set(4000, 500, 4000)

        this.scene.add(this.sphere[0])
        this.scene.add(this.sphere[1])
        this.scene.add(this.sphere[2])
        this.scene.add(this.sphere[3])

        this.camera.position.z = 1000
        this.camera.position.x = 1000
        this.camera.position.y = 0

        this.sphere[0].material.color.setHex("0xf1ffa5")
        this.sphere[1].material.color.setHex("0xffd69c")

        this.render = ()=> {
            requestAnimationFrame(this.render)
            this.renderer.render(this.scene, this.camera)
        }

        this.render()

    }
    run() {
        this.camera.position.x = playerShip.position.x*1000
        this.camera.position.z = playerShip.position.y*1000
        this.camera.position.y = playerShip.position.z*1000

        this.camera.rotation.x = ((playerShip.position.pitch.direction-180)/57.295779487363233601652280409982) //degrees -> radians
        this.camera.rotation.y = ((playerShip.position.yaw.direction-180)/57.295779487363233601652280409982) //degrees -> radians

    }



}

let shipWindow3D = new CanvasMain