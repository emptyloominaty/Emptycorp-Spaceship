class CanvasMain {
    spheresIdx = 0
    tubesIdx = 0
    materials = {}

    spheres = []
    beams = []
    projectiles = []

    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(50, 1900 / 550, 0.000001, 200000000)
        this.renderer = new THREE.WebGLRenderer( { canvas: spaceShipWindow } )
        this.camera.rotation.order = 'YXZ' // fixed rotation shitshow

        this.materials["Class G"] = new THREE.MeshBasicMaterial()
        this.materials["Class K"] = new THREE.MeshBasicMaterial()

        this.materials["Class G"].color.setHex("0xf1ffa5")
        this.materials["Class K"].color.setHex("0xffd69c")

        //stars
        for (let i = 0; i<starSystems.length; i++) {
            let starColor = starSystems[i].stars[0].starType
            let starSize = starSystems[i].stars[0].radius/50
            let geometry = new THREE.SphereGeometry(starSize, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2)
            this.spheres[this.spheresIdx] = new THREE.Mesh(geometry, this.materials[starColor])
            this.spheres[this.spheresIdx].position.set(starSystems[i].position.x*1000000,starSystems[i].position.z*1000000,starSystems[i].position.y*1000000)

            this.scene.add(this.spheres[this.spheresIdx])
            this.spheresIdx++
            //TODO:PLANETS
            //TODO MOONS
        }

        /*let test = []
        if (0===0) {
            let geometry = new THREE.CylinderGeometry( 0.000001, 0.000001, 0.000001, 12, 1 )  //0.01, 0.01, 0.1  //0.1, 0.1, 100
            let material = new THREE.MeshBasicMaterial( {color: 0x222222} )
            test.push( new THREE.Mesh( geometry, material ))
            test[0].position.x = 1000000
            test[0].position.z = 1000000.00001
            test[0].position.y = 0
            this.scene.add(test[0])
        }*/


        this.camera.position.x = 1000000   //x
        this.camera.position.y = 0      //z
        this.camera.position.z = 1000000   //y

        this.render = () => {
            requestAnimationFrame(this.render)
            this.renderer.render(this.scene, this.camera)
        }

        this.render()

    }

    createNewProjectile(id) {
        let color = projectiles[id].color
        let type = projectiles[id].type
        let geometry
        if (type==="laser") {
            geometry = new THREE.CylinderGeometry( 0.01, 0.01, 0.5, 12, 1 )
        } else if (type==="plasma") {
            geometry = new THREE.SphereGeometry(0.04, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2)
        } else if (type==="missile") {
            geometry = new THREE.CylinderGeometry( 0.001, 0.01, 0.3, 12, 1 )
        }
        console.log(color)
        let material = new THREE.MeshBasicMaterial( {color: color} )
        this.projectiles[id] = new THREE.Mesh( geometry, material )
        this.projectiles[id].position.set(projectiles[id].position.x*1000000,projectiles[id].position.z*1000000,projectiles[id].position.y*1000000)
        this.projectiles[id].rotation.order = 'YXZ'
        this.projectiles[id].rotation.x = ((projectiles[id].pitch-90)/57.295779487363233601652280409982)
        this.projectiles[id].rotation.y = ((projectiles[id].yaw-180)/57.295779487363233601652280409982)

        this.scene.add(this.projectiles[id])
    }

    run() {
        //projectiles
        for (let i = 0; i<projectiles.length; i++) {
            if (projectiles[i]!==undefined) {
                if (this.projectiles[i]===undefined) {
                    this.createNewProjectile(i)
                }
                //TODO:FIX????
                this.projectiles[i].position.x = projectiles[i].position.x*1000000
                this.projectiles[i].position.z = projectiles[i].position.y*1000000
                this.projectiles[i].position.y = projectiles[i].position.z*1000000
                this.projectiles[i].rotation.x = ((projectiles[i].pitch-90)/57.295779487363233601652280409982)
                this.projectiles[i].rotation.y = ((projectiles[i].yaw-180)/57.295779487363233601652280409982)
                //console.log(this.projectiles[i].position.x," | ",this.projectiles[i].position.z," | ",this.projectiles[i].position.y)
            }
        }
        //ships (no?)
        //playership + shield?

        this.camera.position.x = playerShip.position.x*1000000
        this.camera.position.z = playerShip.position.y*1000000
        this.camera.position.y = playerShip.position.z*1000000

        this.camera.rotation.x = ((playerShip.position.pitch.direction-180)/57.295779487363233601652280409982) //degrees -> radians
        this.camera.rotation.y = ((playerShip.position.yaw.direction-180)/57.295779487363233601652280409982) //degrees -> radians
    }



}

let shipWindow3D = new CanvasMain