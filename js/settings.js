
let settingsHTML = true


class Setting {
    setValue(val) {
        if (!this.locked) {
            settings[this.settingName] = val
            this.value = val
            updateSettingsHTML()
            updateSettings()
        }
    }

    getValue() {
        return settings[this.settingName]
    }

    test() {
        console.log(this.settingName)
    }

    constructor(name,settingName,options,optionsString,values,defaultValue,locked = false) {
        this.name = name
        this.settingName = settingName
        this.options = options
        this.optionsString = optionsString
        this.value = defaultValue
        this.values = values
        this.locked = locked
    }
}

let settings = {
    //Game
    //Graphics
    antialiasing:0,
    antialiasingfx:0,
    antialiasingsmaa:0,
    modelsQuality:2,
    renderQuality:2,
    renderDistance:2,
    bloom:1,
    motionBlur:0,
    //dev/experimental
    maxTimeSpeed:4,
    debugPerformance:0,
    multiThreading:0,
    drawAllShips:1, //change to 0?

    shipFar:1,
    shipMid:0.01,
    shipFarUpdate:30,
    shipMidUpdate:6,
    disableResourceSim:0
}

let settingsList = {
    "Game":[
    ],
    "Graphics":[
        new Setting("Render Quality","renderQuality",[0,1,2],{0:"50%",1:"75%",2:"100%"},[0.5,0.75,1],2),
        new Setting("Render Distance","renderDistance",[0,1,2],{0:"Low",1:"Medium",2:"High"},[10,1000,100000],2),
        new Setting("SMAA","antialiasingsmaa",[0,1],{0:"Off",1:"On"},[0,1],0),
        new Setting("Bloom","bloom",[0,1,2],{0:"Off",1:"Low",2:"High"},[0,0.8,1.6],1),
        new Setting("Motion Blur","motionBlur",[0,1],{0:"Off",1:"On"},[0,1],0),
        //new Setting("Models Quality (TODO)","modelsQuality",[0,1,2],{0:"Low",1:"Medium",2:"High"},[0,1,2],2),
     ],
    "Dev/Experimental":[
        new Setting("Debug Perf","debugPerformance",[0,1],{0:"Off",1:"On"},[0,1],0),
        new Setting("Max Time Speed","maxTimeSpeed",[4,5,8,10,30,60],{4:"4x",5:"5x",8:"8x",10:"10x",30:"30x",60:"60x"},[4,5,8,10,30,60],4),
        new Setting("MultiThreading","multiThreading",[0,1],{0:"Off",1:"On"},[0,1],0),
        new Setting("Draw ALL ships in Nav","drawAllShips",[0,1],{0:"Off",1:"On"},[0,1],1),
        new Setting("Far Update (every x frames)","shipFarUpdate",[10,15,20,30],{10:"10",15:"15",20:"20",30:"30"},[10,15,20,30],30),
        new Setting("Mid Update (every x frames)","shipMidUpdate",[2,3,4,5,6,10,30],{2:"2",3:"3",4:"4",5:"5",6:"6",10:"10",30:"30"},[2,3,4,5,6,10,30],6),
        new Setting("Far Distance (ly)","shipFar",[0.25,0.5,1,2,5],{0.25:"0.25",0.5:"0.5",1:"1",2:"2",5:"5"},[0.25,0.5,1,2,5],1),
        new Setting("Mid Distance (ly)","shipMid",[0.01,0.1,0.5,1,2],{0.01:"0.01",0.1:"0.1",0.5:"0.5",1:"1",2:"2"},[0.01,0.1,0.5,1,2],0.01),
        new Setting("Disable All Ship/Systems","disableResourceSim",[0,1],{0:"No",1:"Yes"},[0,1],0,true),
        ]
}


let keybinds = {
    keyListening:0,
    keyDone:true,
    "Pitch Up":"KeyW",
    "Pitch Down":"KeyS",
    "Yaw Left":"KeyA",
    "Yaw Right":"KeyD",
    "Weapon 1":"Digit1",
    "Weapon 2":"Digit2",
    "Weapon 3":"Digit3",
    "Weapon 4":"Digit4",
    "Increase Speed":"ShiftLeft",
    "Decrease Speed" :"ControlLeft",
    "Target Nearest Enemy":"Tab",
    "Toggle Hud":"KeyH",
    "Autopilot":"KeyX",
    "Main Generator":"KeyG",
    "Show System Name":"KeyC",
    }

let updateSettings = function() {
    //motion blur
    if (settings.motionBlur===1) {
        if (!shipWindow3D.motionBlur) {
            shipWindow3D.enableMotionBlur()
            shipWindow3D.motionBlur = true
        }
    } else {
        if (shipWindow3D.motionBlur) {
            shipWindow3D.disableMotionBlur()
            shipWindow3D.motionBlur = false
        }
    }
    //bloom
    if (settings.bloom!==0) {
        let bl = settingsList["Graphics"][3].values[settingsList["Graphics"][3].value]
        shipWindow3D.enableBloom(bl)
    } else {
        shipWindow3D.disableBloom()
    }
    //smaa
    if (settings.antialiasingsmaa===1) {
        shipWindow3D.enableSMAA()
    } else {
        shipWindow3D.disableSMAA()
    }
    //shipWindow3D.resetRenderer(Boolean(settingsList["Graphics"][2].values[settingsList["Graphics"][2].value]))
    //render distance
    shipWindow3D.camera.far = settingsList["Graphics"][1].values[settingsList["Graphics"][1].value]
    shipWindow3D.camera.updateProjectionMatrix()
    //render Quality
    shipWindow3D.renderer.setPixelRatio(settingsList["Graphics"][0].values[settingsList["Graphics"][0].value])
    //
    document.getElementById("inputRange_time").max = settings.maxTimeSpeed //settingsList["Dev/Experimental"][1].value
    //
    debug.performance = Boolean(settings.debugPerformance)
    if (settings.disableResourceSim===1) {
        for (let i = 0; i<aiShips.length; i++){
            aiShips[i].destroyed = true
        }
    }

}
let menus = ["shipInfo","galaxyMap","settings","keybinds","save","load"]
let menuIn = "settings"
let settingsData = {centerX:0,centerY:0,mapScaling:50}

let updateMenu = function(id) {
    generateMenu(id)
    document.getElementById("menu_"+menuIn).classList.remove("selectedMenu")
    menuIn = menus[id]
    document.getElementById("menu_"+menuIn).classList.add("selectedMenu")
}

let generateMenu = function(id) {
    let html = ""
    //menu
    html += "<div class='flex-column gameMenu'> " +
        " <button class='menuButton' onclick='updateMenu(0)' id='menu_shipInfo'>Ship Info</button>" +
        " <button class='menuButton' onclick='updateMenu(1)' id='menu_galaxyMap'>Galaxy Map</button>" +
        " <button class='menuButton' onclick='updateMenu(2)' id='menu_settings'>Settings</button>" +
        " <button class='menuButton' onclick='updateMenu(3)' id='menu_keybinds'>Keybinds</button>" +
        " <button class='menuButton' onclick='updateMenu(4)' id='menu_save'>Save</button>" +
        " <button class='menuButton' onclick='updateMenu(5)' id='menu_load'>Load</button>" +
        "</div>"

    if (menus[id]==="settings") {//-----------------------------------------------------------------------------------Settings
        //settings
        let categoryArray = []
        Object.keys(settingsList).forEach(key => {
            categoryArray.push(key)
            html+= "<div class='flex-column settingCategory' id='settingCategory"+key+"'><h3 class='settingH3'>"+key+"</h3></div>"
        })
        elements.appSettings.innerHTML = html

        for (let i = 0; i<categoryArray.length; i++) {
            html = ""
            let array = settingsList[categoryArray[i]]
            for (let j = 0; j<array.length; j++) {
                //let setVal = array[j].optionsString[settings[array[j].settingName]]
                html += "<div class='flex-row settingItem'><span>"+array[j].name+": </span> <div class='settingOptions'>"
                for (let a = 0; a<array[j].options.length; a++) {
                    html+= "<button onclick='settingsList[\""+categoryArray[i]+"\"]["+j+"].setValue("+array[j].options[a]+")' class='settingItemC' id='setting"+i+j+a+"'> "+array[j].optionsString[array[j].options[a]]+" </button>"
                }
                html += "</div></div>"

            }
            document.getElementById("settingCategory"+categoryArray[i]).innerHTML += html
        }
        updateSettingsHTML()
    } else if (menus[id]==="keybinds") {//-----------------------------------------------------------------------------------Keybinds
        html += "<div class='keybinds'>"
        //keybinds
        Object.keys(keybinds).forEach(key => {
            if(key!=="keyListening" && key!=="keyDone")
          html+= "<div class='keybind'> <span class='keybindName'>"+key+"</span> <button class='settingItemC keybindButton' onclick='keybinds.keyListening=\""+key+"\"'>"+keybinds[key]+"</button></div>"
        })
        html+= "</div>"
        elements.appSettings.innerHTML = html
    } else if (menus[id]==="galaxyMap") {//-----------------------------------------------------------------------------------Galaxy Map
        html+="<canvas id='galaxyMapCanvas' style='margin:10px;'></canvas>" //TODO: WIDTH 3Modes?  1920x1080 / 1600x900 / 1366x768  (get window size -> change canvas width and height)
        elements.appSettings.innerHTML = html
        let canvasElement = document.getElementById("galaxyMapCanvas")

        let changeScaling = (event) => {
            event.preventDefault()


            let val = event.deltaY * -0.01
            if (val>0) {
                settingsData.mapScaling+=0.05*settingsData.mapScaling
            } else if((val<0)) {
                settingsData.mapScaling-=0.05*settingsData.mapScaling
                if (settingsData.mapScaling<2) {
                    settingsData.mapScaling = 2
                }
            }
            reDraw()
        }

        canvasElement.onwheel = changeScaling

        canvasElement.width = 1500
        canvasElement.height = 700
        let canvas = canvasElement.getContext("2d")
        const width = canvasElement.getBoundingClientRect().width
        const height = canvasElement.getBoundingClientRect().height

        let isMoving = false
        let mx = 0
        let my = 0

        canvasElement.addEventListener('mousedown', e => {
            mx = e.offsetX
            my = e.offsetY
            isMoving = true
        })

        canvasElement.addEventListener('mousemove', e => {
            if (isMoving === true) {
                settingsData.centerX += ((e.offsetX-mx))/settingsData.mapScaling
                settingsData.centerY += ((e.offsetY-my))/settingsData.mapScaling
                reDraw()
                mx = e.offsetX
                my = e.offsetY
            }
        })

        canvasElement.addEventListener('mouseup', e => {
            if (isMoving === true) {
                mx = 0
                my = 0
                isMoving = false
            }
        })



        let reDraw = function() {
            let scaling = settingsData.mapScaling
            canvas.fillStyle = "#000000"
            canvas.fillRect(0,0,width,height)

            let drawCircle = function(x,y,radius,color) {
                canvas.beginPath()
                canvas.fillStyle = color
                canvas.arc(x, y, radius, 0, 2 * Math.PI, false)
                canvas.fill()
                canvas.closePath()
            }

            let drawText = function(x,y,text,font,color,align = "center") {
                canvas.textAlign = align
                canvas.font = font
                canvas.fillStyle = color
                canvas.fillText(text,x,y)
            }

            let centerScreen = {x:canvasElement.width/2, y:canvasElement.height/2}
            let center = {x:settingsData.centerX*scaling,y:settingsData.centerY*scaling}
            let player = {x:playerShip.position.x*scaling,y:playerShip.position.y*scaling}

            for (let i = 0; i<starSystems.length; i++) {
                let x = ((starSystems[i].position.x*scaling*(-1))+centerScreen.x)+center.x
                let y = ((starSystems[i].position.y*scaling*(-1))+centerScreen.y)+center.y
                let size = 15
                let color = factionList[starSystems[i].faction].color
                drawCircle(x,y,size,color)
                drawText(x,y-5,starSystems[i].name,"12px Consolas","#FFFFFF")
            }

            let x = ((player.x*(-1))+centerScreen.x)+center.x
            let y = ((player.y*(-1))+centerScreen.y)+center.y
            drawCircle(x,y,10,"#a70000")
            drawText(x,y-5,"Player","12px Consolas","#FFFFFF")

            drawText(5,15,"X: "+(settingsData.centerX).toFixed(2),"16px Consolas","#AAAAAA","left")
            drawText(5,35,"Y: "+(settingsData.centerY).toFixed(2),"16px Consolas","#AAAAAA","left")

            drawCircle(centerScreen.x,centerScreen.y,2,"#ffffff")

        }

        reDraw()



    } else if (menus[id]==="shipInfo") { //-----------------------------------------------------------------------------------Ship Info
        html+="<div class='flex-column'> "
        html+="<h3>Player</h3>"
        html+="<span>Credits: "+Math.round(playerShip.credits)+" Cr </span>"
        html+="<span>Relations: </span>"
        Object.keys(factionList).forEach(key => {
            if (key!=="Player") {
                html+="<span>&nbsp;&nbsp;"+key+": "+(factionList[key].relations["Player"]).toFixed(0)+"</span>"
            }
        })

        html+="<br><h3>Ship</h3>"
        html+="<span> Length:"+playerShip.size.l+"m |  Height:"+playerShip.size.h+"m | Width:"+playerShip.size.w+"m  </span>"
        html+="<span>Weight: "+(playerShip.weight).toFixed(0)+" kg</span>"
        html+="<span>Max Speed: "+(playerShip.maxSpeed/8765.812756).toFixed(1)+" ly/h</span>"
        html+="<span>Armor: "+playerShip.armor.toFixed(0)+"/"+playerShip.armorMax+"</span>"
        html+="<span>Shield: "+playerShip.shields[0].charged.toFixed(0)+"/"+playerShip.shields[0].maxCharge+"</span>"

        html+="<span>Antenna: "+playerShip.antennas[0].maxSpeed+" Mbit"+"</span>"

        html+="<span>Battery: "+Math.round(playerShip.batteries[0].charge*1000)+"/"+playerShip.batteries[0].maxCharge*1000+" kWh</span>"

        for (let i = 0; i<playerShip.generators.length; i++) {
            let generatorFuelLeft = playerShip.checkTank(playerShip.generators[i].generatorFuelType)/playerShip.generators[i].consumption
            let totalPowerLeft = (generatorFuelLeft*playerShip.generators[i].output)/3600

            html+="<span>"+playerShip.generators[i].type+" Total Power Left: "+(totalPowerLeft).toFixed(0)+" MWh </span>"
        }
        html+="<span>Weapons: </span>"
        for (let i = 0; i<playerShip.weapons.length; i++) {
            html+="<span>&nbsp;&nbsp;"+playerShip.weapons[i].type+"</span>"
        }

        html+="<span>Crew: </span>"
        for (let i = 0; i<playerShip.crew.length; i++) {
            html+="<span>&nbsp;&nbsp;"+playerShip.crew[0].name+"</span>"
        }


        html+="</div>"
        elements.appSettings.innerHTML = html
    } else if (menus[id]==="load") { //--------------------------------------------------------------------------------------------Load
        html+=""
        elements.appSettings.innerHTML = html
    } else if (menus[id]==="save") { //--------------------------------------------------------------------------------------------Save
        html+=""
        elements.appSettings.innerHTML = html
    }



}


let generateSettingsHTML = function() {
    let html = ""
    //menu
    html += "<div class='flex-column gameMenu'> " +
        " <button class='menuButton' onclick='updateMenu(0)' id='menu_shipInfo'>Ship Info</button>" +
        " <button class='menuButton' onclick='updateMenu(1)' id='menu_galaxyMap'>Galaxy Map</button>" +
        " <button class='menuButton' onclick='updateMenu(2)' id='menu_settings'>Settings</button>" +
        " <button class='menuButton' onclick='updateMenu(3)' id='menu_keybinds'>Keybinds</button>" +
        " <button class='menuButton' onclick='updateMenu(4)' id='menu_save'>Save</button>" +
        " <button class='menuButton' onclick='updateMenu(5)' id='menu_load'>Load</button>" +
        "</div>"

    let categoryArray = []
    Object.keys(settingsList).forEach(key => {
        categoryArray.push(key)
        html+= "<div class='flex-column settingCategory' id='settingCategory"+key+"'><h3 class='settingH3'>"+key+"</h3></div>"
    })
    elements.appSettings.innerHTML = html

    for (let i = 0; i<categoryArray.length; i++) {
        html = ""
        let array = settingsList[categoryArray[i]]
        for (let j = 0; j<array.length; j++) {
            //let setVal = array[j].optionsString[settings[array[j].settingName]]
            html += "<div class='flex-row settingItem'><span>"+array[j].name+": </span> <div class='settingOptions'>"
            for (let a = 0; a<array[j].options.length; a++) {
                html+= "<button onclick='settingsList[\""+categoryArray[i]+"\"]["+j+"].setValue("+array[j].options[a]+")' class='settingItemC' id='setting"+i+j+a+"'> "+array[j].optionsString[array[j].options[a]]+" </button>"
            }
            html += "</div></div>"

        }
        document.getElementById("settingCategory"+categoryArray[i]).innerHTML += html
    }
}

let updateSettingsHTML = function() {
    let categoryArray = []
    Object.keys(settingsList).forEach(key => {
        categoryArray.push(key)
    })
    for (let i = 0; i<categoryArray.length; i++) {
        let array = settingsList[categoryArray[i]]
        for (let j = 0; j<array.length; j++) {
            let setVal = settings[array[j].settingName]
            for (let a = 0; a<array[j].options.length; a++) {
                //background color
                if (array[j].options[a]==setVal) {
                    document.getElementById("setting"+ i + j + a).style.backgroundColor = "rgba(255,255,255,0.25)"
                } else {
                    document.getElementById("setting"+ i + j +""+ a).style.backgroundColor = "rgba(255,255,255,0)"
                }
            }
        }
    }
}

let drawSettings = function() {
    if(!settingsOpen){
        if (settingsHTML) {
            document.getElementById("app").style.filter = "" //blur(0)
            setTimeout(()=>{elements.appSettings.style.display = "none"},200)
            elements.appSettings.style.filter = "opacity(0)"
            settingsHTML = false
        }
    } else {
        if (!settingsHTML) {
            document.getElementById("app").style.filter = "grayscale(100%)" //blur(20px)
            elements.appSettings.style.display = "flex"
            elements.appSettings.style.filter = "opacity(1)"
            settingsHTML = true
        }
    }
    if (menuIn==="keybinds") {
        if (!keybinds.keyDone) {
            updateMenu(3)
            keybinds.keyDone = true
        }
    }
}

generateSettingsHTML()
updateSettingsHTML()
updateSettings()
document.getElementById("menu_"+menuIn).classList.add("selectedMenu")