function getFirstPrimeFactor(x, primes) {
	const limit = Math.sqrt(x)
    return primes.find(p => (p <= limit) && (x % p === 0)) || x
}

function _digest(n, primes) {
    let x = n
    const ret = []
	while(true) {
        const p = getFirstPrimeFactor(x, primes)
		ret.push(p)
		if (x === p) {
			break
		}
		x /= p
	}
	return ret
}

function digestAll(n) {
	const primes = []
	const pows = {}
	for (let i = 2; i <= n; i++) {
		let res = _digest(i, primes)
		if (res.length === 1) {
			primes.push(res[0])
			// console.log("Oh a new prime:", res, primes)
		}
		res.forEach(rInt => {
			if (rInt in pows) {
				pows[rInt]++
			} else {
				pows[rInt] = 1
			}
		})
		// console.log("digest", i, res)
	}
	return pows
}

module.exports = { getFirstPrimeFactor, _digest, digestAll }