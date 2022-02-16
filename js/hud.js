let hudEnabled = true
let hudGenerated = false
let flashmessage = {
    messages:[],
    colors:{
        fail:["rgba(255,70,67,0.45)","rgba(255,70,67,0.8)"],
        success:["rgba(117,255,116,0.45)","rgba(117,255,116,0.8)"],
        default:["rgba(101, 176, 255, 0.45)","rgba(101, 176, 255, 0.8)"],
        yellow:["rgba(255,254,127,0.45)","rgba(255,254,127,0.8)"],
        purple:["rgba(191,118,255,0.45)","rgba(191,118,255,0.8)"],
    },
    add: function(text,color = "default") {
        let colorF = this.colors[color][0]
        let colorS = this.colors[color][1]
        this.messages.push({text:text,duration:5,time:0,color:colorF,color2:colorS})
    },
    run: function() {
        elements.flashMessage.innerHTML = ""
        let timeChange = 1/gameFPS
        for (let i = 0; i<this.messages.length; i++) {
            elements.flashMessage.innerHTML += "<span style='color:"+this.messages[i].color+"; text-shadow:"+this.messages[i].color2+" 0 0 5px;' >"+this.messages[i].text+"</span><br>"
            this.messages[i].time+=timeChange
            if(this.messages[i].time>this.messages[i].duration) {
                this.messages.shift()
            }
        }
    }
}

let drawHud = function () {
 if (hudEnabled && playerShip.computers[0].on===1) {
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

         //JumpDrive
         html+= "<div id='hudJumpDrive'>Jump Drive<br> <div id='hudJumpDriveBorder' > <div id='hudJumpDriveCharging'></div></div></div>"

         elements.hud.innerHTML += html

         //RCS
         html = `
                 <div class="rcsBar2V">
                     <div class="rcsBarV" id="rcs4Bar10"></div>
                     <div class="rcsBarV" id="rcs4Bar9"></div>
                     <div class="rcsBarV" id="rcs4Bar8"></div>
                     <div class="rcsBarV" id="rcs4Bar7"></div>
                     <div class="rcsBarV" id="rcs4Bar6"></div>
                     <div class="rcsBarV" id="rcs4Bar5"></div>
                     <div class="rcsBarV" id="rcs4Bar4"></div>
                     <div class="rcsBarV" id="rcs4Bar3"></div>
                     <div class="rcsBarV" id="rcs4Bar2"></div>
                     <div class="rcsBarV" id="rcs4Bar1"></div>
                 </div>
                 <div id="rcsBar">
                     <div class="rcsBar" id="rcs2Bar10"></div>
                     <div class="rcsBar" id="rcs2Bar9"></div>
                     <div class="rcsBar" id="rcs2Bar8"></div>
                     <div class="rcsBar" id="rcs2Bar7"></div>
                     <div class="rcsBar" id="rcs2Bar6"></div>
                     <div class="rcsBar" id="rcs2Bar5"></div>
                     <div class="rcsBar" id="rcs2Bar4"></div>
                     <div class="rcsBar" id="rcs2Bar3"></div>
                     <div class="rcsBar" id="rcs2Bar2"></div>
                     <div class="rcsBar" id="rcs2Bar1"></div>
                     <div class="vline"></div>
                     <div class="rcsBar" id="rcsBar1"></div>
                     <div class="rcsBar" id="rcsBar2"></div>
                     <div class="rcsBar" id="rcsBar3"></div>
                     <div class="rcsBar" id="rcsBar4"></div>
                     <div class="rcsBar" id="rcsBar5"></div>
                     <div class="rcsBar" id="rcsBar6"></div>
                     <div class="rcsBar" id="rcsBar7"></div>
                     <div class="rcsBar" id="rcsBar8"></div>
                     <div class="rcsBar" id="rcsBar9"></div>
                     <div class="rcsBar" id="rcsBar10"></div>
                 </div>
                 <div class="rcsBar2V">
                     <div class="rcsBarV" id="rcs3Bar1"></div>
                     <div class="rcsBarV" id="rcs3Bar2"></div>
                     <div class="rcsBarV" id="rcs3Bar3"></div>
                     <div class="rcsBarV" id="rcs3Bar4"></div>
                     <div class="rcsBarV" id="rcs3Bar5"></div>
                     <div class="rcsBarV" id="rcs3Bar6"></div>
                     <div class="rcsBarV" id="rcs3Bar7"></div>
                     <div class="rcsBarV" id="rcs3Bar8"></div>
                     <div class="rcsBarV" id="rcs3Bar9"></div>
                     <div class="rcsBarV" id="rcs3Bar10"></div>
                 </div>
             <span id="rcsV"></span>
             <span id="rcsH"></span>
                 `
         elements.hudRCS.innerHTML += html





         for (let i = 0; i<playerShip.weapons.length; i++) {
             elements["wepCd"+i] = document.getElementById("wepCd"+i)
             elements["wepMissiles"+i] = document.getElementById("wepMissiles"+i)
         }

         elements.hudJumpDriveCharging = document.getElementById("hudJumpDriveCharging")
         elements.hudJumpDrive = document.getElementById("hudJumpDrive")

         elements["shieldArmorBars"] = document.getElementById("shieldArmorBars")
         elements["shieldBar"] = document.getElementById("shieldBar")
         elements["armorBar"] = document.getElementById("armorBar")

         elements["hudSpeedDiv"] = document.getElementById("hudSpeedDiv")
         elements["hudTargetSpeed"] = document.getElementById("hudTargetSpeed")
         elements["hudSpeed"] = document.getElementById("hudSpeed")
         elements["flashMessage"] = document.getElementById("flashMessage")

         //yaw
         html = ""
         for (let j = 0; j<4;j++) {
             for (let i = 35; i>=0;i--) {
                 html+="<span id='degrees10-"+i+"-"+j+"' class='degrees10'>"+i*10+"° </span>"
             }
         }
         elements.hudYaw.innerHTML = html
         for (let j = 0; j<4;j++) {
             for (let i = 35; i>=0;i--) {
                 elements["degrees10-"+i+"-"+j] = document.getElementById("degrees10-"+i+"-"+j)
             }
         }
         elements.hudYawCenter.innerHTML = "<div id='hudYawCenter2'></div>"
         elements.hudYawCenter2 = document.getElementById("hudYawCenter2")
         //pitch
         html = ""
         for (let j = 0; j<2;j++) {
             for (let i = 35; i>=0;i--) {
                 html+="<span id='degrees10-"+i+"-"+j+"p' class='degrees10p'>"+i*10+"°</span>"
             }
         }
         elements.hudPitch.innerHTML = html
         for (let j = 0; j<2;j++) {
             for (let i = 35; i>=0;i--) {
                 elements["degrees10-"+i+"-"+j+"p"] = document.getElementById("degrees10-"+i+"-"+j+"p")
             }
         }
         elements.hudPitchCenter.innerHTML = "<div id='hudPitchCenter2'></div>"

         elements.hudPitchCenter2 = document.getElementById("hudPitchCenter2")


         for (let i = 0; i<11; i++) {
             elements["rcsBar"+i] = document.getElementById("rcsBar"+i)
             elements["rcs2Bar"+i] = document.getElementById("rcs2Bar"+i)
             elements["rcs3Bar"+i] = document.getElementById("rcs3Bar"+i)
             elements["rcs4Bar"+i] = document.getElementById("rcs4Bar"+i)
         }

         elements.rcsV = document.getElementById("rcsV")
         elements.rcsH = document.getElementById("rcsH")


         elements.navControl.style.opacity= 1
         hudGenerated = true
     }
     //--------------------------------------------------------------------------------------------------------------------------------------------------------
     let wwidth = window.innerWidth
     let wheight = window.innerHeight

     //jump drive
     elements.hudJumpDriveCharging.style.width = (playerShip.jumpDrive.charged/playerShip.jumpDrive.chargeNeeded*100)+"%"
     if(playerShip.jumpDrive.running===0) {
         elements.hudJumpDrive.style.opacity = 0
     } else {
         elements.hudJumpDrive.style.opacity = 1
     }

     //yaw
     let maxYaw = (1300*(wwidth/1920))
     let minYaw = (620*(wwidth/1920))

     let maxFadeYaw = maxYaw-40
     let minFadeYaw = minYaw+40

     for (let j = 0; j<4;j++) {
         for (let i = 35; i>=0;i--) {
             let x = elements["degrees10-"+i+"-"+j].getBoundingClientRect().x
             if (x>maxYaw || x<minYaw) {
                 elements["degrees10-"+i+"-"+j].style.opacity = 0
             } else {
                 if (x>maxFadeYaw) {
                     elements["degrees10-"+i+"-"+j].style.opacity = (maxYaw-x)/40
                 } else if (x<minFadeYaw) {
                     elements["degrees10-"+i+"-"+j].style.opacity = (x-minYaw)/40
                 } else {
                     elements["degrees10-"+i+"-"+j].style.opacity = 1
                 }
             }
         }
     }
     elements.hudYaw.style.transform =  "translate("+((playerShip.position.yaw.direction*4)-3798)+"px)"
     //pitch
     elements.hudPitchCenter2.style.left = (600*(wwidth/1920))+"px"
     elements.hudPitch.style.left = (600*(wwidth/1920))+"px"

     elements.hudPitchCenter2.style.top = 80+(180*(wheight/977))+"px"//170+(90*(wheight/977))+"px"
     elements.hudPitch.style.top = (180*(wheight/977))+"px"//(90*(wheight/977))+"px"

     let maxPitch = (385*(wheight/977))
     let minPitch = (145*(wheight/977))

     let maxFadePitch = maxPitch-25
     let minFadePitch = minPitch+25
     for (let j = 0; j<2;j++) {
         for (let i = 35; i>=0;i--) {
             let y = elements["degrees10-"+i+"-"+j+"p"].getBoundingClientRect().y
             if (y>maxPitch || y<minPitch) {
                 elements["degrees10-"+i+"-"+j+"p"].style.opacity = 0
             } else {
                 if (y>maxFadePitch) {
                     elements["degrees10-"+i+"-"+j+"p"].style.opacity = (maxPitch-y)/25
                 } else if (y<minFadePitch) {
                     elements["degrees10-"+i+"-"+j+"p"].style.opacity = (y-minPitch)/25
                 } else {
                     elements["degrees10-"+i+"-"+j+"p"].style.opacity = 1
                 }
             }


         }
     }
     elements.hudPitch.style.transform =  "translate(0,"+(((playerShip.position.pitch.direction-180)*2.5)-795)+"px)"

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
     elements.hudYaw.innerHTML = ""
     elements.hudYawCenter.innerHTML = ""
     elements.hudPitch.innerHTML = ""
     elements.hudPitchCenter.innerHTML = ""
     elements.hudRCS.innerHTML = ""
     elements.navControl.style.opacity= 0
 }
}


let rcsControlHidden = false
let hideRcsControl = function() {
    if (!rcsControlHidden) {
        rcsControlHidden = true
        elements.rcsControl.style.transform = "translate(0,-150px)"
    } else {
        rcsControlHidden = false
        elements.rcsControl.style.transform = "translate(0,0)"
    }
}