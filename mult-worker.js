const { parentPort } = require('worker_threads');
const { register } = require('./port-fn')

function mult(x, y) {
    return x * y
}

function unref() {
    parentPort.unref()    
}

register(parentPort, mult, unref)
