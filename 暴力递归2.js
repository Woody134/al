// 试法的数据结构、参数尽可能简单，少，方便转化为动态规划

/**
 * 题目
 * 使用递归逆序一个栈，不申请额外的数据结构
 * 1:32:00 https://www.bilibili.com/video/BV13g41157hK?p=11&spm_id_from=333.824.header_right.history_list.click&vd_source=b89b387b8770a0b69ddab591194bd329
 * 利用递归栈保存信息
 */
function reverseStack(stack) {
  if (stack.length < 1) {
    return;
  }
  let bottom = removeBottom(stack);
  reverseStack(stack);
  stack.push(bottom);
}

// 移除栈底元素，并返回该元素
function removeBottom(stack) {
  let result = stack.pop();
  if (stack.length < 1) {
    return result;
  }
  let last = removeBottom(stack); // 想要在各个递归中传递的东西，return，如这里的last
  stack.push(result);
  return last;
}

// let stack = [1, 2, 3, 4, 5];
// reverseStack(stack);
// console.log(stack);

/**
 * 题目：
 * 规定1和A对应，2和B对应，3和C对应。。。11和K对应。。。26和Z对应
 * 那么给定一个数字字符串，如111，就可以转化为AAA KA AK
 * 求给定一个数字字符串str,返回有多少种转化结果
 */
function convert(str) {
  convertProcess(str, '');
}

function convertProcess(str, result) {
  if (str.length === 0) {
    if (result.length) {
      count++;
      console.log(result, count);
    }
    return;
  }
  let resultA = result.concat(String.fromCharCode(Number(str[0]) + 64));
  convertProcess(str.slice(1), resultA);
  if (str.length >= 2) {
    let low = Number(str[1]);
    let high = Number(str[0]);
    let sum = low + high * 10;
    if (10 <= sum <= 27) {
      let resultB = result.concat(String.fromCharCode(sum + 64));
      convertProcess(str.slice(2), resultB);
    }
  }
}

// let count = 0;
// convert('101');

// ↑错误，没有考虑0x不能转化的情况
// 不完善，count用了外部变量

// 方法2
function convert2(str) {
  return convertProcess2(str, 0);
}

function convertProcess2(str, i) {
  if (str.length === i) {
    return 1;
  }
  let numi = Number(str[i]);
  if (numi === 0) {
    return 0;
  }
  if (str[i + 1] !== undefined) {
    const numj = Number(str[i + 1]);
    const sum = numj + numi * 10;
    if (10 <= sum <= 27) {
      return convertProcess2(str, i + 1) + convertProcess2(str, i + 2); // 当前字符和下一个字符可以组合成满足要求的，则往后的结果是两种相加
    }
  }
  // 当前字符满足要求，和下一个字符不可以组合成，则往后的结果是1种
  return convertProcess2(str, i + 1);
}

// console.log(convert2('101'));

/**
 * 题目：
 * 给定两个长度都为N的数组，weights values, weights[i]和values[i]分别代表第i个物品的重量和价值。
 * 给一个正整数bag，表示一个载重bag的袋子，可以容纳不超过bag的重量
 * 问，最多可以装多少价值的物品
 */
function maxValues(weights, values, bag) {
  return maxValuesProcess(weights, values, bag, 0, 0, 0);
}

function maxValuesProcess(weights, values, bag, i, sumW, sumV) {
  if (i === weights.length) {
    return sumV;
  }
  let hasiW = sumW + weights[i];
  let hasiV = sumV + values[i];
  if (hasiW > bag) return maxValuesProcess(weights, values, bag, i + 1, sumW, sumV);
  return Math.max(maxValuesProcess(weights, values, bag, i + 1, hasiW, hasiV), maxValuesProcess(weights, values, bag, i + 1, sumW, sumV));
}

// console.log(maxValues([1, 2, 3, 4, 5], [1, 4, 3, 4, 5], 3));
// console.log(maxValues([2, 5, 3, 4, 1, 5], [1, 5, 4, 3, 4, 1, 5], 3));

/**
 * 题目：N皇后问题
 * 问有多少种排列方式
 * 运用了位运算，由于number的大小限制，最大处理n=52
 * 另一种方法判断在同一斜线上： 两个点横纵坐标相加结果相等或者相减绝对值结果相等
 */
function NQueen(n) {
  return NQueenProcess(n, 0, 0, 0, 0);
}

function NQueenProcess(n, i, hasNot, leftNot, rightNot) {
  if (i === n) {
    return 1;
  }
  let result = 0;
  for (let j = 0; j < n; j++) {
    // 可优化，由三种限制计算出可以放置的位置，只循环可以放置的位置
    let bitj = 1 << j;
    if ((bitj | hasNot) === hasNot || (bitj | leftNot) === leftNot || (bitj | rightNot) === rightNot) continue;
    let nextHasNot = bitj | hasNot; // 注意不要直接改变hasNot， 否则下一个循环也会使用变化后的值
    let nextLeftNot = (bitj | leftNot) << 1;
    let nextRightNot = (bitj | rightNot) >> 1;
    result += NQueenProcess(n, i + 1, nextHasNot, nextLeftNot, nextRightNot);
  }
  return result;
}

// console.log(NQueen(8));

var PredictTheWinner = function (nums) {
  debugger;
  let fDp = new Array(nums.length);
  let sDp = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    fDp = new Array(nums.length).fill(-1);
    sDp = new Array(nums.length).fill(-1);
  }

  let firstV = first(nums, 0, nums.length - 1, fDp, sDp);
  let secondV = second(nums, 0, nums.length - 1, fDp, sDp);

  return firstV >= secondV;
};

var first = function (nums, l, r, fDp, sDp) {
  if (l === r) {
    fDp[l][r] = nums[l];
    return fDp[l][r];
  }
  if (fDp[l][r] !== -1) return fDp[l][r];

  fDp[l][r] = Math.max(nums[l] + second(nums, l + 1, r, fDp, sDp), nums[r] + second(nums, l, r - 1, fDp, sDp));
  return fDp[l][r];
};

/**
 * 后手函数，等先手在l r上取完后取，返回最大值
 * @param {*} nums
 * @param {*} l
 * @param {*} r
 */
var second = function (nums, l, r, fDp, sDp) {
  if (l === r) {
    sDp[l][r] = 0;
    return sDp[l][r];
  }
  if (sDp[l][r] !== -1) return sDp[l][r];

  // 先手会给后手留一个小的
  sDp[l][r] = Math.min(first(nums, l + 1, r, fDp, sDp), first(nums, l, r - 1, fDp, sDp));
  return sDp[l][r];
};

// console.log(PredictTheWinner([1, 5, 233, 2]));

var minCostClimbingStairs = function (cost) {
  debugger;
  if (cost.length < 1) return 0;

  // let dp0 = new Array(cost.length + 2).fill(-1);
  let dp1 = new Array(cost.length + 2).fill(-1);

  // process(0, 0, cost, dp0);
  process(1, 0, cost, dp1);

  // return Math.min(dp0[cost.length], dp1[cost.length]);
};

var process = function (i, costSum, cost, dp) {
  // if (dp[i] !== -1) return dp[i];
  if (i >= cost.length) {
    dp[i] = costSum;
    return costSum;
  }
  // if (i > cost.length - 1) return Number.POSITIVE_INFINITY; // or-1?
  let one = process(i + 1, costSum + cost[i], cost, dp);
  let two = process(i + 2, costSum + cost[i], cost, dp);
  dp[i] = Math.min(one, two);
  return Math.min(one, two);
};
console.log(minCostClimbingStairs([10, 15, 20]));
var solveNQueens = function (n) {
  let result = [];
  process(n, 0, 0, 0, 0, [], result);
  return result;
};

/**
 *
 * @param {*} n n皇后，不变
 * @param {*} i 从上往下处理的行数，第i个皇后
 * @param {*} hasnot 按位表示，所在列有皇后的，0可以放，1不可以放
 * @param {*} leftnot 按位表示，在皇后左对角线上为1不可放，0可放
 * @param {*} rightnot 按位表示，在皇后又对角线上为1不可放，0可放
 */
var process = function (n, i, hasnot, leftnot, rightnot, path, result) {
  if (i === n) {
    result.push(path.slice(0));
    return;
  }

  for (let j = 0; j < n; j++) {
    let bitj = 1 << j;
    if ((bitj | hasnot) === hasnot || (bitj | leftnot) === leftnot || (bitj | rightnot) === rightnot) continue;
    strj = ''
      .padEnd(j, '.')
      .padEnd(j + 1, 'Q')
      .padEnd(n, '.');
    path.push(strj);
    const hasnotNew = bitj | hasnot;
    const leftnotNew = (bitj | leftnot) << 1;
    const rightnotNew = (bitj | rightnot) >> 1;
    process(n, i + 1, hasnotNew, leftnotNew, rightnotNew, path, result);
    path.pop();
  }
};
console.log(solveNQueens(4));

/**
 * 机器人走K步
 * N个格子，1,2,3.。。N
 * 要求机器人起点 S 终点 E ，走K步，问有多少种走法
 */
let robotWalk1 = function (N, S, E, K) {
  return robotWalkProcess1(N, S, E, K);
};

/**
 * 暴力递归 o(2的k次方)
 *
 * @param {*} N 一共有多少个格子
 * @param {*} cur 当前所在格子
 * @param {*} E 目标格子
 * @param {*} res 当前还可以走几步
 */
let robotWalkProcess1 = function (N, cur, E, res) {
  if (res === 0) {
    if (cur === E) return 1;
    return 0;
  }
  if (cur === 1) return robotWalkProcess1(N, cur + 1, E, res - 1);
  if (cur === N) return robotWalkProcess1(N, cur - 1, E, res - 1);
  return robotWalkProcess1(N, cur + 1, E, res - 1) + robotWalkProcess1(N, cur - 1, E, res - 1);
};

// console.log(robotWalk1(3, 1, 3, 2));

/**
 * 记忆搜索 o(k*n)
 *
 * @param {*} N 一共有多少个格子
 * @param {*} cur 当前所在格子
 * @param {*} E 目标格子
 * @param {*} res 当前还可以走几步
 */
let robotWalkProcess2 = function (N, cur, E, res, arr) {
  if (arr[cur][res] !== -1) return arr[cur][res];

  if (res === 0) {
    if (cur === E) arr[cur][res] = 1;
    else arr[cur][res] = 0;
  } else if (cur === 1) {
    arr[cur][res] = robotWalkProcess2(N, cur + 1, E, res - 1, arr);
  } else if (cur === N) {
    arr[cur][res] = robotWalkProcess2(N, cur - 1, E, res - 1, arr);
  } else arr[cur][res] = robotWalkProcess2(N, cur + 1, E, res - 1, arr) + robotWalkProcess2(N, cur - 1, E, res - 1, arr);
  return arr[cur][res];
};

let robotWalk2 = function (N, S, E, K) {
  // 注意tips：js初始化二维数组
  let arr = new Array(N + 1);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(K + 1).fill(-1);
  }
  return robotWalkProcess2(N, S, E, K, arr);
};

// console.log(robotWalk2(3, 1, 3, 2));

/**
 * 严格表结构 o(k*n)
 */

/**
 * 题目给定一个正数数组，如[2,3,7,2,3,9,5],给定一个M，问从数组中取几个数，加起来和等于M，问有多少种取法
 */
let add2M = function (arr, m) {
  return add2MProcess(arr, 0, 0, m);
};

let add2MProcess = function (arr, i, pre, m) {
  if (i === arr.length) {
    if (pre === m) return 1;
    else return 0;
  }
  return add2MProcess(arr, i + 1, pre, m) + add2MProcess(arr, i + 1, pre + arr[i], m);
};

// 问有最少取几个数
// 暴力
let add2MMinNum = function (arr, m) {
  return add2MMinNumProcess(arr, 0, m);
};
let add2MMinNumProcess = function (arr, i, rest) {
  if (rest < 0) {
    return -1;
  }
  if (rest === 0) {
    return 0;
  }
  if (i >= arr.length) {
    return -1;
  }
  let a = add2MMinNumProcess(arr, i + 1, rest);
  let b = add2MMinNumProcess(arr, i + 1, rest - arr[i]);
  if (a === -1 && b === -1) {
    return -1;
  }
  if (a === -1) return 1 + b;
  if (b === -1) return a;
  return Math.min(a, 1 + b);
};

// console.log(add2MMinNum([2, 3, 7, 2, 3, 9, 5], 10));

// 问有最少取几个数
// 记忆化搜索
// 两个可变参数，i，rest，做二维表
// 注意tips: === =一定要区别开
let add2MMinNum2 = function (arr, m) {
  let dp = new Array(arr.length); // 二维表，i番位0 arr.length-1（到arr.length也可以）;rest范围 0到m
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(m + 1).fill(-2);
  }
  return add2MMinNumProcess2(arr, 0, m, dp);
};
let add2MMinNumProcess2 = function (arr, i, rest, dp) {
  if (rest < 0) {
    return -1;
  }
  if (i >= arr.length) {
    return -1;
  }
  if (dp[i][rest] !== -2) return dp[i][rest];
  if (rest === 0) {
    dp[i][rest] = 0;
    return 0;
  }
  let a = add2MMinNumProcess2(arr, i + 1, rest, dp);
  let b = add2MMinNumProcess2(arr, i + 1, rest - arr[i], dp);
  if (a === -1 && b === -1) {
    dp[i][rest] = -1;
    // return dp[i][rest];
  } else if (a === -1) {
    dp[i][rest] = 1 + b;
    // return dp[i][rest];
  } else if (b === -1) {
    dp[i][rest] = a;
    // return dp[i][rest];
  } else dp[i][rest] = Math.min(a, 1 + b);
  return dp[i][rest];
};

// console.log(add2MMinNum2([2, 3, 7, 2, 3, 9, 5], 10));

// 严格表
let add2MMinNum3 = function (arr, m) {
  let dp = new Array(arr.length + 1); // 二维表，i范围0 arr.length;rest范围 0到m
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(m + 1).fill(-2);
  }

  for (let i = 0; i < dp.length; i++) {
    dp[i][0] = 0;
  }

  for (let j = 1; j <= m; j++) {
    dp[arr.length][j] = -1;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    for (let j = 1; j <= m; j++) {
      let a, b;
      if (j - arr[i] < 0) b = -1;
      else {
        b = dp[i + 1][j - arr[i]];
      }
      a = dp[i + 1][j];

      if (a === -1 && b === -1) dp[i][j] = -1;
      else if (a === -1) dp[i][j] = b + 1;
      else if (b === -1) dp[i][j] = a;
      else dp[i][j] = Math.min(a, b + 1);
    }
  }
  return dp[0][m];
};

// console.log(add2MMinNum3([2, 3, 7, 2, 3, 9, 5], 10));

/**
 * 全排列无重复值
 * @param {*} nums
 * @returns
 */
var permute = function (nums) {
  debugger;
  let result = [];
  let rest = new Array(nums.length).fill(0); // 没有使用过的位置标0，使用过标1
  let curr = [];
  process(nums, result, rest, curr);
  return result;
};

var process = function (nums, result, rest, path) {
  if (path.length === nums.length) {
    result.push(path.slice(0));
    return;
  }
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === 0) {
      rest[i] = 1;
      path.push(nums[i]);
      process(nums, result, rest, path);
      path.pop(); // 注意要恢复
      rest[i] = 0;
    }
  }
  return;
};

// 全排列有重复值
var permuteUnique = function (nums) {
  let result = [];
  let path = [];
  let used = new Array(nums.length).fill(0);
  // 排序，便于后续去重
  nums.sort((a, b) => a - b);
  process(nums, result, used, path);
  return result;
};

var process = function (nums, result, used, path) {
  if (path.length === nums.length) {
    // tips:.length不要漏写
    result.push(path.slice(0)); // 注意拷贝
    return;
  }
  for (let i = 0; i < used.length; i++) {
    if (used[i] === 1) continue;
    // 若当前数跟上一个数相等，且上一个数没用，则跳过处理，永远排在先出现的相同的数的后面
    // tips: >= 0！！！！！不是>0
    if (i - 1 >= 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue; // tips：注意区别continue还是break(return);tips:注意此处判断条件，!used[i-1]
    path.push(nums[i]);
    used[i] = 1;
    process(nums, result, used, path);
    path.pop(); // 注意恢复
    used[i] = 0; // 注意恢复
  }
};
// console.log(permuteUnique([3, 3, 0, 3]));

/**
 * leetcode567 字符串的排列
 * 给你两个字符串 s1 和 s2 ，写一个函数来判断 s2 是否包含 s1 的排列。如果是，返回 true ；否则，返回 false 。

换句话说，s1 的排列之一是 s2 的 子串 
 * @param {} s1 
 * @param {*} s2 
 * @returns 
 */
var checkInclusion = function (s1, s2) {
  debugger;
  if (s1.length > s2.length) return false;
  let arr1 = new Array(26).fill(0);
  let arr2 = new Array(26).fill(0);

  // 统计s1词频
  for (let i = 0; i < s1.length; i++) {
    let v = s1.charCodeAt(i) - 'a'.charCodeAt(0);
    arr1[v] = arr1[v] + 1;
  }

  // 统计s2 0-s1.length - 1 上的词频
  for (let r = 0; r < 0 + s1.length; r++) {
    let v = s2.charCodeAt(r) - 'a'.charCodeAt(0);
    arr2[v] = arr2[v] + 1;
  }
  if (equal(arr1, arr2)) return true;
  // 窗口后移
  for (let l = 1, r = l + s1.length - 1; r < s2.length; l++, r++) {
    let vpre = s2.charCodeAt(l - 1) - 'a'.charCodeAt(0);
    let v = s2.charCodeAt(r) - 'a'.charCodeAt(0);
    arr2[vpre] = arr2[vpre] - 1;
    arr2[v] = arr2[v] + 1;
    if (equal(arr1, arr2)) return true;
  }
  return false;
};

var equal = function (arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

// console.log(checkInclusion('adc', 'dcda'));
