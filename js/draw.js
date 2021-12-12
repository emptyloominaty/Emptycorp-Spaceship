//START
//GENERATE ANTENNAS----------------------------------------------------------------------------------------------
let antennasHTML = ""
for (let i = 0; i<playerShip.antennas.length; i++) {
    antennasHTML += "Antenna["+i+"]: <button id='btn_antenna"+i+"' onclick='inputFunctions.toggleAntenna("+i+")'>On</button>"
}
elements.antennasControl.innerHTML = antennasHTML
//GENERATE GENERATORS----------------------------------------------------------------------------------------------
let generatorsHTML = ""
for (let i = 0; i<playerShip.generators.length; i++) {
    generatorsHTML += "<p>Generator["+i+"]: <button id='btn_generator"+i+"' onclick='inputFunctions.toggleGenerator("+i+")'>Off</button> "+(playerShip.generators[i].output)+"GW</p>"
}
elements.generatorsControl.innerHTML = generatorsHTML
//GENERATE CAPACITORS----------------------------------------------------------------------------------------------
let capacitorsHTML = ""
for (let i = 0; i<playerShip.capacitors.length; i++) {
    capacitorsHTML += "<div class='flex-row'><div id='capacitorBorder"+i+"' class='capacitorBorder'>  <div id='capacitorValue"+i+"' class='capacitorValue'>   </div>" +
        " <span id='capacitorType"+i+"' class='capacitorType'></span></div> <span id='capacitorText"+i+"'></span></div>"
}
elements.capacitors.innerHTML = capacitorsHTML
for (let i = 0; i<playerShip.capacitors.length; i++) {
    elements["capacitorBorder" + i] = document.getElementById("capacitorBorder" + i)
    elements["capacitorValue" + i] = document.getElementById("capacitorValue" + i)
    elements["capacitorType" + i] = document.getElementById("capacitorType" + i)
    elements["capacitorText" + i] = document.getElementById("capacitorText" + i)
    elements["capacitorValue" + i].style.width = (playerShip.capacitors[i].charge / playerShip.capacitors[i].maxCharge * 100) + "%"
}
//tanks----------------------------------------------------------------------------------------------
let gasTanksHTML = ""
let fuelTanksHTML = ""
for (let i = 0; i<playerShip.tanks.length; i++) {
    if (playerShip.tanks[i].tankType==="gas") {
        gasTanksHTML += "<div class='flex-column' ><div id='tankBorder"+i+"' class='tankBorder' > <div id='tankValue"+i+"' class='tankValue gasTank'></div><span id='tankText2"+i+"'class='tankText2'> </span></div> <span id='tankText"+i+"' class='tankText'></span> </div>"
    } else if (playerShip.tanks[i].tankType==="fuel") {
        fuelTanksHTML += "<div class='flex-column' ><div id='tankBorder"+i+"' class='tankBorder' > <div id='tankValue"+i+"' class='tankValue fuelTank'></div><span id='tankText2"+i+"'class='tankText2'> </span></div> <span id='tankText"+i+"'class='tankText'></span></div>"
    }
}
elements.gasTanksDiv.innerHTML = gasTanksHTML
elements.fuelTanksDiv.innerHTML = fuelTanksHTML
for (let i = 0; i<playerShip.tanks.length; i++) {
    elements["tankBorder" + i] = document.getElementById("tankBorder" + i)
    elements["tankValue" + i] = document.getElementById("tankValue" + i)
    elements["tankText" + i] = document.getElementById("tankText" + i)
    elements["tankText2" + i] = document.getElementById("tankText2" + i)
}
//----------------------------------------------------------------------------------------------






function draw(progress) {
    //------------------------------------------------UI------------------------------------------
    elements.atmosphereComposition.innerText = (playerShip.atmosphere.nitrogen).toFixed(2)+"% "+(playerShip.atmosphere.oxygen).toFixed(2)+"% "+(playerShip.atmosphere.carbonDioxide).toFixed(2)+"%"
    elements.pressureAndTemperature.innerText =  (playerShip.atmosphere.pressure).toFixed(2)+"bar "+(playerShip.atmosphere.temperature-273.15).toFixed(1)+"°C"
    //update speed bar
    elements.speedFill.style.width = (playerShip.speed/playerShip.maxSpeed*100)+"%"
    elements.speedText.innerText = "Speed: "+playerShip.getSpeedText(playerShip.speed)
    //energy
    elements.energyConsumption.innerText = "-"+(playerShip.powerOutput*1000).toFixed(2) +"kW"
    elements.energyGeneration.innerText = "+"+(playerShip.powerInput*1000).toFixed(2) +"kW"
    //capacitors
    for (let i = 0; i<playerShip.capacitors.length; i++) {
        elements["capacitorValue" + i].style.width = (playerShip.capacitors[i].charge / playerShip.capacitors[i].maxCharge * 100) + "%"
        elements["capacitorType" + i].innerText = playerShip.capacitors[i].powerGroup
        elements["capacitorText" + i].innerText = (playerShip.capacitors[i].charge*1000).toFixed(2)+"/"+(playerShip.capacitors[i].maxCharge*1000)+"kWh "+(playerShip.capacitors[i].dischargePerSec*1000*3600).toFixed(1)+"kWh"
    }
    //battery
    elements.batteryValue.style.height = ((playerShip.batteries[0].charge/playerShip.batteries[0].maxCharge)*100)+"%"
    elements.batteryText.innerHTML = (playerShip.batteries[0].charge*1000).toFixed(0)+" <br>/<br> "+(playerShip.batteries[0].maxCharge*1000).toFixed(0)+" kWh"
    //tanks
    for (let i = 0; i<playerShip.tanks.length; i++) {
        elements["tankValue" + i].style.width = (playerShip.tanks[i].capacity/playerShip.tanks[i].maxCapacity*100)+"%"
        elements["tankText" + i].innerHTML = playerShip.tanks[i].type
        if (playerShip.tanks[i].tankType==="gas") {
            elements["tankText2" + i].innerHTML = playerShip.tanks[i].capacity.toFixed(0)+"/"+playerShip.tanks[i].maxCapacity.toFixed(0)+" l"
        } else if (playerShip.tanks[i].tankType==="fuel") {
            elements["tankText2" + i].innerHTML = playerShip.tanks[i].capacity.toFixed(0)+"/"+playerShip.tanks[i].maxCapacity.toFixed(0)+" kg"
        }
    }

    //------------------------------------------------DEBUG---------------------------------------
    document.getElementById("debug1").innerText = "Battery: "+ (playerShip.batteries[0].charge*1000).toFixed(5) + " / " +  (playerShip.batteries[0].maxCharge*1000) +"kWh"
    let debug2text = ""
    for (let i = 0; i< playerShip.capacitors.length; i++) {
        debug2text += "capacitor["+playerShip.capacitors[i].powerGroup+"]:"+ (playerShip.capacitors[i].charge*1000).toFixed(2) +" / "+ (playerShip.capacitors[i].maxCharge*1000) +"<br/>"
    }
    document.getElementById("debug2").innerHTML = debug2text

    let debug4text = ""
    for (let i = 0; i< playerShip.tanks.length; i++) {
        debug4text += "tank["+i+"]: ("+ playerShip.tanks[i].type +") "+ playerShip.tanks[i].capacity +" / "+ playerShip.tanks[i].maxCapacity +"<br/>"
    }
    document.getElementById("debug4").innerHTML = debug4text
    document.getElementById("debug5").innerText = "-"+ (playerShip.powerOutput*1000).toFixed(2) +"kW / +"+  (playerShip.powerInput*1000).toFixed(2) +"kW"

    document.getElementById("debug8").innerText = playerShip.weight.toFixed(2) +" kg"
    document.getElementById("debug9").innerText = playerShip.speed +"c ("+(playerShip.speed/8765.812756).toFixed(2)+"ly/h)"+" / "+playerShip.targetSpeed+"c"+ "("+(playerShip.targetSpeed/8765.812756).toFixed(2)+"ly/h)"
    document.getElementById("debug10").innerText = (playerShip.speed*299792458).toFixed(4)+"m/s"

    document.getElementById("debug11").innerText = (playerShip.thrust).toFixed(2)+" MN"
}
