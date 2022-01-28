class TradeServer extends Server {
    run() {
        if (this.receiveArray.length>0) {
            let priceData = starSystems.find(o => o.name === this.systemName)
            this.transmit(0.12,this.receiveArray[0].data.senderAddress,3,{type:"var",var:"tradeData",trade:priceData.prices})
            this.receiveArray.shift()
        }
    }
}
