const splitFileStringToNonEmptyLines = fileStr => fileStr
    .split(new RegExp('\\d{1,2}/\\d{1,2}/\\d{4}\\s{1}\\d{1,2}:\\d{1,2}:\\d{1,2}\\s{1}[AP]M'))
    .filter(line => line.length > 0)

const parseSkeletonFromLine = line =>  line.split('!@')[1].split('@')

const buildAggregateSkeleton = (SlidingAverageCalculator, content, jointsToAnalyze, _sw = 9, jointLabels) => {
    const jointsToAnalyzeSAC = jointsToAnalyze.map(j => ({
        pxAvg: new SlidingAverageCalculator(_sw),
        pyAvg: new SlidingAverageCalculator(_sw),
        pzAvg: new SlidingAverageCalculator(_sw),
    }))

    const fileAsStrArr = splitFileStringToNonEmptyLines(content)
    console.log(fileAsStrArr.length)

    const aggregateSkeleton = {}
    fileAsStrArr
        .filter(line =>  parseSkeletonFromLine(line).length === 32)
        .forEach(line => {
            // console.log(line)
            // console.log(line.split('!@'))
            // console.log(line.split('!@')[1])
            // console.log(line.split('!@')[1].split('@'))
            const skeleton_raw = parseSkeletonFromLine(line)

            jointsToAnalyze.map((joint, index) => {
                if (aggregateSkeleton[jointLabels[joint]] === undefined) aggregateSkeleton[jointLabels[joint]] = []
                // console.log(skeleton_raw)
                // console.log(joint)
                // console.log(skeleton_raw[joint])
                const jointLocationData = skeleton_raw[joint].split('#')
                const _sac = jointsToAnalyzeSAC[index]

                aggregateSkeleton[jointLabels[joint]].push({
                    px: jointLocationData[0],
                    py: jointLocationData[1],
                    pz: jointLocationData[2],
                    px_avg: _sac.pxAvg.update(parseFloat(jointLocationData[0])),
                    py_avg: _sac.pyAvg.update(parseFloat(jointLocationData[1])),
                    pz_avg: _sac.pzAvg.update(parseFloat(jointLocationData[2])),
                    rw: jointLocationData[3],
                    rx: jointLocationData[4],
                    ry: jointLocationData[5],
                    rz: jointLocationData[6],
                })
            })
        })

    let numberOtherDataPoints = -1;
    const unevenNumberDataPoints = jointsToAnalyze.some(jointName => {
        const numberOfDataPointsForThisJoint = aggregateSkeleton[jointLabels[jointName]].length
        if (numberOtherDataPoints === -1){
            numberOtherDataPoints = numberOfDataPointsForThisJoint
            return false
        }
        return numberOfDataPointsForThisJoint !== numberOtherDataPoints
    })

    console.log(unevenNumberDataPoints ? `Error with jointDataPoints` : `jointDataPoints ok: ${numberOtherDataPoints}`)

    return aggregateSkeleton;
}

module.exports = buildAggregateSkeleton
