
var SlidingAverageCalculator = require('./SlidingAverageCalculator')

const sacOne = new SlidingAverageCalculator(4)
const jointsToAnalyzeSAC = [ // prv'y [jointIDs.PELVIS, jointIDs.PELVIS, jointIDs.PELVIS, etc ]
    sacOne,
    new SlidingAverageCalculator(4),
    new SlidingAverageCalculator(4),
    new SlidingAverageCalculator(4),
    new SlidingAverageCalculator(4),
    new SlidingAverageCalculator(4),
    new SlidingAverageCalculator(4),
]


jointsToAnalyzeSAC.map((c, i) => {
    
    jointsToAnalyzeSAC.map((calc, index) => {
        const _pyMAC = jointsToAnalyzeSAC[index].update(i*10 + index)
        // console.log(_pyMAC)
    })
})

jointsToAnalyzeSAC.forEach(calc => {
    console.log(calc.mean)
    console.log(calc.data())
})