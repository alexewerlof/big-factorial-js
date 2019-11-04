const os = require('os')
const assert = require('assert')
const { Worker } = require('worker_threads')
const am = require('am')
const { register } = require('./port-fn')
const { digestAll } = require('./prime.js')

const threadCount = os.cpus().length
const workers = os.cpus().map(cpu => {
    console.log('Created a worker!')
    const worker = new Worker('./mult-worker.js')
    return register(worker)
})

function getRandomWorker() {
    const randomThreadIndex = Math.floor(Math.random() * threadCount)
    return workers[randomThreadIndex]
}

function factorial(x) {
    return new Promise((resolve, reject) => {
        const numbersToMultiply = Object.entries(digestAll(x))
            .map(function power([prime, power]) {
                return BigInt(prime) ** BigInt(power)
            })
        const multiplicationsExpected = numbersToMultiply.length - 1
        console.log('We are expecting this many multiplication operations', multiplicationsExpected)
        let multiplicationsDone = 0
        let intervalId = setInterval(async () => {
            if (multiplicationsDone === multiplicationsExpected) {
                clearInterval(intervalId)
                console.log('All the expected multiplication operations are done')
                workers.forEach(w => w.unref())
                resolve(numbersToMultiply[0])
            } else if (numbersToMultiply.length >= 2) {
                console.log('Have two numbers to send to a random worker to multiply')
                const result = await getRandomWorker().mult(numbersToMultiply.pop(), numbersToMultiply.pop())
                numbersToMultiply.push(result)
                multiplicationsDone++
            } else {
                console.log('Waiting')
            }
        }, 1)
    })
}

async function main(x) {
    x = Number(x)
	assert(x > 2, 'The number should be bigger than 2')
    assert(Number.isInteger(x), 'Not an integer number')
    const answer = await factorial(x)
    console.log(`${x}! = ${answer}`)
    console.log(`${x}! is computed`)
}

am(main)