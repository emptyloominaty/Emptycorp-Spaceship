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

let getDirection360 = function(direction) {
    direction = direction % 360
    if (direction < 0) {
        direction += 360
    }
    return direction
}

let calcDistance = function(obj1,obj2) {
    let a = obj1.position.x - obj2.position.x //x1 - x2
    let b = obj1.position.y - obj2.position.y //y1 - y2
    let c = obj1.position.z - obj2.position.z //z1 - z2
    return Math.sqrt( a*a + b*b + c*c )
}


let calcHitbox = function(x,y,z,size) {
  return  {x1:x-size,y1:y-size,z1:z-size,x2:x+size,y2:y+size,z2:z+size}
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

let throttleBar = function(throttle,el,a=0,b=10,c=20,d=30,e=40,f=50,g=60,h=70,i=80,j=90) {
    elements[el+1].style.backgroundColor = "#000"
    elements[el+2].style.backgroundColor = "#000"
    elements[el+3].style.backgroundColor = "#000"
    elements[el+4].style.backgroundColor = "#000"
    elements[el+5].style.backgroundColor = "#000"
    elements[el+6].style.backgroundColor = "#000"
    elements[el+7].style.backgroundColor = "#000"
    elements[el+8].style.backgroundColor = "#000"
    elements[el+9].style.backgroundColor = "#000"
    elements[el+10].style.backgroundColor = "#000"

    if (throttle>j) {
        elements[el+10].style.backgroundColor = "#90ffe9"
    }
    if (throttle>i) {
        elements[el+9].style.backgroundColor = "#77ffa1"
    }
    if (throttle>h) {
        elements[el+8].style.backgroundColor = "#57ff54"
    }
    if (throttle>g) {
        elements[el+7].style.backgroundColor = "#95ff5d"
    }
    if (throttle>f) {
        elements[el+6].style.backgroundColor = "#c7ff71"
    }
    if (throttle>e) {
        elements[el+5].style.backgroundColor = "#edff6c"
    }
    if (throttle>d) {
        elements[el+4].style.backgroundColor = "#fffc75"
    }
    if (throttle>c) {
        elements[el+3].style.backgroundColor = "#ffe476"
    }
    if (throttle>b) {
        elements[el+2].style.backgroundColor = "#ffcc8a"
    }
    if (throttle>a) {
        elements[el+1].style.backgroundColor = "#ff9679"
    }

}