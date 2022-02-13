class DisplayModule {
    resolution = {w:600,h:400} //600x400
    consumption = 0.00003
    on = 1
    redrawConsumption = 0.00011
    canvasElement = document.getElementById("computerDisplay")
    canvas = this.canvasElement.getContext("2d")

    drawPlayerShipDirection(x,y,length = 10,width,color,direction) {
        this.canvas.save()
        this.canvas.beginPath()
        this.canvas.translate( this.resolution.w/2, (this.resolution.h-40)/2)
        this.canvas.rotate(((360-direction)+225) * Math.PI / 180)
        this.canvas.moveTo(x, y)
        this.canvas.lineTo(x+length, y+length)
        this.canvas.lineWidth = width
        this.canvas.strokeStyle = color
        this.canvas.stroke()
        this.canvas.closePath()
        this.canvas.restore()
    }

    drawRect(x,y,w,h,color) {
        this.canvas.fillStyle = color
        this.canvas.fillRect(x,y,w,h)
    }

    drawRectStroke(x,y,w,h,color,lineWidth = 1) {
        this.canvas.lineWidth = lineWidth
        this.canvas.strokeStyle = color
        this.canvas.strokeRect(x,y,w,h)
    }

    drawCircle(x,y,radius,color) {
        this.canvas.beginPath()
        this.canvas.fillStyle = color
        this.canvas.arc(x, y, radius, 0, 2 * Math.PI, false)
        this.canvas.fill()
        this.canvas.closePath()
    }

    drawCircleStroke(x,y,radius,color,lineWidth = 1) {
        this.canvas.beginPath()
        this.canvas.strokeStyle = color
        this.canvas.lineWidth = lineWidth
        this.canvas.arc(x, y, radius, 0, 2 * Math.PI, false)
        this.canvas.stroke()
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

    drawLineRotate(x,y,width,height,angle,color) {
        this.canvas.save()
        this.canvas.translate( x, y)
        this.canvas.rotate(angle * Math.PI / 180)
        this.canvas.beginPath()
        this.canvas.moveTo(0, 0)
        this.canvas.lineTo(width, height)
        this.canvas.lineWidth = width
        this.canvas.strokeStyle = color
        this.canvas.stroke()
        this.canvas.closePath()
        this.canvas.restore()
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
        this.canvasElement.addEventListener('mousemove', (e) => {
            playerShip.computers[0].mouseOverScreen(e.layerX,e.layerY)
        })
    }
}