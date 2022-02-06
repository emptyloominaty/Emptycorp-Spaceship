function worker_function() {
    let done = false
    let doTest = function(a,b,i) {
        return Number(a+b)+" ("+i+" Thread)"
    }
    let doBigNumberTest = function(a,b,i) {
        let aa = new BigNumber(0)
        aa.s = a.s
        aa.e = a.e
        aa.c = a.c
        let bb = new BigNumber(0)
        bb.s = b.s
        bb.e = b.e
        bb.c = b.c
        return (aa.plus(bb))+" ("+i+" Thread) [BigNumbers.js]"
    }

    let convertToBigNumber = function(number) {
        let bigNum = new BigNumber(0)
        bigNum.s = number.s
        bigNum.e = number.e
        bigNum.c = number.c
        return bigNum
    }

    let move = function(yaw,pitch,shipSpeed,fps,positionPrecise2,position,positionHi,positionLo,done) {
        if (done!==undefined) {

            let speedInlyh = shipSpeed / 8765.812756
            let speed = speedInlyh / 3600 / fps


            let angleInRadianYaw = (yaw * Math.PI) / 180
            let angleInRadianPitch = (pitch * Math.PI) / 180

            let theta = angleInRadianYaw
            let phi = Math.PI / 2 - angleInRadianPitch

            let vx = (Math.sin(phi) * Math.sin(theta)) * speed
            let vy = (Math.sin(phi) * Math.cos(theta)) * speed
            let vz = (Math.cos(phi)) * speed

            let positionPrecise = {
                x: convertToBigNumber(positionPrecise2.x),
                y: convertToBigNumber(positionPrecise2.y),
                z: convertToBigNumber(positionPrecise2.z)
            }

            positionPrecise.x = positionPrecise.x.plus(vx)
            positionPrecise.y = positionPrecise.y.plus(vy)
            positionPrecise.z = positionPrecise.z.plus(vz)
            position.x = positionPrecise.x.toNumber()
            position.y = positionPrecise.y.toNumber()
            position.z = positionPrecise.z.toNumber()
            //console.log(position.y)

            positionHi.x = ((positionPrecise.x.toNumber().toPrecision(12)))
            positionHi.y = ((positionPrecise.y.toNumber().toPrecision(12)))
            positionHi.z = ((positionPrecise.z.toNumber().toPrecision(12)))

            positionLo.x = positionPrecise.x.minus(positionHi.x).toNumber()
            positionLo.y = positionPrecise.y.minus(positionHi.y).toNumber()
            positionLo.z = positionPrecise.z.minus(positionHi.z).toNumber()
            return [positionPrecise, position, positionHi, positionLo]
        }
    }

    self.addEventListener('message', function(e) {
        switch(e.data.do) {
            case "move": {
                let postMsgData = {do:"moveData", id:e.data.id, val:move(e.data.yaw,e.data.pitch,e.data.speed,e.data.fps,e.data.positionPrecise,e.data.position,e.data.positionHi,e.data.positionLo,done)}
                //postMsgData = JSON.parse(JSON.stringify(postMsgData))
                postMessage(postMsgData)
                move()
                break
            }
            case "test": {
                let postMsgData = {do:"testB", val:doTest(e.data.funcParameters[0],e.data.funcParameters[1],e.data.funcParameters[2])}
                postMsgData = JSON.parse(JSON.stringify(postMsgData))
                postMessage(postMsgData)
                break
            }
            case "testBigNumber": {
                let postMsgData = {do:"testB", val:doBigNumberTest(e.data.funcParameters[0],e.data.funcParameters[1],e.data.funcParameters[2])}
                postMsgData = JSON.parse(JSON.stringify(postMsgData))
                postMessage(postMsgData)
                break
            }
            case "importScript": {
                importScripts(e.data.scriptUrl)
            }
        }
    }, false)
}

//Import Scripts
let Worker_BigNumberJS = (function() {
    let parts = document.location.href.split('/')
    parts[parts.length - 1] = '/js/lib/bignumber.js'
    return parts.join('/')
}())


let convertToBigNumber = function(number) {
    let bigNum = new BigNumber(0)
    bigNum.s = number.s
    bigNum.e = number.e
    bigNum.c = number.c
    return bigNum
}

let getNumberOfThreads = function() {
    let minNumberOfThreads = 2
    let maxNumberOfThreads = 8
    let numberOfThreads = window.navigator.hardwareConcurrency
    if (numberOfThreads>maxNumberOfThreads) {
        numberOfThreads = maxNumberOfThreads
    }
    if (numberOfThreads<minNumberOfThreads) {
        numberOfThreads = minNumberOfThreads
    }
    return numberOfThreads
}

let numberOfThreads = getNumberOfThreads()

let threads = []
let threadIdx = 0

for (let i = 0; i<numberOfThreads-1; i++) {
    threads[i] = {worker:new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})))}

    threads[i].worker.addEventListener('message', function(e) {
        switch(e.data.do) {
            case "testB": {
                console.log(e.data.val)
                break
            }
            case "moveData": {
                if (aiShips[e.data.id]!==undefined) {
                    let vals = e.data.val //[positionPrecise, position, positionHi, positionLo]
                    aiShips[e.data.id].position = vals[1]
                    aiShips[e.data.id].positionHi = vals[2]
                    aiShips[e.data.id].positionLo = vals[3]
                    aiShips[e.data.id].positionPrecise = {x:convertToBigNumber(vals[0].x),y:convertToBigNumber(vals[0].y),z:convertToBigNumber(vals[0].z)}
                }

                break
            }
        }

    }, false)


    threads[i].worker.postMessage({do:"importScript",scriptUrl: Worker_BigNumberJS})
    threads[i].worker.postMessage({do:"test", func:"doTest" ,funcParameters:[40,60,i]})
    /*threads[i].worker.postMessage({do:"testBigNumber", func:"doBigNumberTest" ,funcParameters:[new BigNumber(1),new BigNumber(2),i]})*/
}



