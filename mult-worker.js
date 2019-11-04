const { parentPort } = require('worker_threads');
const { Register } = require('./port-fn')

function mult(x, y) {
    return x * y
}

function unref() {
    parentPort.unref()    
}

const reg = new Register(parentPort, mult, unref)
