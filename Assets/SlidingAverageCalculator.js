class SlidingAverageCalculator {
	constructor(_sw = 10) {
		this.items = []
        this.slidingWindow = _sw
        this.sliding = 0
        // console.log(`created new SAC, window is ${this.slidingWindow}`)
	}

	update(newValue) {
        // console.log(`newValue: ${newValue}`)
        // console.log(`this.slidingWindow: ${this.slidingWindow}`)
        // console.log(`items:`)
        // console.log(this.items)
        if (this.items.length === this.slidingWindow) {
            this.items.shift();
        }
        this.items.push(newValue)
        // console.log(this.items)
        const calcdAvg = this.items.reduce((total, num) => total + num, 0) / this.items.length
        this.sliding = calcdAvg
        
        // console.log(`calcdAvg: ${calcdAvg}`)
        // console.log(`sliding: ${this.sliding}`)
        return this.sliding
    }
    
	get mean() {
		return this.sliding
	}
    
	data() {
		return this.items
	}
}

module.exports = SlidingAverageCalculator
// var MovingAverageCalculator = require('./SlidingAverageCalculator')
// const calc = new SlidingAverageCalculator()
// calc.update(4)
// console.log('moving average mean = ' + calc.mean)
