let speedInc2 = 1

function loop(timestamp) {
    //TODO:FIX SYNC
    let wait = false
    for (let i = 0; i<threads.length; i++) {
        if(!threads[i].done) {
            wait = true
        }
    }
    if (!wait) {
        progress = timestamp - lastRender
        if (progress > 250) {
            progress = 250
        }
        keyLoop() //keyboard inputs
        if (!gamePaused) {
            for (let i = 0; i<speedInc2; i++) {
                update(progress)
            }
        }
        draw(progress)

        lastRender = timestamp
    }
    window.requestAnimationFrame(loop)
}


let start = function() {
    let timeWorkers = performance.now()
    let waitForWorkersInit = setInterval(()=>{
        let t = 0
        for (let i = 0; i<threads.length; i++) {
            if (!threads[i].loaded) {
                continue
            } else {
                t++
            }
            if (t===threads.length) {
                console.log("Workers loaded after "+(performance.now()-timeWorkers).toFixed(1)+"ms")
                clearInterval(waitForWorkersInit)
                window.requestAnimationFrame(loop)
            }
        }
    },10)
}
doBeforeStart()
start()


