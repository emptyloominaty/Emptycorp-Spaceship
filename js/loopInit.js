function loop(timestamp) {
    progress = timestamp - lastRender
    if (progress > 250) {
        progress = 250
    }
    keyLoop() //keyboard inputs
    if (!settingsOpen) {
        update(progress)
    }
    draw(progress)

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

doBeforeStart()
setTimeout(()=>{window.requestAnimationFrame(loop)},200)

