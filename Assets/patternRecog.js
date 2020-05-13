var fs = require('fs')
var SlidingAverageCalculator = require('./SlidingAverageCalculator')
var buildAggregateSkeleton = require('./buildAggregateSkeleton')

const jointIDs = {
    PELVIS: 0,
    SPINE_NAVEL: 1,
    SPINE_CHEST: 2,
    NECK: 3,
    CLAVICLE_LEFT: 4,
    SHOULDER_LEFT: 5,
    ELBOW_LEFT: 6,
    WRIST_LEFT: 7,
        HAND_LEFT: 8,
        HANDTIP_LEFT: 9,
        THUMB_LEFT: 10,
        CLAVICLE_RIGHT: 11,
    SHOULDER_RIGHT: 12,
    ELBOW_RIGHT: 13,
    WRIST_RIGHT: 14,
        HAND_RIGHT: 15,
        HANDTIP_RIGHT: 16,
        THUMB_RIGHT: 17,
        HIP_LEFT: 18,
    KNEE_LEFT: 19,
    ANKLE_LEFT: 20,
    FOOT_LEFT: 21,
    HIP_RIGHT: 22,
    KNEE_RIGHT: 23,
    ANKLE_RIGHT: 24,
    FOOT_RIGHT: 25,
    HEAD: 26,
    NOSE: 27,
    EYE_LEFT: 28,
    EAR_LEFT: 29,
    EYE_RIGHT: 30,
    EAR_RIGHT: 31,
    COUNT: 32
}

const jointLabels = Object.keys(jointIDs)

const prevAttMovAvg = () => {
    const getLastDerivative = arr => {
        if (arr.length < 1) return 0
        if (arr.length === 1) return arr[0]
        if (arr.length === 2) return arr[1] - arr[0]
        return arr[arr.length-2] - arr[arr.length-3]
    }
    const getCurrtDerivative = arr => {
        if (arr.length < 1) return 0
        if (arr.length === 1) return arr[0]
        return arr[arr.length-1] - arr[arr.length-2]
    }
    const movAvgCurve = []
    aggregateSkeleton[jointLabels.PELVIS].forEach(coord => {
        const movAv = movingAverage(coord.py)
        movAvgCurve.push(movAv)
        const lastDerivative = getLastDerivative(movAvgCurve)
        const currDerivative = getCurrDerivative(movAvgCurve)

        if (lastDerivative - currDerivative < 0 && currDerivative > 0) // starting descent
            console.log(1)
        if (lastDerivative - currDerivative > 0 && currDerivative > 0) // approaching bottom
            console.log(2)
        if (lastDerivative - currDerivative === 0) // at bottom or top
            console.log(3)
        if (lastDerivative - currDerivative > 0 && currDerivative < 0) // approaching top
            console.log(4)
        if (lastDerivative - currDerivative < 0 && currDerivative < 0) //ending ascent
            console.log(5)
    })
}

fs.readFile('./squat-capture-components/01-squat-right-armsOutTwoReps.txt', 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    const jointsToAnalyze = [
        jointIDs.PELVIS,
        jointIDs.HIP_LEFT,
        jointIDs.ANKLE_LEFT,
        jointIDs.FOOT_LEFT,
        jointIDs.HIP_RIGHT,
        jointIDs.ANKLE_RIGHT,
        jointIDs.FOOT_RIGHT,
    ]

    const _sw = 9
    const aggregateSkeleton = buildAggregateSkeleton(SlidingAverageCalculator, content, jointsToAnalyze, _sw, jointLabels);   // Or put the next step in a function and invoke it

    const numberOfDataRows = aggregateSkeleton[jointLabels[jointsToAnalyze[0]]].length
    // console.log(`numberOfDataRows: ${numberOfDataRows}`)

    let x = 0
    let movingJointWindow = 10 // excl limit 10 gives 9 coords, giving 8 deltas
    let movingJointHistory_Hip = []
    let movingJointHistory_Foot = []

    let movingHipDeltas = []

    while(x < numberOfDataRows) {
        const currentLeftHip = aggregateSkeleton[jointLabels[jointIDs.HIP_LEFT]][x]
        const currentLeftFoot = aggregateSkeleton[jointLabels[jointIDs.FOOT_LEFT]][x]

        movingJointHistory_Hip.push(currentLeftHip)
        movingJointHistory_Foot.push(currentLeftFoot)

        if (movingJointHistory_Hip.length > 1) {
            movingHipDeltas = movingJointHistory_Hip.map((leadingHip, leadingHipIndex) => {
                if (leadingHipIndex === 0) return 0

                const laggingHipIndex = leadingHipIndex - 1
                const laggingHip = movingJointHistory_Hip[laggingHipIndex]
                const delta = leadingHip.py_avg - laggingHip.py_avg

                return delta // 1st derivative
            })
        }
        movingHipDeltas.shift() // to remove leading 0

        if (movingJointHistory_Hip.length === movingJointWindow) {
            movingJointHistory_Hip.shift()
            movingJointHistory_Foot.shift()
            console.log(movingHipDeltas[0])
            movingHipDeltas.shift()
        }
        

        // if (x === 30) console.log(movingJointHistory_Hip)
        // if (x === 30) console.log(movingHipDeltas)

        x += 1
    }
})
