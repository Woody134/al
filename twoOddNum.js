/*
 * 位运算
 * 一个数组中只有两个数出现了奇数次，求这两个数是多少
 */
function twoOddNum(array) {
    let eor = 0;
    for(let i = 0; i < array.length; i++) {
        eor ^= array[i];
    }
    let rightOne = eor&(~eor+1);
    let a = 0;
    for(let i = 0; i < array.length; i++) {
        // 错误：rightOne & array[i] == 0 ， == 优先级 高于 &
        if((rightOne & array[i]) == 0) {
            a ^= array[i];
        }
    }
    return [a, eor^a];
}