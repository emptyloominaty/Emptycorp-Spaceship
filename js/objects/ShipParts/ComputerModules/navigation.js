class NavigationModule {
    consumption = 0.0012
    on = 1
    distanceTraveled = 0
    position = {x:0,y:0}
    
    run() {
        let speed = playerShip.speed/8765.812756 //ly/h
        this.distanceTraveled+=(speed/3600)/gameFPS


        document.getElementById("debug16").innerText = "Distance: "+(this.distanceTraveled).toFixed(4)+" ly "
    }
}