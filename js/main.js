let debug = {performance:false,timeA:0,timeB:0,timeC:0,timeD:0,timeE:0,timeF:0}

let lastRender = 0
let progress = 16.666666666666666666666666666667
let gameFPS = 60
let avgFPSlastMin = [60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60]
let avgFPS = 60

let inputRange_speed = 0
let inputNumber_speed = 0

let timers = [{val:0,maxVal:60}]
let updateSystems = {i:0,array:[],}


//VerySlow,Slow,Medium,Fast,VeryFast,Default
let speedInputSet = "Default"
let speedInputArray = ["VerySlow","Slow","Medium","Fast","VeryFast","Default"]
let speedIdArray = 5

let settingsOpen = false


let doBeforeStart =  function() {
    //------------------------------
    //generate when the systems should be updated
    for (let i = 0; i < 3600; i++) {
        updateSystems.array[i] = []
    }
    let noSystems = starSystems.length
    let a = 0
    for (let i = 0; i<noSystems; i++) {
        updateSystems.array[a].push(i)
        a++
        if (a>3600) {a=0}
    }
    //------------------------------
    //------------------------------
    }

let elements = {
    inputRange_speed: document.getElementById("inputRange_speed"),
    inputNumber_speed: document.getElementById("inputNumber_speed"),
    atmosphereComposition: document.getElementById("atmosphereComposition"),
    pressureAndTemperature: document.getElementById("pressureAndTemperature"),
    speedFill: document.getElementById("speedFill"),
    speedText: document.getElementById("speedText"),
    antennasControl: document.getElementById("antennasControl"),
    energyConsumption: document.getElementById("energyConsumption"),
    energyGeneration: document.getElementById("energyGeneration"),
    generatorsControl: document.getElementById("generatorsControl"),
    capacitors: document.getElementById("capacitors"),
    batteries: document.getElementById("batteries"),
    batteryBorder: document.getElementById("batteryBorder"),
    batteryValue: document.getElementById("batteryValue"),
    batteryText: document.getElementById("batteryText"),
    gasTanksDiv: document.getElementById("gasTanksDiv"),
    fuelTanksDiv: document.getElementById("fuelTanksDiv"),
    btn_turnOffEngines: document.getElementById("btn_turnOffEngines"),
    throttleBar1: document.getElementById("throttleBar1"),
    throttleBar2: document.getElementById("throttleBar2"),
    throttleBar3: document.getElementById("throttleBar3"),
    throttleBar4: document.getElementById("throttleBar4"),
    throttleBar5: document.getElementById("throttleBar5"),
    throttleBar6: document.getElementById("throttleBar6"),
    throttleBar7: document.getElementById("throttleBar7"),
    throttleBar8: document.getElementById("throttleBar8"),
    throttleBar9: document.getElementById("throttleBar9"),
    throttleBar10: document.getElementById("throttleBar10"),
    debug123: document.getElementById("debug123"),
    navControl: document.getElementById("navControl"),
    shieldCharge: document.getElementById("shieldCharge"),
    root: document.querySelector(':root'),
    weaponBar: document.getElementById("weaponBar"),
    rcsV: document.getElementById("rcsV"),
    rcsH: document.getElementById("rcsH"),
    speedSensitivityValue: document.getElementById("speedSensitivityValue"),
    speedSensitivity: document.getElementById("speedSensitivity"),
}

for (let i = 0; i<11; i++) {
    elements["rcsBar"+i] = document.getElementById("rcsBar"+i)
    elements["rcs2Bar"+i] = document.getElementById("rcs2Bar"+i)
    elements["rcs3Bar"+i] = document.getElementById("rcs3Bar"+i)
    elements["rcs4Bar"+i] = document.getElementById("rcs4Bar"+i)
}


let speedInc = 1
function update(progress) {
    if (debug.performance) {
        debug.timeA = performance.now()
    }
    gameFPS = (1/progress*1000)/speedInc

    avgFPSlastMin.push(gameFPS)
    if (avgFPSlastMin.length===3600) {
        avgFPSlastMin.shift()
    }
    avgFPS = 0
    for (let i = 0; i<avgFPSlastMin.length;i++) {
        avgFPS += avgFPSlastMin[i]
    }
    avgFPS = avgFPS / avgFPSlastMin.length

    keyLoop() //keyboard inputs
    playerShip.everyFrame(gameFPS)
    mainServer.run()
    projectilesRun()
    aiShipsRun()


    timers[0].val+=1/gameFPS
    if (timers[0].val>timers[0].maxVal) {
        timers[0].val = 0
        //-----------------------------------------------------Every Min Code

        //
    }
    //Update Systems
    for (let i = 0; i<updateSystems.array[updateSystems.i].length; i++) {
        starSystems[updateSystems.array[updateSystems.i][i]].runMinute(avgFPS)
        //console.log(updateSystems.array[updateSystems.i][i])
    }
    updateSystems.i++
    if (updateSystems.i===3600) {updateSystems.i=0}


    //speed range<->number
     if (elements.inputRange_speed.value!==inputRange_speed) {
         elements.inputNumber_speed.value = elements.inputRange_speed.value
     } else if (elements.inputNumber_speed.value!==inputNumber_speed) {
         elements.inputRange_speed.value = elements.inputNumber_speed.value
     }
     inputRange_speed = elements.inputRange_speed.value
     inputNumber_speed = elements.inputNumber_speed.value

    playerShip.computers[0].data.inputSpeed = inputNumber_speed

    //throttle
    if (playerShip.computers[0].data.engineThrottle>=0) {
        throttleBar(playerShip.computers[0].data.engineThrottle*100,"throttleBar")
    } else {
        throttleBar(playerShip.computers[0].data.engineThrottle*(-100),"throttleBar")

    }

    //rcs
    elements.rcsV.textContent = ((playerShip.computers[0].data.rcsUThrust*100)-(playerShip.computers[0].data.rcsDThrust*100)).toFixed(3)
    elements.rcsH.textContent = ((playerShip.computers[0].data.rcsLThrust*100)-(playerShip.computers[0].data.rcsRThrust*100)).toFixed(3)
    throttleBar(playerShip.computers[0].data.rcsRThrust*100,"rcsBar",0,0.2,0.5,1,5,10,25,50,75,90) //right
    throttleBar(playerShip.computers[0].data.rcsLThrust*100,"rcs2Bar",0,0.2,0.5,1,5,10,25,50,75,90) //left

    throttleBar(playerShip.computers[0].data.rcsUThrust*100,"rcs4Bar",0,0.2,0.5,1,5,10,25,50,75,90) //up
    throttleBar(playerShip.computers[0].data.rcsDThrust*100,"rcs3Bar",0,0.2,0.5,1,5,10,25,50,75,90) //down


    if (debug.performance) {
        debug.timeC = performance.now()
        elements.debug123.innerHTML = (debug.timeC-debug.timeA).toFixed(1)+" ms  <br>"+(debug.timeA-debug.timeD).toFixed(1)+"ms"
        debug.timeD = performance.now()
    }

    shipWindow3D.run()
}

