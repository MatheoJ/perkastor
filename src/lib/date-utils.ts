export const getEarliestDate = (dates: any[]) => {
    return dates.reduce(function (pre, cur) {
        try {
            return Date.parse(pre) > Date.parse(cur) ? cur : pre;
        } catch (ignore) {
            return pre > cur ? cur : pre;
        }
    });
};
export const getOldestDate = (dates: any[]) => {
    return dates.reduce(function (pre, cur) {
        try {
            return Date.parse(pre) > Date.parse(cur) ? cur : pre;
        } catch (ignore) {
            return pre > cur ? cur : pre;
        }
    });
};