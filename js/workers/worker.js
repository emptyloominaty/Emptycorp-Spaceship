function worker_function() {
    let doTest = function(a,b,i) {
        return Number(a+b)+" ("+i+" Thread)"
    }

    self.addEventListener('message', function(e) {
        switch(e.data.do) {
            case "test": {
                let postMsgData = {do:"testB", val:doTest(e.data.funcParameters[0],e.data.funcParameters[1],e.data.funcParameters[2])}
                postMsgData = JSON.parse(JSON.stringify(postMsgData))
                postMessage(postMsgData)
                break
            }
        }
    }, false)
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
            }
        }

    }, false)

    threads[i].worker.postMessage({do:"test", func:"doTest" ,funcParameters:[40,60,i]})

}



