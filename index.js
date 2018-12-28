const { digestAll } = require('./prime.js')

function factorial(x) {
    const pows = digestAll(x)
    const primes = Object.keys(pows).map(Number)
    return primes.reduce((sum, p) => {
        sum *= BigInt(p) ** BigInt(pows[p])
        return sum
    }, 1n)
}

function main(x) {
	if (x < 2) {
		console.error("The number should be bigger than 2")
	}
	console.log(`${x}! = ${factorial(x)}`)
}

main(Number(process.argv[2]))