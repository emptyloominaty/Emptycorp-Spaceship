class CanvasMain {
    fxaa = false
    motionBlur = false
    smaa = false
    materials = {}

    stars = []
    planets = []
    moons = []

    ships = []
    projectiles = []

    test = []

    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(50, 1900 / 550,0.0000000000000001,100000) //0.00000000000000001  //0.00000000000000001, 100000
        this.renderer = new THREE.WebGLRenderer( { canvas: spaceShipWindow, antialias:false} ) //,antialias: false
        //this.renderer.setPixelRatio(2)

        this.camera.rotation.order = 'YXZ' // fixed rotation shitshow

        this.materials["Class G"] = new THREE.MeshBasicMaterial()
        this.materials["Class K"] = new THREE.MeshBasicMaterial()

        this.materials["Class G"].color.setHex("0xf1ffa5")
        this.materials["Class K"].color.setHex("0xffd69c")

        //stars
        for (let i = 0; i<starSystems.length; i++) {
            let starColor = starSystems[i].stars[0].starType
            let starSize = starSystems[i].stars[0].radius/80000000 // /50000000 //TODO:FIX
            let geometry = new THREE.SphereGeometry(starSize, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2)
            this.stars[i] = new THREE.Mesh(geometry, this.materials[starColor])
            this.stars[i].position.set(starSystems[i].position.x,starSystems[i].position.z,starSystems[i].position.y)

            this.scene.add(this.stars[i])

            if (this.planets[i]===undefined) {this.planets[i]=[]}
            for (let j = 0; j<starSystems[i].planets.length; j++) {
                let planetColor = 0x666666
                let planetSize = starSystems[i].planets[j].radius/60528409678 //TODO:FIX
                let planetGeometry = new THREE.SphereGeometry(planetSize, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2)
                this.planets[i][j] = new THREE.Mesh(planetGeometry, new THREE.MeshBasicMaterial({color:planetColor}))

                this.scene.add(this.planets[i][j])
            }

            //TODO MOONS
        }

      /*  let test = this.test
        if (0===0) {
            let geometry = new THREE.CylinderGeometry( 0.0000000000000001, 0.0000000000000001, 0.0000000000000001, 12, 1 )  //0.01, 0.01, 0.1  //0.1, 0.1, 100
            let material = new THREE.MeshBasicMaterial( {color: 0x222222} )
            test.push( new THREE.Mesh( geometry, material ))
            test[0].position.x = 0
            test[0].position.z = 0.000000000000001 //9.x mm
            test[0].position.y = 0
            this.scene.add(test[0])
        }*/

        //------------------------------------------------------------------------------------------FXAA
        this.renderPassFXAA = new RenderPass( this.scene, this.camera )
        this.fxaaPass = new ShaderPass( FXAAShader )
        this.copyPassFXAA = new ShaderPass( CopyShader )

        this.composer = new EffectComposer( this.renderer )
        this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( 1900 )
        this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( 550 )

        this.composerFX = new EffectComposer( this.renderer )
        //------------------------------------------------------------------------------------------SMAA
        this.composerSMAA = new EffectComposer( this.renderer )
        this.composerSMAA.addPass( new RenderPass( this.scene, this.camera ) )

        const pass = new SMAAPass( 1900, 550 )
        this.composerSMAA.addPass( pass )

        //------------------------------------------------------------------------------------------Motion Blur
        this.composerMotionBlur = new EffectComposer( this.renderer )
        // render pass
        this.renderPassMotionBlur = new THREE.RenderPass( this.scene, this.camera )

        // save pass
        let renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            stencilBuffer: false
        }

        this.savePassMotionBlur = new THREE.SavePass( new THREE.WebGLRenderTarget( 1900, 550, renderTargetParameters ) )

        // blend pass
        this.blendPassMotionBlur = new THREE.ShaderPass( THREE.BlendShader, 'tDiffuse1' )
        this.blendPassMotionBlur.uniforms[ 'tDiffuse2' ].value = this.savePassMotionBlur.renderTarget.texture
        this.blendPassMotionBlur.uniforms[ 'mixRatio' ].value = 0.4 //0.4

        // output pass
        this.outputPassMotionBlur = new THREE.ShaderPass( THREE.CopyShader )
        this.outputPassMotionBlur.renderToScreen = true

        //-----------------------------------------------------------------------------------------

        this.camera.position.x = 0   //x
        this.camera.position.y = 0   //z
        this.camera.position.z = 0   //y


        this.render = () => {
            requestAnimationFrame(this.render)
            this.renderer.render(this.scene, this.camera)
            //FXAA
            if(this.fxaa) {
                this.composer.render()
                this.composerFX.render()
            }
            if (this.motionBlur) {
                this.composerMotionBlur.render()
            }
            if (this.smaa) {
                this.composerSMAA.render()
            }


        }

        this.render()

    }
    resetRenderer(msaa) {
        //does not work????????
        this.renderer = new THREE.WebGLRenderer( { canvas: spaceShipWindow, antialias: msaa} )
    }

    createNewProjectile(id) {
        let color = projectiles[id].color
        let type = projectiles[id].type
        let geometry
        if (type==="laser") {
            geometry = new THREE.CylinderGeometry( 0.0000000000000002, 0.0000000000000002, 0.000000000000058, 12, 2 ) // 0.0000000000000002, 0.0000000000000002, 0.000000000000058
        } else if (type==="plasma") {
            geometry = new THREE.SphereGeometry(0.0000000000000005, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2)
        } else if (type==="missile") {
            geometry = new THREE.CylinderGeometry( 0.0000000000002, 0.0000000000002, 0.000000000058, 12, 2 )
        }
        let material = new THREE.MeshBasicMaterial( {color: color} )
        this.projectiles[id] = new THREE.Mesh( geometry, material )
        this.projectiles[id].position.set(projectiles[id].position.x,projectiles[id].position.z,projectiles[id].position.y)
        this.projectiles[id].rotation.order = 'YXZ'
        this.projectiles[id].rotation.x = ((projectiles[id].pitch-90)/57.295779487363233601652280409982)
        this.projectiles[id].rotation.y = ((projectiles[id].yaw-180)/57.295779487363233601652280409982)

        this.scene.add(this.projectiles[id])
    }

    createNewShip(id) {
        let material = new THREE.MeshBasicMaterial( {color: 0x444444} )
        let geometry = new THREE.BoxGeometry( 0.000000000000255702341, 0.000000000000105702341, 0.000000000000105702341 )
        this.ships[id] = new THREE.Mesh( geometry, material )
        this.scene.add(this.ships[id])

    }

    run() {
        let camHi = {x:playerShip.positionHi.x,y:playerShip.positionHi.z,z:playerShip.positionHi.y}
        let camLo = {x:playerShip.positionLo.x,y:playerShip.positionLo.z,z:playerShip.positionLo.y}
        //test
        /*this.test[0].position.x = 1-camHi.x-camLo.x
        this.test[0].position.z = 1.000000000000001-camHi.z-camLo.z
        this.test[0].position.y = 0-camHi.y-camLo.y*/

        //projectiles
        for (let i = 0; i<projectiles.length; i++) {
            if (projectiles[i]!==undefined) {
                if (this.projectiles[i]===undefined) {
                    this.createNewProjectile(i)
                }
                this.projectiles[i].position.x = (projectiles[i].positionHi.x-camHi.x)+(projectiles[i].positionLo.x-camLo.x) //x
                this.projectiles[i].position.y = (projectiles[i].positionHi.z-camHi.y)+(projectiles[i].positionLo.z-camLo.y) //z
                this.projectiles[i].position.z = (projectiles[i].positionHi.y-camHi.z)+(projectiles[i].positionLo.y-camLo.z) //y
                this.projectiles[i].rotation.x = ((projectiles[i].pitch-90)/57.295779487363233601652280409982)
                this.projectiles[i].rotation.y = ((projectiles[i].yaw-180)/57.295779487363233601652280409982)
            }
        }
        //ships
        //TODO:draw only <0.01ly
        for (let i = 0; i<aiShips.length; i++) {
            if (aiShips[i]!==undefined && aiShipsNear[i]) {
                if (this.ships[i] === undefined) {
                    this.createNewShip(i)
                }
                this.ships[i].position.x = (aiShips[i].positionHi.x - camHi.x) + (aiShips[i].positionLo.x - camLo.x) //x
                this.ships[i].position.y = (aiShips[i].positionHi.z - camHi.y) + (aiShips[i].positionLo.z - camLo.y) //z
                this.ships[i].position.z = (aiShips[i].positionHi.y - camHi.z) + (aiShips[i].positionLo.y - camLo.z) //y
                this.ships[i].rotation.x = ((aiShips[i].pitch - 90) / 57.295779487363233601652280409982)
                this.ships[i].rotation.y = ((aiShips[i].yaw - 180) / 57.295779487363233601652280409982)
            }
        }

        //stars
        for (let i = 0; i<starSystems.length; i++) {
            this.stars[i].position.set(
                (starSystems[i].position.x)-camHi.x-camLo.x,
                (starSystems[i].position.z)-camHi.y-camLo.y,
                (starSystems[i].position.y)-camHi.z-camLo.z,
                )
            //planets
            for (let j = 0; j<starSystems[i].planets.length; j++) {
                let orbitHeight = 0.013914+(starSystems[i].planets[j].orbitHeight/9460528409678.2681473440592957161)  //TODO:FIX
                this.planets[i][j].position.set (
                    (starSystems[i].position.x)-camHi.x-camLo.x,
                    (starSystems[i].position.z)-camHi.y-camLo.y,
                    (starSystems[i].position.y+orbitHeight)-camHi.z-camLo.z,
                )
            }
        }

        this.camera.rotation.x = ((playerShip.position.pitch.direction-180)/57.295779487363233601652280409982) //degrees -> radians
        this.camera.rotation.y = ((playerShip.position.yaw.direction-180)/57.295779487363233601652280409982) //degrees -> radians
    }


    enableMotionBlur() {
        this.composerMotionBlur.addPass( this.renderPassMotionBlur )
        this.composerMotionBlur.addPass( this.blendPassMotionBlur )
        this.composerMotionBlur.addPass( this.savePassMotionBlur  )
        this.composerMotionBlur.addPass( this.outputPassMotionBlur )
    }

    disableMotionBlur() {
        this.composerMotionBlur.removePass( this.renderPassMotionBlur )
        this.composerMotionBlur.removePass( this.blendPassMotionBlur )
        this.composerMotionBlur.removePass( this.savePassMotionBlur  )
        this.composerMotionBlur.removePass( this.outputPassMotionBlur )
    }

    enableFXAA() {
        this.composerFX.addPass( this.renderPassFXAA )
        this.composerFX.addPass( this.copyPassFXAA )

        this.composer.addPass( this.renderPassFXAA )
        this.composer.addPass( this.fxaaPass )
    }

    disableFXAA() {
        this.composerFX.removePass( this.renderPassFXAA )
        this.composerFX.removePass( this.copyPassFXAA )

        this.composer.removePass( this.renderPassFXAA )
        this.composer.removePass( this.fxaaPass )
    }

}

let shipWindow3D = new CanvasMain