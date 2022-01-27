class Computer extends Part {
    on = 1
    mode = 0 //0 = 0%  1 = 100% usage
    memorySize = 4
    time = 0
    tab = "main"
    data = {engineThrust:0, engineThrottle:0, engineThrustString: "0N", shipDirection: 0,shipDirectionPitch:0, inputSpeed:0, targetSpeed:0, speed:0, cooling:0, heating:0, antennaRX:0, antennaTX:0, fuelConsumptionAvg:0, fuelRange:0,
        lastPing:0, lastPingServerName:"", rcsRThrust:0, rcsLThrust:0, rcsUThrust:0, rcsDThrust:0, }

    //network
    listeningPort = [0]
    receivedData = new Array(65536).fill([])

    //display
    mapScaling = 60 //px per ly
    gridEnabled = true
    starSystems = []
    nav2PlanetView = ""

    //autopilot
    target = ""
    targetObj = {}
    autopilot = 0


    run() {
        if(this.on===1) {
            if (playerShip.usePower(this.consumption[0] / gameFPS, this.group)) { //todo:fix power consumption
                for (let i = 0; i < this.modules.length; i++) {
                    if (this.modules[i].on === 1) {
                        if (playerShip.usePower(this.modules[i].consumption / gameFPS, this.group)) {
                            this.modules[i].run()
                        }
                    }
                }
                this.drawUi()
                this.time += 1000 / gameFPS

            //network
                if (this.listeningPort.length>0) {
                    for (let i = 0; i<this.listeningPort.length; i++) {
                        if (this.receivedData[this.listeningPort[i]]!==undefined && this.receivedData[this.listeningPort[i]].length>0) {
                            for (let j = 0; j<this.receivedData[this.listeningPort[i]].length; j++) {
                                let data = this.receivedData[this.listeningPort[i]][0]
                                if (data.data.type==="var") {
                                    //time
                                    if (data.data.var==="time") {
                                        this.time = data.data.time
                                    } else if (data.data.var==="ping") {
                                        this.data.lastPing = data.data.ping
                                    } else if (data.data.var==="pingServerName") {
                                        this.data.lastPingServerName = data.data.name
                                    }
                                    //....
                                }
                                if (this.listeningPort[i]!==0) {
                                    this.receivedData[this.listeningPort[i]].shift()
                                }
                            }
                        }
                    }
                }
                this.data.antennaRX = playerShip.antennas[0].rx[0]
                this.data.antennaTX = playerShip.antennas[0].tx[0]
                //-----
        //OFF
            } else {
                this.on = 0
            }

        } else {
            if (this.display) {
                this.display.reset()
            }
        }
    }

    functions = {
        receiveTime: ()=> {
            this.comm.transmitData([0.002, this.comm.servers.time[0], 2, {data:"time", senderAddress:playerShip.myAddress}, playerShip.myAddress])
            this.listeningPort.push(2)
        },

    }


    getTimeString(time) {
        time = time/1000
        if (time>31536000) {
            return (time/31536000).toFixed(1)+"y"
        } else if (time>86400) {
            return (time/86400).toFixed(1)+"d"
        } else if (time>3600) {
            return (time/3600).toFixed(1)+"h"
        } else if (time>=60) {
            return (time/60).toFixed(1)+"m"
        } else {
            return time.toFixed(1)+"s"
        }
    }

    drawUi() {
        if (this.display && this.display.on===1) {
            let width = this.display.resolution.w
            let height = this.display.resolution.h

            //main
            let color1 = "#d7d7d7"
            let font1 = "16px Consolas"
            let fontBtn = "24px Consolas"
            let colorBtnText = "#424242"
            //current Tab
            let color2 = "#7e97d7"
            let font2 = "18px Consolas"
            //fps,time
            let color3 = "#d7d7d7"
            let font3 = "12px Consolas"
            //vals
            let color4 = "#7aff82"
            let colorTT = "#80d9ff"
            let color5 = "#b8a8ff"
            let colorSpeed = "#ffb9c5"
            let colorHeat = "#ffa5a0"
            let colorCold = "#a2fffc"
            //ship
            let colorShip = "#3b57da"
            //error
            let colorError = "#da4f57"


            if (this.tab==="main") {
                //--------------------------------------------------------------------------------------------------------------------------Main Tab
                //thrust and throttle
                this.display.drawText(5, 20, "Thrust: ", font1, color1, 'left')
                this.display.drawText(90, 20, this.data.engineThrustString, font1, colorTT, 'left')
                this.display.drawText(5, 40, "Throttle: ", font1, color1, 'left')
                this.display.drawText(90, 40, (this.data.engineThrottle*100).toFixed(1) + "%", font1, colorTT, 'left')
                //Fuel Consumption Tab
                if (this.fuelCons.on===1) {
                    this.display.drawText(5,60,"Fuel Consumption: ",font1,color1,'left')
                    if (this.fuelCons.fuelConsumptionAvg<1000) {
                        this.display.drawText(160,60,this.data.fuelConsumptionAvg.toFixed(1)+"g/h",font1,color4,'left')
                    } else {
                        this.display.drawText(160,60,(this.data.fuelConsumptionAvg/1000).toFixed(1)+"kg/h",font1,color4,'left')
                    }
                    this.display.drawText(5,80,"Range: ",font1,color1,'left')
                    this.display.drawText(160,80,this.data.fuelRange.toFixed(1)+"ly",font1,color4,'left')
                } else {
                    this.display.drawText(5,60,"Off",font1,colorError,'left')
                }
                //Direction Tab
                this.display.drawText(5, 100, "Direction: ", font1, color1, 'left')
                this.display.drawText(100, 100, this.data.shipDirection.toFixed(1)+"° | "+this.data.shipDirectionPitch.toFixed(1)+"°", font1, color5, 'left')
                //Speed Tab
                this.display.drawText(5, 120, "Speed: ", font1, color1, 'left')
                this.display.drawText(130, 120, getSpeedText(this.data.speed), font1, colorSpeed, 'left')
                this.display.drawText(5, 140, "Target Speed: ", font1, color1, 'left')
                this.display.drawText(130, 140, getSpeedText(this.data.targetSpeed), font1, colorSpeed, 'left')
                this.display.drawText(5, 160, "Input Speed: ", font1, color1, 'left')
                this.display.drawText(130, 160, getSpeedText(this.data.inputSpeed), font1, colorSpeed, 'left')

                this.display.drawText(5, 180, "Heating: ", font1, color1, 'left')
                this.display.drawText(80, 180, this.data.heating.toFixed(1)+"% ("+((this.data.heating/100)*playerShip.lifeSupport[1].heatConsumption*1000).toFixed(1)+"kW)", font1, colorHeat, 'left')
                this.display.drawText(5, 200, "Cooling: ", font1, color1, 'left')
                this.display.drawText(80, 200, this.data.cooling.toFixed(1)+"% ("+((this.data.cooling/100)*playerShip.lifeSupport[1].coldConsumption*1000).toFixed(1)+"kW)", font1, colorCold, 'left')

                this.display.drawRect(250,250,50,50,"#77f2ff") //UPDATE TIME
                this.display.drawRect(350,250,50,50,"#77f2ff") //UPDATE POSITION

                this.display.drawText(10, 220, "RX:"+(this.data.antennaRX*1000).toFixed(0)+"kB/s", font1, color1, 'left')
                this.display.drawText(10, 240, "TX:"+(this.data.antennaTX*1000).toFixed(0)+"kB/s", font1, color1, 'left')
                this.display.drawText(10, 260, "Ping:"+(this.data.lastPing).toFixed(0)+"ms ("+this.data.lastPingServerName+")", font1, color1, 'left')

            } else if (this.tab==="2") {
                //------------------------------------------------------------------------

                this.display.drawRect(100,100,50,50,"#00ff00") //test

            } else if (this.tab==="nav") {
                //--------------------------------------------------------------------------------------------------------------------Navigation Tab
                if (this.nav.on===1) {
                    //map
                    this.drawMap()
                    //ship
                    this.display.drawCircle(300, 180, 8, colorShip)
                    this.display.drawPlayerShipDirection(0,0,6,3,"#2beeff",this.data.shipDirection)
                    //x,y,distance
                    this.display.drawText(5, 20, "x: ", font1, color1, 'left')
                    this.display.drawText(25, 20, this.nav.position.x.toFixed(2) + "ly", font1, color5, 'left')
                    this.display.drawText(5, 40, "y: ", font1, color1, 'left')
                    this.display.drawText(25, 40, this.nav.position.y.toFixed(2) + "ly", font1, color5, 'left')
                    this.display.drawText(5, 60, "z: ", font1, color1, 'left')
                    this.display.drawText(25, 60, this.nav.position.z.toFixed(2) + "ly", font1, color5, 'left')
                    this.display.drawText(5, 340, "d: ", font1, color1, 'left')
                    this.display.drawText(25, 340, this.nav.distanceTraveled.toFixed(1) + "ly", font1, color5, 'left')
                    this.display.drawText(5, 80, "grid: ", font1, color1, 'left')
                    if (this.gridEnabled) {
                        this.display.drawText(55, 80, "on", font1, color4, 'left')
                    } else {
                        this.display.drawText(55, 80, "off", font1, colorBtnText, 'left')
                    }

                    //map zoom
                    this.display.drawText(10, 170, "↑", font1, color1, 'left')
                    this.display.drawText(5, 185, this.mapScaling, font1, color1, 'left')
                    this.display.drawText(10, 200, "↓", font1, color1, 'left')

                } else {
                        this.display.drawText(5,20,"Off",font1,colorError,'left')
                }
            } else if (this.tab==="nav2") { //---------------------------------------------------------------------------------------Star System View
                let ss = starSystems[this.nav2PlanetView]
                this.drawSystem(ss)

                this.display.drawText(5, 20, "System: ", font1, color1, 'left')
                this.display.drawText(75, 20, ss.name, font1, color5, 'left')

                let a = ss.position.x - this.nav.position.x //x1 - x2
                let b = ss.position.y -this.nav.position.y //y1 - y2
                let c = ss.position.z -this.nav.position.z //z1 - z2
                let d = Math.sqrt( a*a + b*b )


                this.display.drawText(5, 40, "Distance: ", font1, color1, 'left')
                this.display.drawText(85, 40, d.toFixed(2)+"ly", font1, color5, 'left')

                this.display.drawText(5, 60, "Faction: ", font1, color1, 'left')
                this.display.drawText(85, 60, ss.faction+" ("+factionList[ss.faction].playerRelations+")", font1, ss.factionColor, 'left')
                this.display.drawText(5, 80, "Population: ", font1, color1, 'left')
                this.display.drawText(105, 80, (ss.totalPopulation/1000000).toFixed(0)+"M", font1, color5, 'left')

                this.display.drawText(5, 100, "Planets: ", font1, color1, 'left')
                this.display.drawText(85, 100, ss.planets.length, font1, color5, 'left')

                this.display.drawText(5, 120, "Trade: ", font1, color1, 'left')
                let ii = 0
                Object.keys(ss.prices).forEach((key)=> {
                    let prices = key+": "+ss.prices[key]
                    this.display.drawText(65, 120+(ii*15), prices, font1, color5, 'left')
                    ii++
                })

                this.display.drawRect(15,325,70,20,"#494949") //test
                this.display.drawText(50, 340, "Target", font1, color1, 'center')
                this.display.drawRect(100,325,100,20,"#494949") //test
                this.display.drawText(150, 340, "Autopilot", font1, color1, 'center')
            }


            //-----------------------------------------------------------------------------------------------------------------bottom
            this.display.drawRect(0,height-40,width,height,"#000000") //test
            this.display.drawLine(0,height-40,width,height-40,2,color1)
            this.display.drawText(50,height-15,"Main",font1,color1,'center')
            this.display.drawLine(100,height-40,100,height,2,color1)
            this.display.drawText(125,height-15,"Nav",font1,color1,'center')
            this.display.drawLine(150,height-40,150,height,2,color1)
            this.display.drawText(175,height-15,"Comm",font1,color1,'center')
            this.display.drawLine(200,height-40,200,height,2,color1)
            this.display.drawText(250,height-15,"2",font1,color1,'center')

            this.display.drawLine(300,height-40,300,height,2,color1)
            this.display.drawText(350,height-15,"1",font1,color1,'center')
            this.display.drawLine(400,height-40,400,height,2,color1)
            this.display.drawText(450,height-15,this.tab,font2,color2,'center')
            this.display.drawLine(500,height-40,500,height,2,color1)
            this.display.drawText(550,height-10,"Time:"+this.getTimeString(this.time),font3,color3,'center')
            this.display.drawText(550,height-25,"Fps:"+(gameFPS*speedInc).toFixed(0)+"FPS",font3,color3,'center')

        }
    }

    drawSystem(ss) {
        let maxOrbit = 0
        for (let i = 0; i<ss.planets.length; i++) {
            if (ss.planets[i].orbitHeight>maxOrbit) {
                maxOrbit = ss.planets[i].orbitHeight
            }
        }
        let orbitScaling = maxOrbit/335

        //star
        let starSize = ss.stars[0].radius/100000 // /100000
        this.display.drawCircle(400,350,starSize,"#FFFF00")

        let leftRight = 0
        //planets
        for (let i = 0; i<ss.planets.length; i++) {
            let orbitH = (ss.planets[i].orbitHeight/orbitScaling)+starSize //5000000
            let size = ss.planets[i].radius/20000 //2000
            this.display.drawCircleStroke(400,350,orbitH,"#989898")
            this.display.drawCircle(400,350-(orbitH),size,"#FFFFFF")
            if (leftRight){
                leftRight = 0
                this.display.drawText(425,353-(orbitH),ss.planets[i].name,"12px Consolas","#FFF","left")
            } else {
                leftRight = 1
                this.display.drawText(375,353-(orbitH),ss.planets[i].name,"12px Consolas","#FFF","right")
            }

        }
    }

    drawMap() {
        //--------------------------------------------------------------------------------------------------------------------------map
        let colorMap = "#a1a1a1"
        let colorMapText = "#b4b169"
        let colorSystemText = "#ffffff"
        let font = "12px Consolas"
        let bottom = 40 //px

        let pos = {x: playerShip.computers[0].nav.position.x % 1, y: playerShip.computers[0].nav.position.y % 1}
        let posR = {x: playerShip.computers[0].nav.position.x, y: playerShip.computers[0].nav.position.y}

        let drawLineGrid = (x1,x2,y1,y2) => {
            let xx1 = (posR.x*this.mapScaling)+((this.display.resolution.w)/2)-(x1*this.mapScaling)
            let xx2 = (posR.x*this.mapScaling)+((this.display.resolution.w)/2)-(x2*this.mapScaling)
            let yy1 = (posR.y*this.mapScaling)+((this.display.resolution.h-bottom)/2)-(y1*this.mapScaling)
            let yy2 = (posR.y*this.mapScaling)+((this.display.resolution.h-bottom)/2)-(y2*this.mapScaling)
            this.display.drawLine(xx1,yy1,xx2,yy2,1,colorMap)
        }

        //--------------------------------------------GRID--------------------------------------------
        //1Line = 1 LightYear
        let gridLy = 1
        if (this.mapScaling<21) {
            gridLy = 10
        }
        if (this.mapScaling>2 && this.gridEnabled) {
            let vLines = Math.ceil((this.display.resolution.w / this.mapScaling) * 1.5)
            if (vLines % 2 !== 0) {vLines++} //odd->even
            let hLines = Math.ceil((this.display.resolution.h / this.mapScaling) * 1.5)
            if (hLines % 2 !== 0) {hLines++} //odd->even

            for (let i = 0; i < vLines; i+=gridLy) {
                let px = Math.floor(posR.x)
                let py = Math.floor(posR.y)
                let x1 = i + px - ((vLines / 2))
                let x2 = i + px - ((vLines / 2))
                let y1 = py - (hLines / 2)
                let y2 = py + (hLines / 2)
                drawLineGrid(x1, x2, y1, y2)
                let txtX = (posR.x * this.mapScaling) + ((this.display.resolution.w) / 2) - (x1 * this.mapScaling)
                this.display.drawText(txtX, this.display.resolution.h - bottom - 5, x1, font, colorMapText, 'center')
            }

            for (let i = 0; i < hLines; i+=gridLy) {
                let px = Math.floor(posR.x)
                let py = Math.floor(posR.y)
                let x1 = px - (vLines / 2)
                let x2 = px + (vLines / 2)
                let y1 = i + py - (hLines / 2)
                let y2 = i + py - (hLines / 2)
                drawLineGrid(x1, x2, y1, y2)
                let txtY = (posR.y * this.mapScaling) + ((this.display.resolution.h - bottom) / 2) - (y1 * this.mapScaling)
                this.display.drawText(599, txtY, y1, font, colorMapText, 'right')
            }
        }
        //------------------------------------------------------------------------------------------
        let scaling = this.mapScaling/60
        let varX = (posR.x*this.mapScaling)+((this.display.resolution.w)/2)
        let varY = (posR.y*this.mapScaling)+((this.display.resolution.h-bottom)/2)
        let drawPlanet = (xx,yy,colorP,size,name,id) => {
            let x = varX-(xx*this.mapScaling)
            let y = varY-(yy*this.mapScaling)
            let sizeMap = (size*scaling)
            if (xx>-300-this.mapScaling && xx<(this.display.resolution.w+this.mapScaling) && yy>-180-this.mapScaling && yy<((this.display.resolution.h-bottom)+this.mapScaling)) {
                this.display.drawCircle(x,y,sizeMap,colorP)
                //text
                if (this.mapScaling>20) {
                    this.display.drawText(x,y+sizeMap,name,font,colorSystemText,"center")
                }
               this.starSystems.push({x1:x-sizeMap, y1:y-sizeMap,x2:x+sizeMap,y2:y+sizeMap,function: () => {this.tab = "nav2";this.nav2PlanetView=id;this.starSystems = []}})
            }
        }

        for (let i = 0; i<starSystems.length; i++) {
            let ss = starSystems[i]
            drawPlanet(ss.position.x,ss.position.y,ss.factionColor,ss.mapSize,ss.name,i)
        }
    }

    touchScreen(x,y) {
        let buttons = [
            {x1:0, y1:360,x2:100,y2:400,function: () => {this.tab = "main";this.starSystems = []}},
            {x1:100, y1:360,x2:150,y2:400,function: () => {this.tab = "nav";this.starSystems = []}},
            {x1:150, y1:360,x2:200,y2:400,function: () => {this.tab = "comm";this.starSystems = []}},

            {x1:0, y1:150,x2:30,y2:175,function: () => {if (this.tab==="nav") {this.incMapScaling()}}},
            {x1:0, y1:175,x2:30,y2:200,function: () => {if (this.tab==="nav") {this.decMapScaling()}}},
            {x1:40, y1:70,x2:80,y2:90,function: () => {if (this.tab==="nav") {this.gridEnabled = 1 - this.gridEnabled}}},
            //target
            {x1:15, y1:325,x2:85,y2:345,function: () => {if (this.tab==="nav2") {this.target=starSystems[this.nav2PlanetView].name;this.targetObj=starSystems[this.nav2PlanetView]}}},
            //autopilot
            {x1:100, y1:325,x2:200,y2:345,function: () => {if (this.tab==="nav2") {this.autopilot = 1 - this.autopilot;this.target=starSystems[this.nav2PlanetView].name;this.targetObj=starSystems[this.nav2PlanetView] }}},

            {x1:250, y1:250,x2:300,y2:300,function: () => {if (this.tab==="main") {this.functions.receiveTime()}}},
            {x1:350, y1:250,x2:400,y2:300,function: () => {if (this.tab==="main") {this.nav.start.recalcPosition()}}},
        ]
        for (let i = 0; i<buttons.length; i++) {
            let b = buttons[i]
            if (x>b.x1 && x<b.x2 && y>b.y1 && y<b.y2) {
                b.function()
                break
            }
        }
        for (let i = 0; i<this.starSystems.length; i++) {
            let b = this.starSystems[i]
            if (x>b.x1 && x<b.x2 && y>b.y1 && y<b.y2) {
                b.function()
                break
            }
        }
    }


    mouseOverScreen(x,y) {
        let elements = [
        ]

        for (let i = 0; i<elements.length; i++) {
            let b = elements[i]
            if (x>b.x1 && x<b.x2 && y>b.y1 && y<b.y2) {
                b.function()
                break
            }
        }

    }

    resetTarget() {
        this.target = ''
        this.targetObj = {}
    }

    incMapScaling() {
        if (this.mapScaling<10) {
            this.mapScaling+=1
        } else if (this.mapScaling<100) {
            this.mapScaling+=10
        } else if (this.mapScaling<1000) {
            this.mapScaling+=100
        } else {
            this.mapScaling+=1000
        }

    }

    decMapScaling() {
        if (this.mapScaling>1000) {
            this.mapScaling-=1000
        } else if (this.mapScaling>100) {
            this.mapScaling-=100
        } else if (this.mapScaling>10) {
            this.mapScaling-=10
        } else if(this.mapScaling>1) {
            this.mapScaling-=1
        }
    }


    constructor(id,weight,name,modules,consumption,memorySize) {
        super(weight,name,"computer",id)
        this.consumption = consumption

        this.comm = new CommunicationModule()
        this.fuelCons = new FuelConsumptionModule()
        this.display = new DisplayModule()
        this.nav = new NavigationModule()

        this.modules = [this.comm,this.fuelCons,this.display,this.nav]

        this.memorySize = memorySize
    }
}