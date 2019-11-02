const am = require('am')
const { digestAll } = require('./prime.js')

function factorial(x) {
    const pows = digestAll(x)
    const primes = Object.keys(pows).map(Number)
    return primes.reduce((result, p) => {
        result *= BigInt(p) ** BigInt(pows[p])
        return result
    }, 1n)
}

function main(x) {
    x = Number(x)
	if (x < 2) {
		console.error("The number should be bigger than 2")
	}
	console.log(`${x}! = ${factorial(x)}`)
}

am(main)