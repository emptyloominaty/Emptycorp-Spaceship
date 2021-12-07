class MemoryModule {
    consumption = 0.000125
    on = 1
    data = []
    memoryUse = 0
    constructor(memorySize) {
        this.memorySize = memorySize
    }

    run() {

    }

    addData(data,size) {
        if (this.on===1) {
            if (this.memorySize>this.memoryUse+size)
                this.memoryUse += size
            this.data.push({data:data, size:size})
            return true
        }
        return false
    }

    deleteData(id) {
        if (this.on===1) {
            this.memoryUse -= this.data[id].size
            this.data[id]=({data:0,size:0})
            return true
        }
        return false
    }
}