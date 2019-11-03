const am = require('am')
const { digestAll } = require('./prime.js')

function factorial(x) {
    return Object.entries(digestAll(x))
        .map(function power([prime, power]) {
            return BigInt(prime) ** BigInt(power)
        })
        .reduce(function multiply(result, n) {
            return result * n
        }, 1n)
}

function main(x) {
    x = Number(x)
	if (x < 2) {
		console.error("The number should be bigger than 2")
    }
    const answer = factorial(x)
	console.log(`${x}! = ${answer}`)
}

am(main)