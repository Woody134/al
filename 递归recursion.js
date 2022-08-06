/**
 * 递归
 * master 公式
 */

/**
 * 题目1：求arr, l, r
 */

/**
 * 题目2：汉诺塔问题
 */
function hanno(n) {
  hannoProcess(0, n, 'from', 'to', 'other');
}

function hannoProcess(start, end, from, to, other) {
  if (end - start <= 1) {
    console.log(start, from, to);
    return;
  }
  hannoProcess(start, end - 1, from, other, to);
  hannoProcess(end - 1, end, from, to, other);
  hannoProcess(start, end - 1, other, to, from);
}

// hanno(3);

/**
 * 题目3：打印一个字符串的所有字集，包括空集
 */
function subSet(str) {
  subSetProcess(str.split(''), 0, []);
}

function subSetProcess(strArray, i, res) {
  if (i === strArray.length) {
    console.log(res);
    return;
  }
  let resA = new Array(...res);
  resA.push(strArray[i]);
  subSetProcess(strArray, i + 1, resA);
  let resB = new Array(...res);
  subSetProcess(strArray, i + 1, resB);
}

// subSet('sddsasad');

/**
 * 题目4：打印一个字符串的全部排列
 */
function subArrange(str) {
  // debugger;
  strArray = str.split('');
  subArrangeProcess([], strArray);
}

let count = 0;

function subArrangeProcess(result, resStrArray) {
  if (resStrArray.length === 0) {
    count = count + 1;
    console.log(result);
    console.log(count);

    return;
  }
  resStrArray.forEach((item, i) => {
    const tempArray = resStrArray.slice();
    tempArray.splice(i, 1);
    const itemResult = new Array(...result);
    itemResult.push(item);
    subArrangeProcess(itemResult, tempArray);
  });
}

// subArrange('sddsasad');

/**
 * 题目4变形升级：打印一个字符串的全部排列，并且要求不出现重复的排列
 * 方法自己的
 */
function subSingleArrange(str) {
  // debugger;
  strArray = str.split('');
  subSingleArrangeProcess([], strArray, new Set());
}

function subSingleArrangeProcess(result, resStrArray, resSet) {
  if (resStrArray.length === 0) {
    const resStr = result.join('');
    if (!resSet.has(resStr)) {
      console.log(resStr);
      resSet.add(resStr);
      count = count + 1;
      console.log(count);
      return;
    }
    return;
  }
  resStrArray.forEach((item, i) => {
    const tempArray = resStrArray.slice();
    tempArray.splice(i, 1);
    const itemResult = new Array(...result);
    itemResult.push(item);
    subSingleArrangeProcess(itemResult, tempArray, resSet);
  });
}

// subSingleArrange('aab');

/**
 * 题目4变形升级：打印一个字符串的全部排列，并且要求不出现重复的排列
 * 方法优化，26个字母，存一个是否处理过某字符的长度为26的数组，处理过用1，没处理用0
 */

/**
 * 题目5 一个数组，代表一列纸牌，玩家a,b都绝顶聪明，可以从最左或最右拿纸牌，累积数值和大的赢，并且都会拿最优方式（可以看到每一张的值），求拿完后的结果。
 * P11 1:20:00 https://www.bilibili.com/video/BV13g41157hK?p=11&vd_source=b89b387b8770a0b69ddab591194bd329
 */
function abChoosePoker(arr) {
  console.log(firstChoose(arr, 0, arr.length - 1));
}

function firstChoose(arr, l, r) {
  if (l === r) {
    return arr[l];
  }
  let left = arr[l] + secondChoose(arr, l + 1, r);
  let right = arr[r] + secondChoose(arr, l, r - 1);
  return Math.max(left, right);
}

function secondChoose(arr, l, r) {
  if (l === r) {
    return 0;
  }
  let firstLeft = firstChoose(arr, l + 1, r);
  let firstRight = firstChoose(arr, l, r - 1);
  return Math.min(firstLeft, firstRight);
}

// abChoosePoker([1, 2, 100, 4]);

/**
 * 题目6 给你一个栈，不能申请额外的数据结构，只能使用递归，逆序这个栈
 * P11 1:32:00 https://www.bilibili.com/video/BV13g41157hK?p=11&vd_source=b89b387b8770a0b69ddab591194bd329
 */

// 烂橘子
var orangesRotting = function (grid) {
  let loopCount = 0;
  let m = grid.length;
  let n = grid[0].length;
  let arr = []; //存每轮需要感染中心点左边对[[i,j],[i,j]]，记得更新，存一个num?
  let freshNum = 0;
  let badNum = 0;
  let hasInfect = true;
  // 第一轮遍历
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) freshNum++;
      else if (grid[i][j] === 2) arr.push([i, j]);
    }
  }

  // 有新鲜橘子，没有腐烂橘子，永远不会全腐烂，返回-1
  badNum = arr.length;
  if (freshNum > 0 && arr.length === 0) return -1;

  while (hasInfect) {
    loopCount++;
    [hasInfect, freshNum, arr] = infect(grid, arr, freshNum);
  }
  return freshNum > 0 ? -1 : loopCount - 1;
};

// arr[i,j] 感染ij周围的，感染了至少一个返回true,否则返回flase
var infect = function (grid, arr, freshnum) {
  let hasInfect = false;
  let m = grid.length;
  let n = grid[0].length;
  let arrTemp = arr.slice(0);
  arr = [];
  while (arrTemp.length) {
    let [i, j] = arrTemp.pop();

    if (i - 1 >= 0 && grid[i - 1][j] === 1) {
      hasInfect = true;
      grid[i - 1][j] = 2;
      freshnum--;
      arr.push([i - 1, j]);
    }
    if (j - 1 >= 0 && grid[i][j - 1] === 1) {
      grid[i][j - 1] = 2;
      hasInfect = true;
      freshnum--;
      arr.push([i, j - 1]);
    }
    if (i + 1 < m && grid[i + 1][j] === 1) {
      grid[i + 1][j] = 2;
      hasInfect = true;
      freshnum--;
      arr.push([i + 1, j]);
    }
    if (j + 1 < n && grid[i][j + 1] === 1) {
      grid[i][j + 1] = 2;
      hasInfect = true;
      freshnum--;
      arr.push([i, j + 1]);
    }
  }
  return [hasInfect, freshnum, arr];
};

console.log(
  orangesRotting([
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1],
  ])
);
