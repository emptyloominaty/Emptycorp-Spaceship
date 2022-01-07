class NavigationModule {
    consumption = 0.0009
    on = 1
    distanceTraveled = 0
    position = {x:0,y:0}

    run() {
        let speed = playerShip.speed/8765.812756 //ly/h
        this.distanceTraveled+=(speed/3600)/gameFPS
        this.calcPosition()
        //TODO:download position if needed or get idk
        playerShip.computers[0].data.shipDirection = this.getDirection360(playerShip.position.direction)

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

    getDirection360(direction) {
        direction = direction % 360
        if (direction < 0) {
            direction += 360
        }
        return direction
    }

}