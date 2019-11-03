function getFirstPrimeFactor(x, primes) {
	// If it is even do this, otherwise just divide by 2 and don't bother computing sqrt and linerar array search
	if (x & 1) {
		const limit = Math.sqrt(x)
		return primes.find(p => (p <= limit) && (x % p === 0)) || x
	}
	return 2
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
	const sqrtN = Math.sqrt(n)
	for (let i = 2; i <= n; i++) {
		let res = _digest(i, primes)
		let res0 = res[0]
		if (res.length === 1 && res0 <= sqrtN) {
			primes.push(res0)
			//console.log("Oh a new prime:", res0)
		}
		res.forEach(rInt => {
			if (rInt in pows) {
				return pows[rInt]++
			}
			pows[res0] = 1
		})
		//console.log("digest", i, res)
	}
	// console.dir(pows)
	return pows
}

module.exports = { getFirstPrimeFactor, _digest, digestAll }