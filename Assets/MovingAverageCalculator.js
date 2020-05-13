// https://nestedsoftware.com/2018/03/20/calculating-a-moving-average-on-streaming-data-5a7k.22879.html
// This doesn't give the result I wanted
// Sliding Average does it better

class MovingAverageCalculator {
	constructor() {
		this.count = 0
		this._mean = 0
	}

	update(newValue) {
		this.count++

		const differential = (newValue - this._mean) / this.count

		const newMean = this._mean + differential

		this._mean = newMean
	}

	get mean() {
		this.validate()
		return this._mean
	}

	validate() {
		if (this.count == 0) {
			throw new Error('Mean is undefined')
		}
	}
}

module.exports = MovingAverageCalculator
// var MovingAverageCalculator = require('./MovingAverageCalculator')
// const calc = new MovingAverageCalculator()
// calc.update(4)
// console.log('moving average mean = ' + calc.mean)
