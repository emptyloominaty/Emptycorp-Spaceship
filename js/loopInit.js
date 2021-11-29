function loop(timestamp) {
    progress = timestamp - lastRender

    update(progress)
    draw(progress)

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}


window.requestAnimationFrame(loop)
