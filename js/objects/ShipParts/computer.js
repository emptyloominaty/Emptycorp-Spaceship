class Computer extends Part {
    on = 1
    modules = []
    mode = 0 //0 = 0%  1 = 100% usage
    memory = 0
    comm = 0
    display = false
    time = 0
    tab = "main"

    run() {
       if (playerShip.usePower(this.consumption[0]/gameFPS,this.group)) { //todo:fix power consumption
           for (let i = 0; i<this.modules.length; i++) {
               if (this.modules[i].on===1) {
                   if (playerShip.usePower(this.modules[i].consumption/gameFPS,this.group)) {
                       this.modules[i].run()
                   }
               }
           }
           this.drawUi()
           this.time+=1000/gameFPS
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
        if (this.display && this.display.on===1) {
            let width = this.display.resolution.w
            let height = this.display.resolution.h

            //main
            let color1 = "#d7d7d7"
            let font1 = "16px Consolas"
            //current Tab
            let color2 = "#7e97d7"
            let font2 = "18px Consolas"
            //fps,time
            let color3 = "#d7d7d7"
            let font3 = "12px Consolas"

            if (this.tab==="main") {

            } else if (this.tab==="fuelcons") {
                this.display.drawRect(100,100,50,50,"#00ff00") //test
            }

            //bottom
            this.display.drawLine(0,height-40,width,height-40,2,color1)
            this.display.drawText(50,height-15,"Main",font1,color1,'center')
            this.display.drawLine(100,height-40,100,height,2,color1)
            this.display.drawText(125,height-15,"Nav",font1,color1,'center')
            this.display.drawLine(150,height-40,150,height,2,color1)
            this.display.drawText(175,height-15,"Comm",font1,color1,'center')
            this.display.drawLine(200,height-40,200,height,2,color1)
            this.display.drawText(250,height-15,"FuelCons",font1,color1,'center')

            this.display.drawLine(300,height-40,300,height,2,color1)
            this.display.drawText(350,height-15,"2",font1,color1,'center')
            this.display.drawLine(400,height-40,400,height,2,color1)
            this.display.drawText(450,height-15,this.tab,font2,color2,'center')
            this.display.drawLine(500,height-40,500,height,2,color1)
            this.display.drawText(550,height-10,"Time:"+this.getTimeString(this.time),font3,color3,'center')
            this.display.drawText(550,height-25,"Fps:"+gameFPS.toFixed(0)+"FPS",font3,color3,'center')

        }
    }



    touchScreen(x,y) {
        let buttons = [{x1:0, y1:360,x2:100,y2:400,function: () => {this.tab = "main"}},
            {x1:100, y1:360,x2:150,y2:400,function: () => {this.tab = "nav"}},
            {x1:150, y1:360,x2:200,y2:400,function: () => {this.tab = "comm"}},
            {x1:200, y1:360,x2:300,y2:400,function: () => {this.tab = "fuelcons"}},
        ]

        for (let i = 0; i<buttons.length; i++) {
            let b = buttons[i]
            if (x>b.x1 && x<b.x2 && y>b.y1 && y<b.y2) {
                b.function()
                break
            }
        }



    }





    constructor(id,weight,name,modules,consumption,memorySize) {
        super(weight,name,"computer",id)
        this.consumption = consumption

        for(let i = 0; i<modules.length; i++) {
            if (modules[i]==="communication") {
                this.modules.push(new CommunicationModule())
                this.comm = this.modules[i]
            } else if (modules[i]==="fuelConsumption") {
                this.modules.push(new FuelConsumptionModule())
            } else if (modules[i]==="navigation") {
                this.modules.push(new NavigationModule())
            } else if (modules[i]==="memory") {
                this.modules.push(new MemoryModule(memorySize))
                this.memory = this.modules[i]
            } else if (modules[i]==="display") {
                this.modules.push(new DisplayModule())
                this.display = this.modules[i]
            }
        }

    }
}