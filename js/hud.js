let hudEnabled = true
let hudGenerated = false
let flashmessage = {
    messages:[],
    add: function(text) {
       this.messages.push({text:text,duration:5,time:0})
    },
    run: function() {
        elements.flashMessage.textContent = ""
        let timeChange = 1/gameFPS
        for (let i = 0; i<this.messages.length; i++) {
            elements.flashMessage.textContent += this.messages[i].text+"\r\n"
            this.messages[i].time+=timeChange
            if(this.messages[i].time>this.messages[i].duration) {
                this.messages.shift()
            }
        }
    }
}

let drawHud = function () {
 if (hudEnabled) {
     if (!hudGenerated) {
         flashmessage.messages = []
         elements.hud.innerHTML = "<div id='weaponBar'></div>"
         elements.weaponBar = document.getElementById("weaponBar")

         //Weapon Bar
         let html = ""
         for (let i = 0; i<playerShip.weapons.length; i++) {
             let wep = playerShip.weapons[i]
             html +="<div class='weaponBar'> "+wep.type+"("+Number(i+1)+")<br><span id='wepMissiles"+i+"'></span><br> <div class='wepCdBorder'><div class='wepCd' id='wepCd"+i+"'> </div></div> </div>"
         }
         elements.weaponBar.innerHTML = html
         html = ""
         //Armor,Shield
         html +=  "<div id='shieldArmorBars'><div id='shieldBorder'><div id='shieldBar'> </div> </div> <div id='armorBorder'><div id='armorBar'> </div> </div></div>"

         //TargetSpeed + Speed
         html += "<div id='hudSpeedDiv'> <div id='hudSpeed'></div> <div id='hudTargetSpeed'></div> </div>"

         //Flash Message
         html += "<div id='flashMessage'></div>"

         elements.hud.innerHTML += html

         for (let i = 0; i<playerShip.weapons.length; i++) {
             elements["wepCd"+i] = document.getElementById("wepCd"+i)
             elements["wepMissiles"+i] = document.getElementById("wepMissiles"+i)
         }

         elements["shieldArmorBars"] = document.getElementById("shieldArmorBars")
         elements["shieldBar"] = document.getElementById("shieldBar")
         elements["armorBar"] = document.getElementById("armorBar")

         elements["hudSpeedDiv"] = document.getElementById("hudSpeedDiv")
         elements["hudTargetSpeed"] = document.getElementById("hudTargetSpeed")
         elements["hudSpeed"] = document.getElementById("hudSpeed")
         elements["flashMessage"] = document.getElementById("flashMessage")
         hudGenerated = true
     }
     //speed
     elements.hudSpeed.textContent = getSpeedText(playerShip.speed) + " |"
     elements.hudTargetSpeed.textContent = "| "+getSpeedText(playerShip.targetSpeed)


     //weapons
     for (let i = 0; i<playerShip.weapons.length; i++) {
         if (playerShip.weapons[i].type === "missile") {
             if (playerShip.missileCargo[0].count>0) {
                 document.getElementById("wepMissiles"+i).textContent = playerShip.missileCargo[0].count+" / "+playerShip.missileCargo[0].maxCount
             } else {
                 document.getElementById("wepMissiles"+i).textContent = "no missiles"
             }
         }
         document.getElementById("wepCd"+i).style.width = (playerShip.weapons[i].cooldown/playerShip.weapons[i].maxCooldown*100)+"%"
     }

     //Armor,Shield
     elements.armorBar.style.width = (playerShip.armor/playerShip.armorMax*100)+"px"
     elements.shieldBar.style.width = (playerShip.shields[0].charged/playerShip.shields[0].maxCharge*100)+"px"

     //flashmessage
     flashmessage.run()
 } else {
     hudGenerated=false
     elements.hud.innerHTML = ""
 }
}