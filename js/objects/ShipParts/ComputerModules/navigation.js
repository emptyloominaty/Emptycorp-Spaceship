class NavigationModule {
    consumption = 0.0009
    on = 1
    distanceTraveled = 0
    position = {x:1,y:1}
    vars = {recalcPosition:{time:0,timeNeed:5,running:1,func:()=>{this.recalcPosition()},consumption:0.00085}}

    run() {
        let speed = playerShip.speed/8765.812756 //ly/h
        this.distanceTraveled+=(speed/3600)/gameFPS
        this.calcPosition()
        playerShip.computers[0].data.shipDirection = this.getDirection360(playerShip.position.direction)
        playerShip.computers[0].data.speed = playerShip.speed
        playerShip.computers[0].data.targetSpeed = playerShip.targetSpeed

        if (this.vars.recalcPosition.running!==1) {
            if (Math.round(playerShip.position.x)!==Math.round(playerShip.position.x) || Math.round(playerShip.position.y)!==Math.round(this.position.y)) {
                this.start.recalcPosition()
            }
        }

        Object.keys(this.vars).forEach((key)=> {
            if(this.vars[key].running===1) {
                if (playerShip.usePower(this.vars[key].consumption/gameFPS, "computer")) {
                    this.vars[key].time += 1 / gameFPS
                    if (this.vars[key].timeNeed < this.vars[key].time) {
                        this.vars[key].func()
                        this.vars[key].running = 0
                        this.vars[key].time = 0
                    }
                }
            }
        })

        //autopilot
        if (playerShip.computers[0].autopilot===1 && playerShip.computers[0].target!=="") {
            let a = playerShip.computers[0].targetObj.position.x - this.position.x //x1 - x2
            let b = playerShip.computers[0].targetObj.position.y - this.position.y //y1 - y2
            let distanceToObject = Math.sqrt( a*a + b*b )

            let angle = ((((Math.atan2( this.position.y - playerShip.computers[0].targetObj.position.y, this.position.x - playerShip.computers[0].targetObj.position.x ) * 180)) / Math.PI)-270)
            angle = angle*(-1)
            angle = angle % 360
            if (angle < 0) {
                angle += 360
            }

            playerShip.position.targetDirection = angle
            playerShip.targetSpeed = playerShip.maxSpeed
            playerShip.propulsion = "on"

            if (distanceToObject<0.25) {
                playerShip.computers[0].autopilot=0
                playerShip.targetSpeed = 0
                playerShip.propulsion = "off"
            }
        } else if (playerShip.computers[0].autopilot===1) {
            playerShip.computers[0].autopilot=0
            playerShip.targetSpeed = 0
            playerShip.propulsion = "off"
        }
    }

    start = {
        recalcPosition: ()=>{this.vars.recalcPosition.running=1}
    }

    calcPosition() {
        let speedInlyh = playerShip.speed/8765.812756  //lyh
        let speed = speedInlyh/3600/gameFPS

        let angleInRadian = (playerShip.position.direction*Math.PI) / 180
        let vx = Math.sin(angleInRadian) * speed
        let vy = Math.cos(angleInRadian) * speed
        this.position.x += vx
        this.position.y += vy
    }

    recalcPosition() {
        this.position.x = playerShip.position.x
        this.position.y = playerShip.position.y
    }

    getDirection360(direction) {
        direction = direction % 360
        if (direction < 0) {
            direction += 360
        }
        return direction
    }

}