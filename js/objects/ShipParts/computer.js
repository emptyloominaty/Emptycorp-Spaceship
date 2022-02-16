class Computer extends Part {
    on = 1
    mode = 0 //0 = 0%  1 = 100% usage
    memorySize = 4
    time = 0
    tab = "main"
    data = {engineThrust:0, engineThrottle:0, engineThrustString: "0N", shipDirection: 0,shipDirectionPitch:0, inputSpeed:0, targetSpeed:0, speed:0, cooling:0, heating:0, antennaRX:0, antennaTX:0, fuelConsumptionAvg:0, fuelRange:0,
        lastPing:0, lastPingServerName:"", rcsRThrust:0, rcsLThrust:0, rcsUThrust:0, rcsDThrust:0, priceData:{"Downloading Data...":""}, startId: 0, startIdPlanets:0, aiShipsScanned:[], aiShipsLongScanned:[],
        shipPings:[], systemPings:[], distanceToSystems: []}

    //network
    listeningPort = [0]
    receivedData = []

    //display
    mapScaling = 60 //px per ly
    gridEnabled = false
    starSystems = []
    nav2PlanetView = ""

    //input
    listenForInput = false
    keyInput = ""
    inputData = {
        jumpDrive:{
            x:"",
            y:"",
            z:"",
            select:""
        },
        lifeSupport:{
            pressure:"1.0",
            temperature:"21",
            select:""
        }

    }

    modulesButtons = []
    powerConsumptionArray = new Array(500).fill(0)

    //autopilot
    target = ""
    targetType = ""
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

                this.functions.getNearestSystems() //TODO: PERFORMANCE?????? YIKES

                //power
                this.powerConsumptionArray.push(playerShip.powerOutput3)
                playerShip.powerOutput3 = 0
                if (this.powerConsumptionArray.length > 500) {
                    this.powerConsumptionArray.shift()
                }


                //network
                if (this.listeningPort.length>0) {
                    for (let i = 0; i<this.listeningPort.length; i++) {
                        if (this.receivedData[this.listeningPort[i]]!==undefined && this.receivedData[this.listeningPort[i]].length>0) {
                            for (let j = 0; j<this.receivedData[this.listeningPort[i]].length; j++) {
                                let data = this.receivedData[this.listeningPort[i]][0]
                                if (data.data.type==="var") {
                                    //time
                                    if (data.data.var==="time") {                   //port:2
                                        this.time = data.data.time
                                    } else if (data.data.var==="ping") {            //port:0
                                        this.data.lastPing = data.data.ping
                                        this.data.lastPingServerName = data.data.name
                                    } else if (data.data.var==="tradeData") {       //port:3
                                        this.data.priceData = {...data.data.trade}
                                    }
                                    //....
                                } else if (data.data.type==="shipPing") {
                                    let address = data.data.address
                                    let name = data.data.name
                                    this.data.shipPings[address].ping = data.data.latency
                                    this.data.shipPings[address].name = name
                                    this.data.shipPings[address].started = false
                                } else if (data.data.type==="systemPing") {
                                    let address = data.data.address
                                    let name = data.data.name
                                    this.data.systemPings[address].ping = data.data.latency
                                    this.data.systemPings[address].name = name
                                    this.data.systemPings[address].started = false
                                }
                                if (this.listeningPort[i]!==0) {
                                    this.receivedData[this.listeningPort[i]].shift()
                                }
                            }
                            this.receivedData[this.listeningPort[i]]=[]
                        }
                    }
                }
                this.data.antennaRX = playerShip.antennas[0].realrx
                this.data.antennaTX = playerShip.antennas[0].realtx
                //-----
                playerShip.target = this.targetObj
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
        findTimeServer: ()=> {
            let distanceToSystems = this.data.distanceToSystems
            for (let i = 0; i<distanceToSystems.length; i++) {
                if (starSystems[distanceToSystems[i].id].timeServerAddress!==false) {
                   return starSystems[distanceToSystems[i].id].timeServerAddress
                }
            }
            return starSystems[0].servers[1].myAddress
        },
        receiveTime: ()=> {
            let timeServerAddress = this.functions.findTimeServer()
            this.comm.transmitData([0.002, timeServerAddress, 2, {data:"time", senderAddress:playerShip.myAddress}, playerShip.myAddress])
            this.listeningPort.push(2)
        },
        receivePriceData: (id)=> {
            if (id==="Abort") {
                this.data.priceData={"Cant download data ":"","from this system. ":""}
                return false
            }
            this.comm.transmitData([0.004, id, 3, {data:"trade", senderAddress:playerShip.myAddress}, playerShip.myAddress])
            this.listeningPort.push(3)
            this.data.priceData={"Downloading Data...":""}
        },
        getNearestSystems: () => {
            for (let i = 0; i<starSystems.length; i++) {
                this.data.distanceToSystems[i] = {id:i, distance:calcDistance2D(playerShip,starSystems[i])}
            }
            this.data.distanceToSystems = this.data.distanceToSystems.sort((a, b) => a.distance> b.distance ? 1 : -1)
        },
        findNearestEnemyTarget: ()=>{
            let distances = []

            for (let i = 0; i<aiShips.length;i++) {
                if (aiShipsNear[i]) {
                    let ship = aiShips[i]
                    let faction = ship.faction
                    if (factionList[faction].playerRelations<-50) {
                        distances.push({dist:calcDistance(playerShip,ship),id:i})
                    }
                }
            }

            if (distances.length>0) {
                distances = distances.sort((a, b) => a.dist> b.dist ? 1 : -1)
                this.targetObj = aiShips[distances[0].id]
                this.target = "Unidentified Ship"
                this.targetType = "ship"
                return true
            } else {
                for (let i = 0; i<aiShips.length;i++) {
                    if (aiShipsMid[i]) {
                        let ship = aiShips[i]
                        let faction = ship.faction
                        if (factionList[faction].playerRelations<-50) {
                            distances.push(calcDistance(playerShip,ship))
                        }
                    }
                }
            }

            if (distances.length>0) {
                distances = distances.sort((a, b) => a.dist> b.dist ? 1 : -1)
                this.targetObj = aiShips[distances[0].id]
                this.target = "Unidentified Ship"
                this.targetType = "ship"
                return true
            } else {
                return false
            }
        }
    }


    toggleAutopilot(forceAutopilot = 2) {
        if (forceAutopilot===2) {
            this.autopilot = 1 - this.autopilot
        } else {
            this.autopilot = forceAutopilot
        }

        if (this.autopilot===1) {
            flashmessage.add("Autopilot Activated","yellow")
        } else {
            playerShip.targetSpeed = 0
            flashmessage.add("Autopilot Deactivated","yellow")
        }
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
        //reset
        this.listenForInput = false

        if (this.display && this.display.on===1) {
            let width = this.display.resolution.w
            let height = this.display.resolution.h

            //main
            let color1 = "#d7d7d7"
            let font1 = "16px Consolas"
            let fontSmall = "14px Consolas"
            let fontBtn = "24px Consolas"
            let colorBtnText = "#424242"
            //current Tab
            let color2 = "#7e97d7"
            let font2 = "16px Consolas"
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
            let colorShip = "#4b0001"
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


                this.display.drawRect(440, 20, 140, 20, "#666666")
                this.display.drawText(510, 35, "Modules", font1, color1, 'center')
                this.display.drawRect(440, 45, 140, 20, "#666666")
                this.display.drawText(510, 60, "Get Time", font1, color1, 'center')
                this.display.drawRect(440, 70, 140, 20, "#666666")
                this.display.drawText(510, 85, "Recalc Position", font1, color1, 'center')
                this.display.drawRect(430, 95, 160, 20, "#666666")
                this.display.drawText(510, 110, "Power Consumption", font1, color1, 'center')
                this.display.drawRect(440, 120, 140, 20, "#666666")
                this.display.drawText(510, 135, "Jump Drive", font1, color1, 'center')

                this.display.drawText(10, 220, "RX:"+(this.data.antennaRX*1000).toFixed(0)+"kB/s", font1, color1, 'left')
                this.display.drawText(10, 240, "TX:"+(this.data.antennaTX*1000).toFixed(0)+"kB/s", font1, color1, 'left')
                this.display.drawText(10, 260, "Ping:"+(this.data.lastPing).toFixed(0)+"ms ("+this.data.lastPingServerName+")", font1, color1, 'left')

                /*this.display.drawText(5, 300, "AS yaw:"+playerShip.position.yaw.angularSpeed, font1, color1, 'left')
                this.display.drawText(5, 320, "AS pitch:"+playerShip.position.pitch.angularSpeed, font1, color1, 'left')
                this.display.drawText(5, 340, "Dir Yaw:"+playerShip.position.yaw.direction, font1, color1, 'left')
                this.display.drawText(300, 340, "Dir Pitch:"+playerShip.position.pitch.direction, font1, color1, 'left')*/

            } else if (this.tab==="comm") {//--------------------------------------------------------------------------------------------------------------------Comm
                let y = 20
                this.display.drawText(5, y, "Name", font1, color5, 'left')
                this.display.drawText(250, y, "Latency", font1, color5, 'left')
                y+=15
                this.display.drawLine(0,y,600,y,1,color5)
                y+=15
                let systems = 0
                for (let i = 0; i<this.data.distanceToSystems.length; i++) {
                    let id = this.data.distanceToSystems[i].id
                    if (starSystems[id].servers.length>0) {
                        y+=5
                        let system = starSystems[id]
                        let address = starSystems[id].servers[0].myAddress
                        if (this.data.systemPings[address]===undefined) {
                            this.data.systemPings[address] = {}
                        }
                        if (this.data.systemPings[address].started===undefined) {
                            this.data.systemPings[address].started = false
                        }

                        if (this.comm.refreshPings>this.comm.refreshEvery) {
                            if (!this.data.systemPings[address].started) {
                                this.data.systemPings[address].started = true
                                this.comm.transmitData([0.0002, address, 0, {data:"sendPing", senderAddress:playerShip.myAddress}, playerShip.myAddress])
                            }
                        }

                        if (this.data.systemPings[address].ping===undefined) {
                            this.data.systemPings[address].ping = 0
                        }

                        if (this.data.systemPings[address].ping===0) {continue}
                        this.display.drawText(5, y, system.name, font1, color1, 'left')
                        this.display.drawText(250, y, this.data.systemPings[address].ping.toFixed(0)+" ms", font1, color1, 'left')
                        y+=15
                        systems++
                        if (systems>2) {
                            break;
                        }
                    }
                }
                this.display.drawLine(0,y,600,y,1,color5)
                y+=20
                for (let i = 0; i<this.data.aiShipsScanned.length; i++) {
                    let address = aiShips[this.data.aiShipsScanned[i].id].server.myAddress
                    let ship = aiShips[this.data.aiShipsScanned[i].id]
                    if (this.data.shipPings[address]===undefined) {
                        this.data.shipPings[address] = {}
                    }
                    if (this.data.shipPings[address].started===undefined) {
                        this.data.shipPings[address].started = false
                    }

                    if (this.comm.refreshPings>this.comm.refreshEvery) {
                        if (!this.data.shipPings[address].started) {
                            this.data.shipPings[address].started = true
                            this.comm.transmitData([0.0002, address, 0, {data:"sendPing", senderAddress:playerShip.myAddress}, playerShip.myAddress])
                        }
                    }

                    if (this.data.shipPings[address].ping===undefined) {
                        this.data.shipPings[address].ping = 0
                    }

                    if (this.data.shipPings[address].ping===0) {continue}
                    this.display.drawText(5, y, ship.name, font1, color1, 'left')
                    this.display.drawText(250, y, this.data.shipPings[address].ping.toFixed(0)+" ms", font1, color1, 'left')

                    y+=20
                    if (y>340) {
                        break
                    }
                }
                if (this.comm.refreshPings>this.comm.refreshEvery) {
                    this.comm.refreshPings = 0
                }
                this.comm.refreshPings+=1/gameFPS




            } else if (this.tab==="nav") {//--------------------------------------------------------------------------------------------------------------------Navigation Tab

                if (this.nav.on===1) {
                    //map
                    this.drawMap()
                    //ship
                    this.display.drawCircle(300, 180, 8, colorShip)
                    this.display.drawPlayerShipDirection(0, 0, 6, 3, "#999f9a", this.data.shipDirection)
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

                    this.display.drawRect(580, 0, 20, 20, "#666666")
                    this.display.drawText(590, 15, "S", font1, color1, 'center')

                    this.display.drawRect(580, 20, 20, 20, "#666666")
                    this.display.drawText(590, 35, "P", font1, color1, 'center')
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
                let d = Math.sqrt( a*a + b*b + c*c )


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
                let iii = 0
                Object.keys(this.data.priceData).forEach((key)=> {
                    let prices = key+": "+this.data.priceData[key]
                    this.display.drawText(5+iii, 140+(ii*15), prices, font1, color5, 'left')
                    ii++
                    if (ii>11) {ii=0;iii=150}
                })

                this.display.drawRect(15,325,70,20,"#494949") //test
                this.display.drawText(50, 340, "Target", font1, color1, 'center')
                this.display.drawRect(100,325,100,20,"#494949") //test
                this.display.drawText(150, 340, "Autopilot", font1, color1, 'center')
            } else if (this.tab==="nav3") {//---------------------------------------------------------------------------------------Star Systems list
                //this.data.startId = 0
                let hColor = "#546db3"
                let y = 10
                this.display.drawText(10, 15, "ID", font1, hColor, 'left')
                this.display.drawText(55, 15, "Name", font1, hColor, 'left')
                this.display.drawText(135, 15, "Distance", font1, hColor, 'left')
                this.display.drawText(225, 15, "Faction", font1, hColor, 'left')
                this.display.drawLine(0,24,600,24,1,hColor)
                for (let i = this.data.startId; i<this.data.startId+9; i++) {
                    if (starSystems[i]!==undefined) {
                        y+=35
                        let dist = calcDistance(playerShip,starSystems[i])
                        this.display.drawText(5, y, "["+i+"] "+starSystems[i].name, font1, color1, 'left')
                        this.display.drawText(135, y, dist.toFixed(2)+"ly", font1, color1, 'left')
                        this.display.drawText(225, y, starSystems[i].faction, font1, color1, 'left')

                        this.display.drawRect(410,y-10,70,20,"#494949")
                        this.display.drawText(445,y+5, "Target", font1, color1, 'center')
                        this.display.drawRect(490,y-10,100,20,"#494949")
                        this.display.drawText(540,y+5, "Autopilot", font1, color1, 'center')
                    }
                }
            } else if (this.tab==="nav4") {//---------------------------------------------------------------------------------------Planet list
                let hColor = "#546db3"
                let y = 10
                this.display.drawText(5, 15, "Name", font1, hColor, 'left')
                this.display.drawText(120, 15, "System", font1, hColor, 'left')
                this.display.drawText(215, 15, "Population", font1, hColor, 'left')
                this.display.drawText(310, 15, "Faction", font1, hColor, 'left')
                this.display.drawLine(0,24,600,24,1,hColor)
                for (let i = this.data.startIdPlanets; i<this.data.startIdPlanets+9; i++) {
                    if (planets[i]!==undefined) {
                        y+=35
                        this.display.drawText(5, y, planets[i].name, font1, color1, 'left')
                        this.display.drawText(120, y, planets[i].system, font1, color1, 'left')
                        this.display.drawText(215, y, planets[i].population/1000000+"M", font1, color1, 'left')
                        this.display.drawText(310, y, planets[i].faction, font1, color1, 'left')

                        this.display.drawRect(410,y-10,70,20,"#494949")
                        this.display.drawText(445,y+5, "Target", font1, color1, 'center')
                        this.display.drawRect(490,y-10,100,20,"#494949")
                        this.display.drawText(540,y+5, "Autopilot", font1, color1, 'center')
                    }
                }
            } else if (this.tab==="lifeSupport") {
                //Temperature
                this.display.drawText(18, 190, "Temperature: ", font1, color1, 'left')
                this.display.drawText(125, 190, (playerShip.atmosphere.temperature-273.15).toFixed(1)+"°C ", font1, colorCold, 'left')

                this.display.drawText(18, 210, "Heating: ", font1, color1, 'left')
                this.display.drawText(90, 210, this.data.heating.toFixed(1)+"% ("+((this.data.heating/100)*playerShip.lifeSupport[1].heatConsumption*1000).toFixed(1)+"kW)", font1, colorHeat, 'left')
                this.display.drawText(18, 230, "Cooling: ", font1, color1, 'left')
                this.display.drawText(90, 230, this.data.cooling.toFixed(1)+"% ("+((this.data.cooling/100)*playerShip.lifeSupport[1].coldConsumption*1000).toFixed(1)+"kW)", font1, colorCold, 'left')

                this.display.drawText(10, 160, "Temperature ", font1, color5, 'left')
                this.display.drawRectStroke(10,170,230,70,color5,1)

                //Atmosphere
                this.display.drawText(10, 15, "Atmosphere ", font1, color5, 'left')
                this.display.drawText(18, 45, "Pressure: ", font1, color1, 'left')
                this.display.drawText(120, 45, (playerShip.atmosphere.pressure).toFixed(2)+"bar ", font1, color5, 'left')
                this.display.drawText(18, 65, "Composition: ", font1, color1, 'left')

                this.display.drawRectStroke(10,25,230,110,color5,1)

                let colorGood = "#00FF00"
                let colorOk = "#d6ff00"
                let colorBad = "#ffd500"
                let colorVeryBad = "#ff6100"
                let colorCritical = "#ff1c00"

                let colorOxygen = colorOk
                let oxygen = playerShip.atmosphere.oxygen
                if (oxygen>19) {
                    colorOxygen = colorGood
                } else if (oxygen<15) {
                    colorOxygen = colorBad
                } else if (oxygen<12) {
                    colorOxygen = colorVeryBad
                } else if (oxygen<10) {
                    colorOxygen = colorCritical
                }

                let colorCarbonDioxide = colorOk
                let carbonDioxide = playerShip.atmosphere.carbonDioxide
                if (carbonDioxide<0.04) {
                    colorCarbonDioxide = colorGood
                } else if (carbonDioxide > 0.08) {
                    colorCarbonDioxide = colorBad
                } else if (carbonDioxide > 0.1) {
                    colorCarbonDioxide = colorVeryBad
                } else if (carbonDioxide > 5) {
                    colorCarbonDioxide = colorCritical
                }

                this.display.drawText(80, 85, "N2: ", font1, color1, 'left')
                this.display.drawText(130, 85, (playerShip.atmosphere.nitrogen).toFixed(2)+" %", font1, color5, 'left')
                this.display.drawText(80, 105, "O2: ", font1, color1, 'left')
                this.display.drawText(130, 105, (oxygen).toFixed(2)+" %", font1, colorOxygen, 'left')
                this.display.drawText(80, 125, "CO2: ", font1, color1, 'left')
                this.display.drawText(130, 125, (carbonDioxide).toFixed(2)+" %", font1, colorCarbonDioxide, 'left')


                let keyPressed = this.keyInput
                let selected = this.inputData.lifeSupport.select
                if (selected!=="") {
                    this.listenForInput = true
                    if (keyPressed==="Backspace") {
                        if (this.inputData.lifeSupport[selected].length>0) {
                            this.inputData.lifeSupport[selected] = this.inputData.lifeSupport[selected].substring(0, this.inputData.lifeSupport[selected].length - 1)
                        }
                    } else if (isFinite(keyPressed)) {
                        this.inputData.lifeSupport[selected] += ""+keyPressed
                    } else if (keyPressed==="," || keyPressed===".") {
                        this.inputData.lifeSupport[selected] += "."
                    }
                }
                this.inputData.lifeSupport.pressure = this.inputData.lifeSupport.pressure.substring(0, 4)
                this.inputData.lifeSupport.temperature = this.inputData.lifeSupport.temperature.substring(0, 4)

                if (Number(this.inputData.lifeSupport.pressure)>2) {
                    this.inputData.lifeSupport.pressure = "2.0"
                }
                if (Number(this.inputData.lifeSupport.temperature)>40) {
                    this.inputData.lifeSupport.pressure = "40"
                } else if (Number(this.inputData.lifeSupport.temperature)<0) {
                    this.inputData.lifeSupport.pressure = "0"
                }

                //Set
                let atmColor = "#ab3b32"
                if (playerShip.lifeSupport[0].on===1) {
                    atmColor = "#468b46"
                }

                this.display.drawRect(300,10,180,20,atmColor)
                this.display.drawText(390,25, "Atmosphere Control", font1, color1, 'center')

                this.display.drawText(300,57, "Set Pressure: ", font1, color1, 'left')
                this.display.drawText(500,57, this.inputData.lifeSupport.pressure+" bar", font1, color1, 'center')
                this.display.drawRectStroke(450,40,100,25,color1)

                let tempColor = "#ab3b32"
                if (playerShip.lifeSupport[1].on===1) {
                    tempColor = "#468b46"
                }

                this.display.drawRect(300,150,180,20,tempColor)
                this.display.drawText(390,165, "Temperature Control", font1, color1, 'center')

                this.display.drawText(300,197, "Set Temperature: ", font1, color1, 'left')
                this.display.drawText(500,197, this.inputData.lifeSupport.temperature+" °C", font1, color1, 'center')
                this.display.drawRectStroke(450,180,100,25,color1)


                this.display.drawText(500,327, "Set", font1, "#00b600", 'center')
                this.display.drawRectStroke(450,310,100,25,"#00b600")

                //reset keyInput
                this.keyInput = ""
            } else if (this.tab==="modules") {//---------------------------------------------------------------------------------------Modules
                this.modulesButtons = []
                let y = 15
                //this.comm,this.fuelCons,this.display,this.nav,this.scanner
                let fontBig = "20px Consolas"

                //----Comm
                this.display.drawText(5, y, "Comm ", fontBig, color1, 'left') //[0]
                y+=20
                let commColor = "#ab3b32"
                if (this.comm.on) {
                    commColor = "#468b46"
                }
                this.modulesButtons.push({x1:5, y1:y-10,x2:125,y2:y+20,function: () => {if (this.tab==="modules") {this.comm.on = 1 - this.comm.on}}})
                this.display.drawRect(5,y-10,120,20,commColor)
                this.display.drawText(65,y+5, "Communication", font1, color1, 'center')
                y+=30

                y+=30
                //----Fuel Consumption
                this.display.drawLine(0,y-20,600,y-20,1,"#555555")
                this.display.drawText(5, y, "Fuel Consumption ", fontBig, color1, 'left') //[1]
                y+=20
                let fuelConsColor = "#ab3b32"
                if (this.fuelCons.on) {
                    fuelConsColor = "#468b46"
                }
                this.modulesButtons.push({x1:5, y1:y-10,x2:155,y2:y+20,function: () => {if (this.tab==="modules") {this.fuelCons.on = 1 - this.fuelCons.on}}})
                this.display.drawRect(5,y-10,150,20,fuelConsColor)
                this.display.drawText(80,y+5, "Fuel Consumption", font1, color1, 'center')
                let fuelConsPreciseColor = "#ab3b32"
                if (this.fuelCons.partsActivated.preciseConsumption===1) {
                    fuelConsPreciseColor = "#468b46"
                }
                this.modulesButtons.push({x1:165, y1:y-10,x2:245,y2:y+20,function: () => {if (this.tab==="modules") {this.fuelCons.partsActivated.preciseConsumption = 1 - this.fuelCons.partsActivated.preciseConsumption}}})
                this.display.drawRect(165,y-10,80,20,fuelConsPreciseColor)
                this.display.drawText(205,y+5, "Precise", font1, color1, 'center')
                let fuelConsRangeColor = "#ab3b32"
                if (this.fuelCons.partsActivated.calcRange===1) {
                    fuelConsRangeColor = "#468b46"
                }
                this.modulesButtons.push({x1:255, y1:y-10,x2:325,y2:y+20,function: () => {if (this.tab==="modules") {this.fuelCons.partsActivated.calcRange = 1 - this.fuelCons.partsActivated.calcRange}}})
                this.display.drawRect(255,y-10,70,20,fuelConsRangeColor)
                this.display.drawText(290,y+5, "Range", font1, color1, 'center')
                y+=30

                y+=30
                //----Nav
                this.display.drawLine(0,y-20,600,y-20,1,"#555555")
                this.display.drawText(5, y, "Nav ", fontBig, color1, 'left') //[3]
                y+=20
                let navColor = "#ab3b32"
                if (this.nav.on) {
                    navColor = "#468b46"
                }
                this.modulesButtons.push({x1:5, y1:y-10,x2:50,y2:y+20,function: () => {if (this.tab==="modules") {this.nav.on = 1 - this.nav.on}}})
                this.display.drawRect(5,y-10,45,20,navColor)
                this.display.drawText(25,y+5, "Nav", font1, color1, 'center')
                y+=30

                y+=30
                //----Scanner
                this.display.drawLine(0,y-20,600,y-20,1,"#555555")
                this.display.drawText(5, y, "Scanner ", fontBig, color1, 'left') //[4]
                y+=20
                let scannerColor = "#ab3b32"
                if (this.scanner.on) {
                    scannerColor = "#468b46"
                }
                this.modulesButtons.push({x1:5, y1:y-10,x2:75,y2:y+20,function: () => {if (this.tab==="modules") {this.scanner.on = 1 - this.scanner.on}}})
                this.display.drawRect(5,y-10,70,20,scannerColor)
                this.display.drawText(40,y+5, "Scanner", font1, color1, 'center')

                if (this.scanner.longrange) {
                    let longRangeColor = "#ab3b32"
                    if (this.scanner.longrangeOn) {
                        longRangeColor = "#468b46"
                    }
                    this.modulesButtons.push({x1:85, y1:y-10,x2:185,y2:y+20,function: () => {if (this.tab==="modules") {this.scanner.longrangeOn = 1 - this.scanner.longrangeOn}}})
                    this.display.drawRect(85,y-10,100,20,longRangeColor)
                    this.display.drawText(135,y+5, "Long Range", font1, color1, 'center')
                    y+=30
                    this.display.drawText(5,y, "Long Range Scanner Range: "+this.scanner.longrangeDistance+" ly", font1, color1, 'left')
                    y+=20
                } else {
                    y+=20
                }
                this.display.drawText(5,y, "Scanner Range: "+this.scanner.distance+" ly", font1, color1, 'left')
                y+=20
            } else if (this.tab==="powerCons") { //---------------------------------------------------------------------------------------Power Consumption
                let lineColor = "#666666"
                let maxVal = playerShip.batteries[0].maxDischarge*5
                this.display.drawText(5,155, (maxVal * 200).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,155,width,155,1,lineColor)
                this.display.drawText(5,180, (maxVal * 175).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,180,width,180,1,lineColor)
                this.display.drawText(5,205, (maxVal * 150).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,205,width,205,1,lineColor)
                this.display.drawText(5,230, (maxVal * 125).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,230,width,230,1,lineColor)
                this.display.drawText(5,255, (maxVal * 100).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,255,width,255,1,lineColor)
                this.display.drawText(5,280, (maxVal * 75).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,280,width,280,1,lineColor)
                this.display.drawText(5,305, (maxVal * 50).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,305,width,305,1,lineColor)
                this.display.drawText(5,330, (maxVal * 25).toFixed(0) + "kW", font1, color1, 'left')
                this.display.drawLine(50,330,width,330,1,lineColor)
                this.display.drawText(5,355, "0kW", font1, color1, 'left')
                for (let i = 0; i < this.powerConsumptionArray.length; i++) {
                    let x = i
                    let y = 0
                    y = this.powerConsumptionArray[i] / maxVal
                    this.display.drawRect(x+50, 350, 1, y * (-1000), "rgba(72, 169, 255, 1)")
                }
            } else if (this.tab==="jumpDrive") {
                let keyPressed = this.keyInput
                let selected = this.inputData.jumpDrive.select
                if (selected!=="") {
                    this.listenForInput = true
                    if (keyPressed==="Backspace") {
                        if (this.inputData.jumpDrive[selected].length>0) {
                            this.inputData.jumpDrive[selected] = this.inputData.jumpDrive[selected].substring(0, this.inputData.jumpDrive[selected].length - 1)
                        }
                    } else if (isFinite(keyPressed)) {
                        this.inputData.jumpDrive[selected] += ""+keyPressed
                    } else if (keyPressed==="," || keyPressed===".") {
                        this.inputData.jumpDrive[selected] += "."
                    }
                }
                this.inputData.jumpDrive.x = this.inputData.jumpDrive.x.substring(0, 17)
                this.inputData.jumpDrive.y = this.inputData.jumpDrive.y.substring(0, 17)
                this.inputData.jumpDrive.z = this.inputData.jumpDrive.z.substring(0, 17)
                let x = Number(this.inputData.jumpDrive.x)
                let y = Number(this.inputData.jumpDrive.y)
                let z = Number(this.inputData.jumpDrive.z)

                let distance = calcDistance(playerShip,{position:{x:x, y:y, z:z}})
                let chargeNeed = playerShip.jumpDrive.getChargeNeeded(distance)
                let timeNeed = chargeNeed/playerShip.jumpDrive.chargeSpeed



                this.display.drawText(10,20, "Charge Time: "+timeNeed.toFixed(1)+"sec", font1, color1, 'left')
                this.display.drawText(10,40, "Power: "+(chargeNeed/3.6).toFixed(0)+" kWh", font1, color1, 'left')
                this.display.drawText(10,60, "Fuel: "+playerShip.jumpDrive.getFuelNeeded(distance).toFixed(0)+" kg", font1, color1, 'left')

                let dColor = color1
                if (distance>playerShip.jumpDrive.maxDistance) {
                    dColor = "#FF0000"
                }

                this.display.drawText(10,80, "Distance: "+getDistanceText(distance)+" / "+playerShip.jumpDrive.maxDistance+"ly", font1, dColor, 'left')

                this.display.drawText(10,150, "x: ", font1, color1, 'left')
                this.display.drawText(125,150, this.inputData.jumpDrive.x, font1, color1, 'center')
                this.display.drawRectStroke(50,135,150,25,color1)

                this.display.drawText(10,180, "y: ", font1, color1, 'left')
                this.display.drawText(125,180, this.inputData.jumpDrive.y, font1, color1, 'center')
                this.display.drawRectStroke(50,165,150,25,color1)

                this.display.drawText(10,210, "z: ", font1, color1, 'left')
                this.display.drawText(125,210, this.inputData.jumpDrive.z, font1, color1, 'center')
                this.display.drawRectStroke(50,195,150,25,color1)

                this.display.drawText(125,242, "Jump", font1, "#00b600", 'center')
                this.display.drawRectStroke(50,225,150,25,"#00b600")

                //reset keyInput
                this.keyInput = ""
            }

            //-----------------------------------------------------------------------------------------------------------------bottom
            this.display.drawRect(0,height-40,width,height,"#000000")
            this.display.drawLine(0,height-40,width,height-40,2,color1)
            this.display.drawText(50,height-15,"Main",font1,color1,'center')
            this.display.drawLine(100,height-40,100,height,2,color1)
            this.display.drawText(125,height-15,"Nav",font1,color1,'center')
            this.display.drawLine(150,height-40,150,height,2,color1)
            this.display.drawText(175,height-15,"Comm",font1,color1,'center')
            this.display.drawLine(200,height-40,200,height,2,color1)
            this.display.drawText(250,height-15,"Life Support",fontSmall,color1,'center')

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
               this.starSystems.push({x1:x-sizeMap, y1:y-sizeMap,x2:x+sizeMap,y2:y+sizeMap,function: () => {
                       this.tab = "nav2"
                       this.nav2PlanetView=id
                       this.starSystems = []
                       let serverAddress = 0
                       if (starSystems[id].servers.length>0) {
                           serverAddress = starSystems[id].servers.find(o => o.type === 'trade')
                           if (serverAddress!==undefined) {
                               serverAddress = serverAddress.myAddress
                           } else {
                               serverAddress="Abort"
                           }
                       } else {
                           serverAddress="Abort"
                       }
                       this.functions.receivePriceData(serverAddress)
               }})
            }
        }

        //projectiles
        for (let i = 0; i<projectiles.length; i++) {
            if (projectiles[i]!==undefined) {
                let pr = projectiles[i]
                let xx = pr.position.x
                let yy = pr.position.y
                let x = varX-(xx*this.mapScaling)
                let y = varY-(yy*this.mapScaling)
                if (xx>-300-this.mapScaling && xx<(this.display.resolution.w+this.mapScaling) && yy>-180-this.mapScaling && yy<((this.display.resolution.h-bottom)+this.mapScaling)) {
                    this.display.drawLineRotate(x,y,2,4,387-pr.yaw,"#ff88f1")
                }
            }
        }

        //ships

        let drawShips = (obj,all) => {
            for (let i = 0; i<obj.length; i++) {
                if (obj[i]!==undefined) {
                    let ai
                    let xx
                    let yy

                    if (all===1) {
                        ai = aiShips[i]
                        xx = ai.position.x
                        yy = ai.position.y
                    } else {
                        ai = aiShips[obj[i].id]
                        xx = obj[i].position.x
                        yy = obj[i].position.y
                    }


                    let x = varX-(xx*this.mapScaling)
                    let y = varY-(yy*this.mapScaling)
                    if (xx>-300-this.mapScaling && xx<(this.display.resolution.w+this.mapScaling) && yy>-180-this.mapScaling && yy<((this.display.resolution.h-bottom)+this.mapScaling)) {
                        let color = factionList[ai.faction].color
                        this.display.drawRect(x,y,3,3,color)
                        if (ai.showInNav) {
                            this.display.drawText(x,y-5,ai.id,font,colorSystemText,"center")
                        }
                    }
                }
            }
        }

        if (settings.drawAllShips===1) {
            drawShips(aiShips,1)
        } else {
            drawShips(this.data.aiShipsScanned,0)
            drawShips(this.data.aiShipsLongScanned,0)
        }

        //star systems
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
            {x1:200, y1:360,x2:300,y2:400,function: () => {this.tab = "lifeSupport";this.starSystems = []}},


            {x1:0, y1:150,x2:30,y2:175,function: () => {if (this.tab==="nav") {this.defaultMapScaling()}}},
            {x1:0, y1:175,x2:30,y2:200,function: () => {if (this.tab==="nav") {this.zoomMapScaling()}}},
            {x1:580, y1:0,x2:600,y2:20,function: () => {if (this.tab==="nav") {this.tab="nav3"}}},
            {x1:580, y1:20,x2:600,y2:40,function: () => {if (this.tab==="nav") {this.tab="nav4"}}},
            {x1:40, y1:70,x2:80,y2:90,function: () => {if (this.tab==="nav") {this.gridEnabled = 1 - this.gridEnabled}}},
            //target (nav2)
            {x1:15, y1:325,x2:85,y2:345,function: () => {if (this.tab==="nav2") {this.target=starSystems[this.nav2PlanetView].name;this.targetType="system";this.targetObj=starSystems[this.nav2PlanetView]}}},
            //autopilot (nav2)
            {x1:100, y1:325,x2:200,y2:345,function: () => {if (this.tab==="nav2") {this.toggleAutopilot();this.targetType="system";this.target=starSystems[this.nav2PlanetView].name;this.targetObj=starSystems[this.nav2PlanetView] }}},

            //----------
            {x1:440, y1:20,x2:580,y2:40,function: () => {if (this.tab==="main") {this.tab="modules"}}},
            {x1:440, y1:45,x2:580,y2:65,function: () => {if (this.tab==="main") {this.functions.receiveTime()}}},
            {x1:440, y1:70,x2:580,y2:90,function: () => {if (this.tab==="main") {this.nav.start.recalcPosition()}}},
            {x1:440, y1:95,x2:580,y2:115,function: () => {if (this.tab==="main") {this.tab="powerCons"}}},
            {x1:440, y1:120,x2:580,y2:140,function: () => {if (this.tab==="main") {this.tab="jumpDrive"}}},
            //----------
            {x1:50, y1:135,x2:200,y2:160,function: () => {if (this.tab==="jumpDrive") {this.inputData.jumpDrive.select="x"}}},
            {x1:50, y1:165,x2:200,y2:190,function: () => {if (this.tab==="jumpDrive") {this.inputData.jumpDrive.select="y"}}},
            {x1:50, y1:195,x2:200,y2:220,function: () => {if (this.tab==="jumpDrive") {this.inputData.jumpDrive.select="z"}}},
            {x1:50, y1:225,x2:200,y2:245,function: () => {if (this.tab==="jumpDrive") {playerShip.jumpDrive.jump(this.inputData.jumpDrive.x,this.inputData.jumpDrive.y,this.inputData.jumpDrive.z);this.inputData.jumpDrive.select=""}}},
        ]
        if (this.tab==="lifeSupport") {
            buttons.push({x1:450, y1:180,x2:550,y2:205,function: () => {this.inputData.lifeSupport.select="temperature"}})
            buttons.push({x1:450, y1:40,x2:550,y2:65,function: () => {this.inputData.lifeSupport.select="pressure"}})
            //set
            buttons.push({x1:450, y1:310,x2:550,y2:335,function: () => {
                    playerShip.temperatureSet = Number(this.inputData.lifeSupport.temperature)+273.15
                    playerShip.pressureSet = Number(this.inputData.lifeSupport.pressure)
                }})
            buttons.push({x1:300, y1:10,x2:480,y2:30,function: () => {playerShip.lifeSupport[0].on = 1 - playerShip.lifeSupport[0].on}})  //atm
            buttons.push({x1:300, y1:150,x2:480,y2:170,function: () => {playerShip.lifeSupport[1].on = 1 - playerShip.lifeSupport[1].on}})  //temp
        }
        //nav 3 buttons
        if (this.tab==="nav3") {
            for (let i = 0; i<9; i++) {
                let y = ((this.data.startId+i)*35)+35
                let id = (this.data.startId+i)
                //45-10 = 35 (y1)
                buttons.push({x1:410, y1:y,x2:480,y2:y+20,function: () => {
                        if (this.tab==="nav3") {
                            this.target=starSystems[id].name
                            this.targetType="system"
                            this.targetObj=starSystems[id]
                        }}})
                buttons.push({x1:490, y1:y,x2:590,y2:y+20,function: () => {
                        if (this.tab==="nav3") {
                            this.toggleAutopilot()
                            this.targetType="system"
                            this.target=starSystems[id].name
                            this.targetObj=starSystems[id]
                        }}})
            }
        }

        //nav 4 buttons
        if (this.tab==="nav4") {
            for (let i = 0; i < 9; i++) {
                let y = ((this.data.startId + i) * 35) + 35
                let id = (this.data.startId + i)
                //45-10 = 35 (y1)
                buttons.push({
                    x1: 410, y1: y, x2: 480, y2: y + 20, function: () => {
                        if (this.tab === "nav4") {
                            this.target = planets[id].name
                            this.targetType = "planet"
                            this.targetObj = planets[id]
                        }
                    }
                })
                buttons.push({
                    x1: 490, y1: y, x2: 590, y2: y + 20, function: () => {
                        if (this.tab === "nav4") {
                            this.toggleAutopilot()
                            this.targetType = "planet"
                            this.target = planets[id].name
                            this.targetObj = planets[id]
                        }
                    }
                })
            }
        }
        buttons = buttons.concat(this.modulesButtons)


        for (let i = 0; i<buttons.length; i++) {
            let b = buttons[i]
            if (x>b.x1 && x<b.x2 && y>b.y1 && y<b.y2) {
                b.function()
            }
        }
        for (let i = 0; i<this.starSystems.length; i++) {
            let b = this.starSystems[i]
            if (x>b.x1 && x<b.x2 && y>b.y1 && y<b.y2) {
                b.function()
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
        } else if (this.mapScaling<10000) {
            this.mapScaling+=1000
        } else if (this.mapScaling<100000) {
            this.mapScaling+=10000
        } else if (this.mapScaling<1000000){
            this.mapScaling+=100000
        } else if (this.mapScaling<10000000){
            this.mapScaling+=1000000
        } else if (this.mapScaling<100000000){
            this.mapScaling+=10000000
        } else if (this.mapScaling<1000000000){
            this.mapScaling+=100000000
        } else if (this.mapScaling<1000000000) {
            this.mapScaling+=1000000000
        } else if (this.mapScaling<10000000000){
            this.mapScaling+=10000000000
        } else if (this.mapScaling<100000000000){
            this.mapScaling+=100000000000
        } else {
            this.mapScaling+=1000000000000
        }
    }


    decMapScaling() {
        if (this.mapScaling>1000000000000) {
            this.mapScaling-=1000000000000
        } else if (this.mapScaling>100000000000) {
            this.mapScaling-=100000000000
        } else if (this.mapScaling>10000000000) {
            this.mapScaling-=10000000000
        } else if (this.mapScaling>1000000000) {
            this.mapScaling-=1000000000
        } else if (this.mapScaling>100000000) {
            this.mapScaling-=100000000
        } else  if (this.mapScaling>10000000) {
            this.mapScaling-=10000000
        } else if (this.mapScaling>1000000) {
            this.mapScaling-=1000000
        } else if (this.mapScaling>100000) {
            this.mapScaling-=100000
        } else if (this.mapScaling>10000) {
            this.mapScaling-=10000
        } else if (this.mapScaling>1000) {
            this.mapScaling-=1000
        } else if (this.mapScaling>100) {
            this.mapScaling-=100
        } else if (this.mapScaling>10) {
            this.mapScaling-=10
        } else if(this.mapScaling>1) {
            this.mapScaling-=1
        }
    }

    defaultMapScaling() {
        this.mapScaling=60
    }

    zoomMapScaling() {
        this.mapScaling=1000000000000
    }


    constructor(id,weight,name,modules,consumption,memorySize,scanner = {distance:1.0/*ly*/, speed:3 /*ly/s*/, longrange:true/*can also long range scan*/, longrangeCharge:2 /*sec*/, longrangeDistance:10/*ly*/, longRangeNames:false}) {
        super(weight,name,"computer",id)
        this.consumption = consumption

        this.comm = new CommunicationModule()
        this.fuelCons = new FuelConsumptionModule()
        this.display = new DisplayModule()
        this.nav = new NavigationModule()
        this.scanner = new ScannerModule(scanner,this)

        this.modules = [this.comm,this.fuelCons,this.display,this.nav,this.scanner]

        this.memorySize = memorySize


        for (let i = 0; i<65536; i++) {
            this.receivedData.push([])
        }

    }
}