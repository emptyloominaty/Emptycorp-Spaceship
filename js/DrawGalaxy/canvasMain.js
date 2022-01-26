class CanvasMain {
    canvas = document.getElementById("spaceShipWindow")
    webgl = this.canvas.getContext("webgl")


    constructor() {
        this.webgl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)
    }


}

let screen3D = new CanvasMain