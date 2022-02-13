class ScannerModule {
    consumption = 0.00012
    on = 1

    run() {
        this.aiSorted = [...aiShipsDistances]
        this.aiSorted = this.aiSorted.sort((a, b) => a.distance> b.distance ? 1 : -1)

        let shortRange = []
        for (let i = 0; i<this.aiSorted.length; i++) {
            if (this.aiSorted[i].distance<this.distance) {
                shortRange.push(this.aiSorted[i])
            }
        }
        this.computer.data.aiShipsScanned = shortRange

        if (this.longrange && this.longrangeOn) {
            this.i+=1/gameFPS
            if (this.i>this.longrangeCharge) {
                this.i = 0
                if (playerShip.usePower(this.longrangeConsumption / gameFPS, "computer")) {
                    this.aiSorted2 = [...this.aiSorted]
                    this.longRangeScan()
                } else {
                    this.longrangeOn = false
                    this.computer.data.aiShipsLongScanned = []
                }
            }
        } else {
            this.computer.data.aiShipsLongScanned = []
        }

    }

    longRangeScan() {
        let longRange = []
        for (let i = 0; i<this.aiSorted2.length; i++) {
            if (this.aiSorted2[i].distance<this.longrangeDistance && this.aiSorted2[i].distance>=this.distance) {
                longRange.push(this.aiSorted2[i])
                if (!this.longrangeNames) {
                    if (longRange[i]!==undefined) {
                        longRange[i].name = "Unidentified Ship"
                    }
                }
            }
        }
        this.computer.data.aiShipsLongScanned = longRange
    }


    constructor(scannerData,computer) {
        this.computer = computer
        this.distance = scannerData.distance //ly
        this.speed = scannerData.speed //ly/s
        this.longrange = scannerData.longrange
        this.longrangeOn = false
        if (this.longrange) {
            this.i = 0
            this.longrangeCharge = scannerData.longrangeCharge //every x sec
            this.longrangeDistance = scannerData.longrangeDistance //ly
            this.longrangeConsumption = 0.1
            this.longrangeNames = scannerData.longrangeNames
        }
    }

}