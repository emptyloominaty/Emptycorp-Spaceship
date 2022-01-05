
class TimeServer extends Server {
    time = 0
    run() {
        this.time+=1000/gameFPS
        if (this.receiveArray.length>0) {
            this.transmit(0.01,this.receiveArray[0].address,2,{time:this.time})
            this.receiveArray.shift()
        }
    }
    //TODO: TRANSMIT RECEIVE
}

let timeServer = new TimeServer()