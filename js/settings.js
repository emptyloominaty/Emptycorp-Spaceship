let settingsOpen = false
let settingsHTML = true


class Setting {
    setValue(val) {
        settings[this.settingName] = val
        this.value = val
        updateSettingsHTML()
        updateSettings()
    }

    getValue() {
        return settings[this.settingName]
    }

    test() {
        console.log(this.settingName)
    }

    constructor(name,settingName,options,optionsString,values,defaultValue) {
        this.name = name
        this.settingName = settingName
        this.options = options
        this.optionsString = optionsString
        this.value = defaultValue
        this.values = values
    }
}



let settings = {
    //Game
    //Graphics
    antialiasing:0,
    antialiasingfx:0,
    modelsQuality:2,
    renderQuality:2,
    renderDistance:2,
    //dev/experimental
    maxTimeSpeed:4,
    debugPerformance:0,
}

let settingsList = {
    "Game":[
    ],
    "Graphics":[
        new Setting("Render Quality","renderQuality",[0,1,2],{0:"50%",1:"75%",2:"100%"},[0.5,0.75,1],2),
        new Setting("Render Distance","renderDistance",[0,1,2],{0:"Low",1:"Medium",2:"High"},[10,1000,100000],2),
        new Setting("MSAA (TODO, idk how)","antialiasing",[0,1],{0:"Off",1:"On"},[0,1],0),
        new Setting("FXAA (Dont, low perf)","antialiasingfx",[0,1],{0:"Off",1:"On"},[0,1],0),
        new Setting("Models Quality (TODO)","modelsQuality",[0,1,2],{0:"Low",1:"Medium",2:"High"},[0,1,2],2),

     ],
    "Dev/Experimental":[
        new Setting("Debug Perf","debugPerformance",[0,1],{0:"Off",1:"On"},[0,1],0),
        new Setting("Max Time Speed","maxTimeSpeed",[4,5,8,10,30,60],{4:"4x",5:"5x",8:"8x",10:"10x",30:"30x",60:"60x"},[4,5,8,10,30,60],4),
        ]
}


let updateSettings = function() {
    //fxaa
    shipWindow3D.fxaa = settings.antialiasingfx
    //msaa
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
}


let generateSettingsHTML = function() {
    let html = ""
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
}

generateSettingsHTML()
updateSettingsHTML()
updateSettings()
