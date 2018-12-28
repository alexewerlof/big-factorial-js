const { expect } = require('chai')
const { getFirstPrimeFactor, _digest, digestAll } = require('./prime.js')

describe('prime.js', () => {
    const first10primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    describe('getFirstPrimeFactor()', () => {
        it('finds the first prime factor from the array of given primes', () => {
            expect(getFirstPrimeFactor(121, first10primes)).to.equal(11)
        })
        it('finds 2 as the first prime factor for even numbers', () => {
            expect(getFirstPrimeFactor(22, first10primes)).to.equal(2)
        })
        it('returns its input if it cannot find a prime factor', () => {
            expect(getFirstPrimeFactor(23, first10primes)).to.equal(23)
        })
        it('returns its input if it is a prime itself', () => {
            expect(getFirstPrimeFactor(13, first10primes)).to.equal(13)
        })
    })

    describe('_digest()', () => {
        it('breaks a number to an array of its primes', () => {
            expect(_digest(10, first10primes)).to.deep.equal([2, 5])
        })
        it('for a prime returns an array that includes that prime', () => {
            expect(_digest(13, first10primes)).to.deep.equal([13])
        })
        it('can handle multiple primes factors that build a number', () => {
            expect(_digest(12, first10primes)).to.deep.equal([2, 2, 3])
        })
    })

    describe('digestAll()', () => {
        it('breaks a factorial to a bunch of prime numbers and their powers', () => {
            /*
            5! = 1 x 2 x 3 x 4 x 5
            = 1 x 2 x 3 x 2 x 2 x 5
            = 2^3 + 3 + 5
            */
            expect(digestAll(5, first10primes)).to.deep.equal({
                2: 3,
                3: 1,
                5: 1
            })
        })
    })
})