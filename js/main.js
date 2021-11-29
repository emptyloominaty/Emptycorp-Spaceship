let lastRender = 0
let timeSec = 0
let progress = 16.666666666666666666666666666667
let gameFPS = 60


function update(progress) {
    gameFPS = 1/progress*1000
    timeSec += progress/1000

    playerShip.everyFrame(gameFPS)

    playerShip.usePower(0.1/gameFPS) //0.1




}


