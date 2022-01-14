let linearInterpolation = function(x,stepX,array) {
    if (x<0) {x=0}
    let maxX = (array.length-1)*stepX
    if (x>maxX) {x=maxX}

    let cx = x / stepX

    let cxR = (x % stepX) / stepX

    let x1 = Math.floor(cx)
    let x2 = Math.ceil(cx)

    let c = (array[x2] - array[x1]) * cxR

    c = c + array[x1]
    return c
}


let getSpeedText = function(speed) {
    let ret
    if (speed>10000000) {
        ret = (speed/8765.812756/3600).toFixed(2)+"ly/s"
    }else if (speed>1000) {
        ret = (speed/8765.812756).toFixed(2)+"ly/h"
    }else if (speed>0.01) {
        ret = (+speed).toFixed(2)+"c"
    } else if (speed>0.0001) {
        ret = (speed*299792.458).toFixed(2)+"km/s"
    } else {
        ret = (speed*299792458).toFixed(2)+"m/s"
    }
    return ret
}

let throttleBar = function() {
    let throttle = playerShip.computers[0].data.engineThrottle*100
    elements.throttleBar1.style.backgroundColor = "#000"
    elements.throttleBar2.style.backgroundColor = "#000"
    elements.throttleBar3.style.backgroundColor = "#000"
    elements.throttleBar4.style.backgroundColor = "#000"
    elements.throttleBar5.style.backgroundColor = "#000"
    elements.throttleBar6.style.backgroundColor = "#000"
    elements.throttleBar7.style.backgroundColor = "#000"
    elements.throttleBar8.style.backgroundColor = "#000"
    elements.throttleBar9.style.backgroundColor = "#000"
    elements.throttleBar10.style.backgroundColor = "#000"

    if (throttle>90) {
        elements.throttleBar10.style.backgroundColor = "#90ffe9"
    }
    if (throttle>80) {
        elements.throttleBar9.style.backgroundColor = "#77ffa1"
    }
    if (throttle>70) {
        elements.throttleBar8.style.backgroundColor = "#57ff54"
    }
    if (throttle>60) {
        elements.throttleBar7.style.backgroundColor = "#95ff5d"
    }
    if (throttle>50) {
        elements.throttleBar6.style.backgroundColor = "#c7ff71"
    }
    if (throttle>40) {
        elements.throttleBar5.style.backgroundColor = "#edff6c"
    }
    if (throttle>30) {
        elements.throttleBar4.style.backgroundColor = "#fffc75"
    }
    if (throttle>20) {
        elements.throttleBar3.style.backgroundColor = "#ffe476"
    }
    if (throttle>10) {
        elements.throttleBar2.style.backgroundColor = "#ffcc8a"
    }
    if (throttle>0) {
        elements.throttleBar1.style.backgroundColor = "#ff9679"
    }

}