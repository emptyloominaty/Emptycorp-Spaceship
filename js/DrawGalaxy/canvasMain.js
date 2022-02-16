class CanvasMain {
    motionBlur = false
    msaa = false
    bloom = false
    enableTargetTorus = true


    drawStarSystemsText = false

    materials = {}

    stars = []
    planets = []
    moons = []

    ships = []
    projectiles = []

    texts = []

    test = []

    constructor() {
        this.ENTIRE_SCENE = 0
        this.BLOOM_SCENE = 1
        this.bloomLayer = new THREE.Layers()
        this.bloomLayer.set( this.BLOOM_SCENE )
        console.log(this.bloomLayer)

        this.darkMaterialBloom = new THREE.MeshBasicMaterial( { color: 'black' } )
        this.materialsBloom = {}

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(50, 1920 / 550,0.0000000000000001,100000) //0.00000000000000001  //0.00000000000000001, 100000
        this.renderer = new THREE.WebGLRenderer( { canvas: spaceShipWindow, antialias:false, logarithmicDepthBuffer: true} )
        this.composer = new EffectComposer( this.renderer)

        const loader = new FontLoader()
        loader.load( threeJSFont, ( font )=> {
            this.font = font
        } )

        const matFont = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        })

        let drawText = (x,y,z,size,text,id) => {
            const shapes = this.font.generateShapes( text, size)
            const geometry = new THREE.ShapeGeometry( shapes )

            geometry.computeBoundingBox()
            const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x )
            geometry.translate( xMid, 0, 0 )


            this.texts[id] = new THREE.Mesh( geometry, matFont )

            this.texts[id].position.x = x
            this.texts[id].position.y = y
            this.texts[id].position.z = z

            this.scene.add( this.texts[id] )
            this.texts[id].lookAt(this.camera.position)
        }

        this.updateTextPosition = (x,y,z,id)=> {
            this.texts[id].position.x = x
            this.texts[id].position.y = y
            this.texts[id].position.z = z
            this.texts[id].lookAt(this.camera.position)
        }

        this.camera.rotation.order = 'YXZ' // fixed rotation shitshow

        //star materials
        this.materials["Class G"] = new THREE.MeshBasicMaterial( {color:0xf1ffa5} )
        this.materials["Class K"] = new THREE.MeshBasicMaterial( {color:0xffd69c} )

        //planet materials
        this.materials["Moon"] = new THREE.MeshPhongMaterial( {color:0x94908D, shininess:1} )
        this.materials["Mercury"] = new THREE.MeshPhongMaterial( {color:0x97979F, shininess:1} )
        this.materials["Venus"] = new THREE.MeshPhongMaterial( {color:0xBBB7AB, shininess:1} )
        this.materials["Earth"] = new THREE.MeshPhongMaterial( {color:0x8CB1DE, shininess:1} )
        this.materials["Mars"] = new THREE.MeshPhongMaterial( {color:0xE27B58, shininess:1} )
        this.materials["Jupiter"] = new THREE.MeshPhongMaterial( {color:0xDCD0B8, shininess:1} )
        this.materials["Saturn"] = new THREE.MeshPhongMaterial( {color:0xA49B72, shininess:1} )
        this.materials["Uranus"] = new THREE.MeshPhongMaterial( {color:0xBBE1E4, shininess:1} )
        this.materials["Neptune"] = new THREE.MeshPhongMaterial( {color:0x6081FF, shininess:1} )

        //target
        const geometry = new THREE.TorusGeometry( 10, 0.2, 2, 50 )
        const material = new THREE.MeshBasicMaterial( { color: 0x8888bb } )
        this.targetTorus = new THREE.Mesh( geometry, material )
        this.scene.add( this.targetTorus )
        this.targetTorus.visible = false


        //lights
        const ambientLight = new THREE.AmbientLight( 0x202020 )
        this.scene.add( ambientLight )

        this.light = new THREE.PointLight( 0xffffff, 0.2, 2 )
        this.light.position.set( -1, 0, -1)
        this.light.intensity = 1.5
        this.scene.add( this.light )

        //stars
        for (let i = 0; i<starSystems.length; i++) {
            let starColor = starSystems[i].stars[0].starType
            let starSize = starSystems[i].stars[0].radius/80000000 // /50000000 //FIX?
            let geometry = new THREE.SphereGeometry(starSize, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2)
            this.stars[i] = new THREE.Mesh(geometry, this.materials[starColor])
            this.stars[i].position.set(starSystems[i].position.x,starSystems[i].position.z,starSystems[i].position.y)
            this.stars[i].layers.enable( this.BLOOM_SCENE )
            this.scene.add(this.stars[i])

            drawText(starSystems[i].position.x,starSystems[i].position.z,starSystems[i].position.y,0.08,starSystems[i].name,i)

            if (this.planets[i]===undefined) {this.planets[i]=[]}
            for (let j = 0; j<starSystems[i].planets.length; j++) {
                let planetSize = (starSystems[i].planets[j].radius/605284096780)*1000 //FIX?
                let planetGeometry = new THREE.SphereGeometry(planetSize, 40, 40, 0, Math.PI * 2, 0, Math.PI * 2) //50,50
                let planetMaterial = this.materials[starSystems[i].planets[j].planetColor]
                this.planets[i][j] = new THREE.Mesh(planetGeometry, planetMaterial)
                this.scene.add(this.planets[i][j])
            }
            //TODO MOONS
        }

        //TEST
        /*this.stars2 = []
        let geometry = new THREE.SphereGeometry(0.005, 30, 30, 0, Math.PI * 2, 0, Math.PI * 2)
        for (let i = 0; i<100; i++) {
            this.stars2[i] = new THREE.Mesh(geometry, this.materials["Class G"])
            this.stars2[i].position.set(0.5+Math.random()*(-15),1.5-Math.random()*3,0.5+Math.random()*(-15))
            this.scene.add(this.stars2[i])
        }*/

        /*let test = this.test
        if (0===0) {
            let geometry = new THREE.CylinderGeometry( 0.0000000000000001, 0.0000000000000001, 0.0000000000000001, 12, 1 )  //0.01, 0.01, 0.1  //0.1, 0.1, 100
            let material = new THREE.MeshBasicMaterial( {color: 0x222222} )
            test.push( new THREE.Mesh( geometry, material ))
            test[0].position.x = 0
            test[0].position.z = 0.000000000000001 //9.x mm
            test[0].position.y = 0
            this.scene.add(test[0])
        }*/

        //this.reloadComposer(1920,550)
        //----------------------------------------


        this.camera.position.x = 0   //x
        this.camera.position.y = 0   //z
        this.camera.position.z = 0   //y


        //update Aspect Ratio
        let reportWindowSize = () => {
            this.camera.aspect = window.innerWidth/550
            this.renderer.setSize(window.innerWidth,550)
            this.camera.updateProjectionMatrix()
        }

        window.onresize = reportWindowSize


        setTimeout(()=>{
            this.render = () => {
                requestAnimationFrame(this.render)
                if (!settingsOpen) {
                    //this.renderer.render(this.scene, this.camera)
                    this.renderBloom( true )
                    this.composer.render()
                }
            }
            this.render()
        },100)
    }

    renderBloom( mask ) {
        let darkMaterialBloom = this.darkMaterialBloom
        let bloomLayer = this.bloomLayer
        let materialsBloom = this.materialsBloom


        let darkenNonBloomed = ( obj ) => {
            if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
                this.materialsBloom[ obj.uuid ] = obj.material
                obj.material = darkMaterialBloom
            }
        }

        let restoreMaterial = ( obj ) => {
            if ( materialsBloom[ obj.uuid ] ) {
                obj.material = materialsBloom[ obj.uuid ]
                delete materialsBloom[ obj.uuid ]
            }
        }


        if ( mask === true ) {
            this.scene.traverse( darkenNonBloomed )
            this.bloomComposer.render()
            this.scene.traverse( restoreMaterial )
        } else {
            this.camera.layers.set( this.BLOOM_SCENE )
            this.bloomComposer.render()
            this.camera.layers.set( this.ENTIRE_SCENE )
        }
    }





    reloadComposer(width = 1920,height = 550) {
        /*
        //MSAA
        let renderTarget
        if (settings.antialiasingmsaa===1) {
            renderTarget = new THREE.WebGLMultisampleRenderTarget( width, height )
            this.composer = new EffectComposer( this.renderer,renderTarget )
        } else {
            this.composer = new EffectComposer( this.renderer)
        }

        this.composer.setSize(width,height)

        let renderScene = new RenderPass( this.scene, this.camera )
        this.composer.addPass( renderScene )

        let copyPass = new ShaderPass( CopyShader )
        this.composer.addPass( copyPass )

        //-------------SSAA
        this.ssaaRenderPass = new SSAARenderPass( this.scene, this.camera )
        this.ssaaRenderPass.unbiased = true
        this.composer.addPass( this.ssaaRenderPass )
        this.ssaaRenderPass.enabled = false

        this.copyPassSSAA = new ShaderPass( CopyShader )
        this.composer.addPass( this.copyPassSSAA )
        this.copyPassSSAA.enabled = false

        //-------------Bloom
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 1.5, 0.4, 0.4 )
        this.composer.addPass( this.bloomPass )


        //-------------SMAA
        this.passSMAA = new SMAAPass( width, height )
        this.passSMAA.renderToScreen = false


        this.composer.addPass( this.passSMAA )
        this.passSMAA.enabled = false
*/

        //MSAA
        let renderTarget
        if (settings.antialiasingmsaa===1) {
            renderTarget = new THREE.WebGLMultisampleRenderTarget( width, height )
            this.composer = new EffectComposer( this.renderer,renderTarget )
        } else {
            this.composer = new EffectComposer( this.renderer)
        }

        this.composer.setSize(width,height)

        let renderScene = new RenderPass( this.scene, this.camera )
        this.composer.addPass( renderScene )

        let copyPass = new ShaderPass( CopyShader )
        this.composer.addPass( copyPass )

        //-------------SSAA
        this.ssaaRenderPass = new SSAARenderPass( this.scene, this.camera )
        this.ssaaRenderPass.unbiased = true
        this.composer.addPass( this.ssaaRenderPass )
        this.ssaaRenderPass.enabled = false

        this.copyPassSSAA = new ShaderPass( CopyShader )
        this.composer.addPass( this.copyPassSSAA )
        this.copyPassSSAA.enabled = false

        //-------------SMAA
        this.passSMAA = new SMAAPass( width, height )
        this.passSMAA.needsSwap = true;
        this.composer.addPass( this.passSMAA )
        this.passSMAA.enabled = false

        //-------------Bloom
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 1.5, 0.4, 0.4 )

        this.bloomComposer = new EffectComposer( this.renderer )
        this.bloomComposer.renderToScreen = false
        this.bloomComposer.addPass( renderScene )
        this.bloomComposer.addPass( this.bloomPass )


        //-------------Bloom Final Pass
        this.finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value:  this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: document.getElementById( 'vertexshader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
                defines: {}
            } ), 'baseTexture'
        )
       this.finalPass.needsSwap = true

        this.composer.addPass( this.finalPass )


        //
        updateSettings()
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

        //targetTorus
        if (Object.keys(playerShip.target).length===0 || !this.enableTargetTorus) {
            this.targetTorus.visible = false
        } else {
            let target = playerShip.target
            this.targetTorus.position.set(
                target.position.x-camHi.x-camLo.x,
                target.position.z-camHi.y-camLo.y,
                target.position.y-camHi.z-camLo.z,
            )
            this.targetTorus.lookAt(this.camera.position)
            let scale = (playerShip.targetDistance)/150
            this.targetTorus.scale.x = scale
            this.targetTorus.scale.y = scale
            this.targetTorus.scale.z = scale
            this.targetTorus.visible = true
        }


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

        if (this.drawStarSystemsText) {
            for (let i = 0; i<this.texts.length; i++) {
                this.texts[i].visible = true
            }
        } else {
            for (let i = 0; i<this.texts.length; i++) {
                this.texts[i].visible = false
            }
        }

        //stars
        for (let i = 0; i<starSystems.length; i++) {
            if (this.drawStarSystemsText) {
                this.updateTextPosition((starSystems[i].position.x)-camHi.x-camLo.x,(starSystems[i].position.z+0.05)-camHi.y-camLo.y,(starSystems[i].position.y)-camHi.z-camLo.z,i)
            }

            if (i===0) {
                this.light.position.set(
                    (starSystems[i].position.x)-camHi.x-camLo.x,
                    (starSystems[i].position.z)-camHi.y-camLo.y,
                    (starSystems[i].position.y)-camHi.z-camLo.z,
                )
            }


            this.stars[i].position.set(
                (starSystems[i].position.x)-camHi.x-camLo.x,
                (starSystems[i].position.z)-camHi.y-camLo.y,
                (starSystems[i].position.y)-camHi.z-camLo.z,
                )
            //planets
            for (let j = 0; j<starSystems[i].planets.length; j++) {
                this.planets[i][j].position.set (
                    (starSystems[i].planets[j].position.x)-camHi.x-camLo.x,
                    (starSystems[i].planets[j].position.z)-camHi.y-camLo.y,
                    (starSystems[i].planets[j].position.y)-camHi.z-camLo.z,
                )
            }
        }

        this.camera.rotation.x = ((playerShip.position.pitch.direction-180)/57.295779487363233601652280409982) //degrees -> radians
        this.camera.rotation.y = ((playerShip.position.yaw.direction-180)/57.295779487363233601652280409982) //degrees -> radians
    }


    enableMotionBlur() {
    }

    disableMotionBlur() {
    }

    enableBloom(bl) {
        this.bloomPass.enabled = true
        this.bloomPass.strength = bl
        for (let i = 0; i<starSystems.length; i++) {
            this.stars[i].layers.enable( this.BLOOM_SCENE )
        }
    }

    disableBloom() {
        this.bloomPass.enabled = false
        for (let i = 0; i<starSystems.length; i++) {
            this.stars[i].layers.disable( this.BLOOM_SCENE )
        }
    }

    enableSMAA() {
        this.passSMAA.enabled = true
    }

    disableSMAA() {
        this.passSMAA.enabled = false
    }

    enableSSAA() {
        this.ssaaRenderPass.enabled = true
        this.copyPassSSAA.enabled = true
    }

    disableSSAA() {
        this.ssaaRenderPass.enabled = false
        this.copyPassSSAA.enabled = false
    }

    setSSAA(samples) {
        this.ssaaRenderPass.sampleLevel = samples
    }

}

let shipWindow3D = new CanvasMain