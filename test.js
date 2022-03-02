const { lottery, init } = require("./index");
const assert = require("assert");
const { linearRegression } = require("simple-statistics");

test(100000, 100, 50000); //100万次抽奖，100个用户，积分空间为[0, 5000)
test(100000, 1000, 50000);//100万次抽奖，1000个用户，积分空间为[0, 5000)
test(10000, 2000, 50000);//10万次抽奖，2000个用户，积分空间为[0, 5000)
test(10000, 5000, 50000);//10万次抽奖，5000个用户，积分空间为[0, 5000)

// test(100000, 50000, 50000);这个非常耗时，别跑。其实后续可以利用worker进行优化



function test(
    repeat = 1000000, numberOfUser = 100, upperLimitOfRewardPoints = 1000) {
    const users = generateTestData(numberOfUser, upperLimitOfRewardPoints).sort((x, y) => x < y ? -1 : 1).reverse();
    const result = [];
    for (let i = 0; i < repeat; i++) {
        const userId = lottery(users);
        result.push({ userId, rewardPoints: users[userId] });
    }
    result.sort((x, y) => x.rewardPoints > y.rewardPoints ? -1 : 1);
    const { lengthOfWholeInterval } = init(users);
    const distribution = getDistribution(result, lengthOfWholeInterval);
    // 进行拟合之后进行断言，这样就可以摆脱离群点的困扰
    return assertIt(distribution);
    
}



function assertIt(distribution) {
    const points = Object.keys(distribution).map(userId => [userId - 0, distribution[userId].ratio - 0]);
    const line = linearRegression(points);
    //我们断言的是，对于每个用户来说，区间长度和中奖次数是成正比的，
    //在统计学上这就是均匀分布，拟合后是一条直线
    console.log("直线方程为", line);
    assert.ok(Math.abs(line.m - 0) < 0.001);//斜率接近0

}



function getDistribution(result, lengthOfWholeInterval) {
    let distribution = {};
    result.map(item => {
        const { userId, rewardPoints } = item;
        if (distribution[userId] === undefined) {
            distribution[userId] = { count: 0, rewardPoints };// 记录每个用户的中奖次数和积分
        }
        distribution[userId].count += 1;
    });
    Object.keys(distribution).forEach(userId => {
        const { rewardPoints, count } = distribution[userId];
        distribution[userId].ratio = ((count / rewardPoints) ).toFixed(8)
    });

    return distribution;

}


function generateTestData(numberOfUser, upperLimitOfRewardPoints) {
    const users = [];
    for (let i = 0; i < numberOfUser; i++) {
        users.push(Math.round(Math.random() * upperLimitOfRewardPoints));
    }
    return users;
}