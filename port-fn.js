const INVOKE_TYPE = 'invoke'
const RESOLVE_TYPE = 'resolve'
const REJECT_TYPE = 'reject'

function createInvokeMessage(id, name, ...params) {
    return {
        type: INVOKE_TYPE,
        id,
        name,
        params,
    }
}

function createResultMessage(id, name, result) {
    return {
        type: RESOLVE_TYPE,
        id,
        name,
        result,
    }
}

function createExceptionMessage(id, name, exception) {
    return {
        type: REJECT_TYPE,
        id,
        name,
        exception,
    }
}

function validMessage(msg) {
    return msg && typeof msg === 'object' && typeof msg.type === 'string'
}

class Register {
    constructor(port, ...handlers) {
        this.port = port
        this.handlerDic = {}
        handlers.forEach(handler => {
            this.handlerDic[handler.name] = handler
        })
        this.pendingPromises = {}
        port.on('message', async msg => {
            if (!validMessage(msg)) {
                console.error('invalid message', msg)
                return
            }
            // console.log('Message received', msg)
            switch(msg.type) {
                case INVOKE_TYPE:
                    try {
                        const fn = this.handlerDic[msg.name]
                        const params = msg.params || []
                        const result = await fn(...params)
                        port.postMessage(createResultMessage(msg.id, msg.name, result))
                    } catch (exception) {
                        port.postMessage(createExceptionMessage(msg.id, msg.name, exception))
                    }
                    return
                case RESOLVE_TYPE:
                    const promiseToResolve = this.pendingPromises[msg.id]
                    delete this.pendingPromises[msg.id]
                    promiseToResolve.resolve(msg.result)
                    return
                case REJECT_TYPE:
                    const promiseToReject = this.pendingPromises[msg.id]
                    delete this.pendingPromises[msg.id]
                    promiseToReject.reject(msg.result)
                    return
                default:
                    // We shouldn't reach here unless something else is sending messages with a string type
                    console.error('Invalid message type', msg)
            }
        })
    }

    async invoke(fnName, ...params) {
        const id = this._newUniqueRandomResolveId(fnName)
        const promise = new Promise((resolve, reject) => {
            this.pendingPromises[id] = { resolve, reject }
        })
        this.port.postMessage(createInvokeMessage(id, fnName, ...params))
        return promise
    }

    _newUniqueRandomResolveId(fnName) {
        let rnd
        do {
            rnd = fnName + '-' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        } while(rnd in this.pendingPromises)
        return rnd
    }
}

const proxyHandlers = {
    get: function(target, prop, receiver) {
        return (...params) => target.invoke(prop, ...params)
    }
}

function register(port, ...handlers) {
    const reg = new Register(port, ...handlers)
    return new Proxy(reg, proxyHandlers)
}

module.exports = { register }
