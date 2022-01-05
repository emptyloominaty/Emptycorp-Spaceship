class DisplayModule {
    resolution = {w:600,h:400} //600x400
    consumption = 0.00003
    on = 1
    redrawConsumption = 0.00011
    canvasElement = document.getElementById("computerDisplay")
    canvas = this.canvasElement.getContext("2d")

    //TODO: OPTIMIZE THIS MEME

    drawRect(x,y,w,h,color) {
        this.canvas.fillStyle = color
        this.canvas.fillRect(x,y,w,h)
    }

    drawCircle(x,y,radius,color) {
        this.canvas.beginPath()
        this.canvas.fillStyle = color
        this.canvas.arc(x, y, radius, 0, 2 * Math.PI, false)
        this.canvas.fill()
        this.canvas.closePath()
    }

    drawText(x,y,text,font,color,align) {
        this.canvas.textAlign = align
        this.canvas.font = font //"16px Courier New"
        this.canvas.fillStyle = color
        this.canvas.fillText(text,x,y)
    }

    drawLine(x1,y1,x2,y2,lineWidth,color) {
        this.canvas.beginPath()
        this.canvas.moveTo(x1, y1)
        this.canvas.lineTo(x2, y2)
        this.canvas.lineWidth = lineWidth
        this.canvas.strokeStyle = color
        this.canvas.stroke()
        this.canvas.closePath()
    }


    cursorPosition(event) {
        let rect = this.canvasElement.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top
        playerShip.computers[0].touchScreen(x,y)
    }

    reset() {
        this.canvas.clearRect(0,0,this.resolution.w,this.resolution.h)
    }

    run() {
        this.reset()
    }

    constructor() {
        this.canvasElement.addEventListener('mousedown', (e) => {
            this.cursorPosition(e)
        })
    }
}