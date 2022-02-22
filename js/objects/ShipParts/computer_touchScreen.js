playerShip.computers[0].touchScreen = function(x,y) {
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
    if (this.tab==="jumpDrive") {
        buttons.push({x1:50, y1:255,x2:200,y2:280,function: () => {
                if ((Object.keys(this.targetObj).length!==0)) {
                    let off = 0.0000000000001
                    if (this.targetType==="system") {
                        off = 0.1
                    } else if (this.targetType==="planet") {
                        off = 0.00002 //TODO: getRadius
                    }
                    this.inputData.jumpDrive.x = String(this.targetObj.position.x+off)
                    this.inputData.jumpDrive.y = String(this.targetObj.position.y+off)
                    this.inputData.jumpDrive.z = String(this.targetObj.position.z)
                }
            }})
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
