export const getEearliestDate = (dates: Date[]) => {
    return dates.reduce(function (pre, cur) {
        return pre > cur ? cur : pre;
    });
};

export const getOldestDate = (dates: Date[]) => {
    return dates.reduce(function (pre, cur) {
        return pre > cur ? pre : cur;
    });
};