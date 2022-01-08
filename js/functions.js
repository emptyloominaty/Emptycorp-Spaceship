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