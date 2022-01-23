class TimeServer extends Server {
    time = 0
    run() {
        this.time+=1000/gameFPS
        if (this.receiveArray.length>0) {
            this.transmit(0.01,this.receiveArray[0].data.senderAddress,2,{type:"var",var:"time",time:this.time})
            this.receiveArray.shift()
        }
    }
}
//(myAddress,name,run, x = 0,y = 0)
let timeServer = new TimeServer(1,"Time Server(Sol)",1,"time",0,0)