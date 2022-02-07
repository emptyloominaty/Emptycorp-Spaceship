function worker_function() {
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
        return new BigNumber({ s: number.s, e: number.e, c: number.c, _isBigNumber: true })
    }

    let move = function(yaw,pitch,shipSpeed,fps,positionPrecise2) {
        let position = {x:0,y:0,z:0}
        let positionHi = {x:0,y:0,z:0}
        let positionLo = {x:0,y:0,z:0}
        let speedInlyh = shipSpeed / 8765.812756
        let speed = speedInlyh / 3600 / fps

        let angleInRadianYaw = (yaw * Math.PI) / 180
        let angleInRadianPitch = (pitch * Math.PI) / 180

        let phi = angleInRadianYaw
        let theta = Math.PI / 2 - angleInRadianPitch

        let vx = (Math.sin(theta) * Math.sin(phi)) * speed
        let vy = (Math.sin(theta) * Math.cos(phi)) * speed
        let vz = (Math.cos(theta)) * speed

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

        positionHi.x = Number((positionPrecise.x.toNumber().toPrecision(12)))
        positionHi.y = Number((positionPrecise.y.toNumber().toPrecision(12)))
        positionHi.z = Number((positionPrecise.z.toNumber().toPrecision(12)))
        positionLo.x = positionPrecise.x.minus(positionHi.x).toNumber()
        positionLo.y = positionPrecise.y.minus(positionHi.y).toNumber()
        positionLo.z = positionPrecise.z.minus(positionHi.z).toNumber()
        return [positionPrecise, position, positionHi, positionLo]
    }

    let numbersToBigNumber = function(positionHi,positionLo) {
        let bignumberLo = new BigNumber(positionLo)
        let bignumber = new BigNumber(positionHi)
        return bignumber.plus(bignumberLo)
    }

    self.addEventListener('message', function(e) {
        switch(e.data.do) {
            case "move": {
                /*
                   0=id
                   1=yaw
                   2=pitch
                   3=speed
                   4=fps
                   5=pl.x
                   6=pl.y
                   7=pl.z
                   8=ph.x
                   9=ph.y
                   10=ph.z
                    */
                let array = e.data.array
                let moveArray = []
                if (array.length>0) {
                    for (let i = 0; i < array.length; i+=11) {
                        let realIdx = i/11
                        if (array[i]===undefined) {break}
                        let positionLo = {x:array[i+5], y:array[i+6], z:array[i+7]}
                        let positionHi = {x:array[i+8], y:array[i+9], z:array[i+10]}
                        let positionPrecise = {x:numbersToBigNumber(positionHi.x, positionLo.x), y:numbersToBigNumber(positionHi.y, positionLo.y), z:numbersToBigNumber(positionHi.z, positionLo.z)}
                        /*moveArray[realIdx] = move(array[i+1], array[i+2], array[i+3], array[i+4], positionPrecise)
                        moveArray[realIdx][4] = array[i]*/
                        let moveArray1 = move(array[i+1], array[i+2], array[i+3], array[i+4], positionPrecise)

                        //[positionPrecise, position, positionHi, positionLo]
                        let p = [moveArray1[1].x, moveArray1[1].y, moveArray1[1].z]
                        let ph = [moveArray1[2].x, moveArray1[2].y, moveArray1[2].z]
                        let pl =  [moveArray1[3].x, moveArray1[3].y, moveArray1[3].z]

                        moveArray.push(p[0],p[1],p[2], ph[0],ph[1],ph[2], pl[0],pl[1],pl[2], array[i])
                    }
                    let moveArray64 = Float64Array.from(moveArray)
                    let postMsgData = {do:"moveData", val:moveArray64}
                    postMessage(postMsgData,[moveArray64.buffer])
                }


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
//------------------------------------------------------------------------------------------------------------------------------------------------------
//Import Scripts
let Worker_BigNumberJS = (function() {
    let parts = document.location.href.split('/')
    parts[parts.length - 1] = '/js/lib/bignumber.js'
    return parts.join('/')
}())


let convertToBigNumber = function(number) {
    return new BigNumber({ s: number.s, e: number.e, c: number.c, _isBigNumber: true })
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
let idxNumberOfThreads = numberOfThreads-2

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
                /*
                0 p.x
                1 p.y
                2 p.z
                3 ph.x
                4 ph.y
                5 ph.z
                6 pl.x
                7 pl.y
                8 pl.z
                9 id
                 */
                //moveArray[realIdx].push(p[0],p[1],p[2], ph[0],ph[1],ph[2], pl[0],pl[1],pl[2], array[i])
                let vals = e.data.val
                for (let i = 0; i<vals.length; i+=10) {
                    let shipId = vals[i+9]
                    if (aiShips[shipId]!==undefined) {
                        let positionHi = {x:vals[i+3],y:vals[i+4],z:vals[i+5]}
                        let positionLo = {x:vals[i+6],y:vals[i+7],z:vals[i+8]}

                        aiShips[shipId].position = {x:vals[i],y:vals[i+1],z:vals[i+2]}
                        aiShips[shipId].positionHi = positionHi
                        aiShips[shipId].positionLo = positionLo
                        //console.log({x:numbersToBigNumber(positionHi.x, positionLo.x), y:numbersToBigNumber(positionHi.y, positionLo.y), z:numbersToBigNumber(positionHi.z, positionLo.z)})
                        aiShips[shipId].positionPrecise = {x:numbersToBigNumber(positionHi.x, positionLo.x), y:numbersToBigNumber(positionHi.y, positionLo.y), z:numbersToBigNumber(positionHi.z, positionLo.z)}
                    }
                }

                break
            }
        }

    }, false)


    threads[i].worker.postMessage({do:"importScript",scriptUrl: Worker_BigNumberJS})
    threads[i].worker.postMessage({do:"test", func:"doTest" ,funcParameters:[40,60,i]})
    /*threads[i].worker.postMessage({do:"testBigNumber", func:"doBigNumberTest" ,funcParameters:[new BigNumber(1),new BigNumber(2),i]})*/
}



