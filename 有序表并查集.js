/**
 * 岛问题
 * https://www.bilibili.com/video/BV13g41157hK?p=13&vd_source=b89b387b8770a0b69ddab591194bd329
 * 一个矩阵只有0 1两种值，每个位置都可以和自己的左右上下四个位置相连，如果有一片1连在一起，这个部分叫做一个岛，求一个矩阵中有多少个岛
 * 举例：
 * 001010
 * 111010
 * 100100
 * 000000
 * 这个矩阵中有三个岛
 * 进阶：如何设计一个并行算法解决这个问题，很少会遇到，逻辑讲清楚即可 分片+结果合起来
 */
function countIslands(arr) {
  if (arr === null || arr[0] === null) {
    return 0;
  }
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 1) {
        count++;
        infectProcess(arr, i, j);
      }
    }
  }
  return count;
}

function infectProcess(arr, i, j) {
  let hasNeighbor = false; // 没用
  arr[i][j] = 2;
  // 上
  if (i - 1 >= 0 && arr[i - 1][j] === 1) {
    // 边界条件，大于等于0
    arr[i - 1][j] = 2; // 赋值和相等要区别开
    hasNeighbor = true;
    infectProcess(arr, i - 1, j);
  }
  // 下
  if (i + 1 < arr.length && arr[i + 1][j] === 1) {
    arr[i + 1][j] = 2;
    hasNeighbor = true;
    infectProcess(arr, i + 1, j);
  }
  // 左
  if (j - 1 >= 0 && arr[i][j - 1] === 1) {
    arr[i][j - 1] = 2;
    hasNeighbor = true;
    infectProcess(arr, i, j - 1);
  }
  // 右
  if (j + 1 < arr[0].length && arr[i][j + 1] === 1) {
    arr[i][j + 1] = 2;
    hasNeighbor = true;
    infectProcess(arr, i, j + 1);
  }
  return;
}

let arr = [
  [0, 0, 1, 0, 1, 0],
  [1, 1, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0],
];
