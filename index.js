function init(users) {
    const mapping = [];
    const lengthOfWholeInterval = users.reduce((previous, current, i) => {
        const length = previous + current;
        mapping.push({ userId: i, start: previous, end: length, length: current });
        return length;
    }, 0);
    return { lengthOfWholeInterval, mapping };
}

function getUserIdByIndex(mapping, randomPoint) {
    //这里的本质是区间查找算法，后期可以用二分查找优化，先用线性查找实现
    for (let item of mapping) {
        const { userId, start, end } = item;
        if (randomPoint >= start && randomPoint < end) {
            return userId;
        }
    }
    throw new Error("impossible randomPoint:" + randomPoint);
}



function lottery(users = []) {// 为简化代码不做数据校验，默认输入数据都合法
    const {
        lengthOfWholeInterval, // 区间总长度
        mapping //子区间与用户id的映射关系
    } = init(users);
    const randomPoint = Math.random() * lengthOfWholeInterval;//随机抽取点
    const userId = getUserIdByIndex(mapping, randomPoint);
    return userId;
}

module.exports = {lottery, init};