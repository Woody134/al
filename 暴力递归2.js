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
