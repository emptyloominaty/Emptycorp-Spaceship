class CommunicationModule {
    consumption = 0.00012
    on = 1
    run() {

    }
    receiveData(data) {
        playerShip.computers[0].receivedData[data.port].push(data)
    }
    transmitData(data) {
        playerShip.antennas[0].transmitArray.push({size:data[0], address:data[1], port:data[2], data:data[3]})
    }

}