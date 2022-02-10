function worker_function() {
    let id = 0
    let bigNumber = []
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

    let convertToBigNumber = function(s,e,c1,c2,c3,xyz,i) {
        bigNumber[i][xyz].s = s
        bigNumber[i][xyz].e = e
        bigNumber[i][xyz].c[0] = c1
        bigNumber[i][xyz].c[1] = c2
        bigNumber[i][xyz].c[2] = c3
    }

    let move = function(yaw,pitch,shipSpeed,fps,positionPrecise) {
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
        let bignumber = new BigNumber(positionHi)
        return bignumber.plus(positionLo)
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
                5=p.x.s
                6=p.x.e
                7=p.x.c1
                8=p.x.c2
                9=p.x.c3
                10=p.y.s
                11=p.y.e
                12=p.y.c1
                13=p.y.c2
                14=p.y.c3
                15=p.z.s
                16=p.z.e
                17=p.z.c1
                18=p.z.c2
                19=p.z.c3
                 */
                let array = e.data.array
                let moveArray = []
                if (array.length>0) {
                    for (let i = 0; i < array.length; i+=20) {
                        if (array[i]===undefined) {break}
                        let realId = i/20
                        convertToBigNumber(array[i+5],array[i+6],array[i+7],array[i+8],array[i+9],"x",realId)
                        let px = bigNumber[realId].x
                        convertToBigNumber(array[i+10],array[i+11],array[i+12],array[i+13],array[i+14],"y",realId)
                        let py = bigNumber[realId].y
                        convertToBigNumber(array[i+15],array[i+16],array[i+17],array[i+18],array[i+19],"z",realId)
                        let pz = bigNumber[realId].z


                        let positionPrecise = {x:px, y:py, z:pz}
                        let moveArray1 = move(array[i+1], array[i+2], array[i+3], array[i+4], positionPrecise)

                        let p = [moveArray1[1].x, moveArray1[1].y, moveArray1[1].z]
                        let ph = [moveArray1[2].x, moveArray1[2].y, moveArray1[2].z]
                        let pl =  [moveArray1[3].x, moveArray1[3].y, moveArray1[3].z]

                        let ppx = positionPrecise.x
                        let ppy = positionPrecise.y
                        let ppz = positionPrecise.z

                        moveArray.push(p[0],p[1],p[2], ph[0],ph[1],ph[2], pl[0],pl[1],pl[2], array[i], ppx.s, ppx.e, ppx.c[0] || 0, ppx.c[1] || 0, ppx.c[2] || 0, ppy.s, ppy.e, ppy.c[0] || 0, ppy.c[1] || 0, ppy.c[2] || 0, ppz.s, ppz.e, ppz.c[0] || 0, ppz.c[1] || 0, ppz.c[2] || 0)
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
                break
            }
            case "init": {
                id = e.data.id
                for (let i = 0; i<100000;i++) {
                    bigNumber.push({x:new BigNumber(0), y:new BigNumber(0), z:new BigNumber(0)})
                }
                let postMsgData = {do:"initDone", val:id, msg:"Thread ("+id+") loaded."}
                postMessage(postMsgData)
                break
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
    threads[i] = {worker:new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'}))),available:true, done:true, loaded: false}
    threads[i].worker.addEventListener('message', function(e) {
        let id = i
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
                10 pp.x.s
                11 pp.x.e
                12 pp.x.c1
                13 pp.x.c2
                14 pp.x.c3
                15 pp.y.s
                16 pp.y.e
                17 pp.y.c1
                18 pp.y.c2
                19 pp.y.c3
                20 pp.z.s
                21 pp.z.e
                22 pp.z.c1
                23 pp.z.c2
                24 pp.z.c3
                 */
                let vals = e.data.val
                for (let i = 0; i<vals.length; i+=25) {
                    let shipId = vals[i+9]
                    if (aiShips[shipId]!==undefined) {
                        let positionHi = {x:vals[i+3],y:vals[i+4],z:vals[i+5]}
                        let positionLo = {x:vals[i+6],y:vals[i+7],z:vals[i+8]}

                        aiShips[shipId].position = {x:vals[i],y:vals[i+1],z:vals[i+2]}
                        aiShips[shipId].positionHi = positionHi
                        aiShips[shipId].positionLo = positionLo

                        convertToBigNum(vals[i+10],vals[i+11],vals[i+12],vals[i+13],vals[i+14],"x",aiShips[shipId].positionPrecise)
                        convertToBigNum(vals[i+15],vals[i+16],vals[i+17],vals[i+18],vals[i+19],"y",aiShips[shipId].positionPrecise)
                        convertToBigNum(vals[i+20],vals[i+21],vals[i+22],vals[i+23],vals[i+24],"z",aiShips[shipId].positionPrecise)
                    }
                }
                threads[id].available = true
                threads[id].done = true
                break
            }
            case "initDone": {
                console.log(e.data.msg)
                threads[i].loaded = true
                break
            }
        }

    }, false)


    threads[i].worker.postMessage({do:"importScript",scriptUrl: Worker_BigNumberJS})
    threads[i].worker.postMessage({do:"init", id:i})
    //threads[i].worker.postMessage({do:"test", func:"doTest" ,funcParameters:[40,60,i]})
    /*threads[i].worker.postMessage({do:"testBigNumber", func:"doBigNumberTest" ,funcParameters:[new BigNumber(1),new BigNumber(2),i]})*/
}



