function loop(timestamp) {
    progress = timestamp - lastRender
    if (progress > 250) {
        progress = 250
    }
    update(progress)
    draw(progress)

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

doBeforeStart()
window.requestAnimationFrame(loop)
