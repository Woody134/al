/**
 * 归并排序
 * 递归
 * 时间复杂度 O(nlogn) 稳定
 * 思路：左侧有序，右侧有序，再merge（谁小，拉下来谁进辅助空间）
 * 注意递归的返回值，求啥，返回啥，在递归函数中声明赋值，每次递归都会重新声明赋值
 * P4 35:00 https://www.bilibili.com/video/BV13g41157hK?p=4&vd_source=b89b387b8770a0b69ddab591194bd329
 */
/**
 * 归并排序
 */
function mergeSort(arr) {
  process(arr, 0, arr.length - 1);
  return arr;
}

// 使arr在l到r上有序
function process(arr, l, r) {
  if (l >= r) {
    return;
  }
  // 注意是Math.floor，不是round
  let mid = Math.floor(l + (r - l) / 2);
  process(arr, l, mid);
  process(arr, mid + 1, r);
  merge(arr, l, r, mid);
}

function merge(arr, l, r, mid) {
  let result = [];
  let i = l,
    j = mid + 1;
  for (; i <= mid && j <= r; ) {
    result.push(arr[i] <= arr[j] ? arr[i++] : arr[j++]);
  }
  for (; i <= mid; ) {
    result.push(arr[i++]);
  }
  for (; j <= r; ) {
    result.push(arr[j++]);
  }
  for (i = l; i <= r; i++) {
    arr[i] = result[i - l];
  }
}

/**
 * 小和问题
 * p4 1:24 https://www.bilibili.com/video/BV13g41157hK?p=4&vd_source=b89b387b8770a0b69ddab591194bd329
 */

function mergeSum(arr) {
  return lessSum(arr, 0, arr.length - 1);
}

function lessSum(arr, l, r) {
  if (l >= r) {
    return 0;
  }
  //let sum = 0; // 错误，注意递归中这里每次都重新赋值了，没办法拿到递归累加的值
  let mid = Math.floor(l + (r - l) / 2);
  return lessSum(arr, mid + 1, r) + lessSum(arr, l, mid) + merge2(arr, l, mid, r);
}

function merge2(arr, l, mid, r) {
  if (l >= r) {
    return 0;
  }
  let i,
    j,
    sum = 0;
  let result = [];
  for (i = l, j = mid + 1; i <= mid && j <= r; ) {
    if (arr[i] < arr[j]) {
      sum += arr[i] * (r - j + 1);
      result.push(arr[i++]);
    } else {
      result.push(arr[j++]);
    }
  }
  for (; i <= mid; ) {
    result.push(arr[i++]);
  }
  for (; j <= r; ) {
    result.push(arr[j++]);
  }
  for (i = l; i <= r; i++) {
    arr[i] = result[i - l];
  }
  return sum;
}

/**
 * 逆序对问题
 * 在一个数组中，左边的数比右边（不一定相邻）的数大，这两个数构成一个逆序对，请打印所有的逆序对
 */
function reverseCP(arr) {
  return reverseProcess(arr, 0, arr.length - 1);
}

function reverseProcess(arr, l, r) {
  if (l >= r) {
    return 0;
  }
  let mid = Math.floor(l + (r - l) / 2);
  return reverseProcess(arr, l, mid) + reverseProcess(arr, mid + 1, r) + mergeCP(arr, l, mid, r);
}

function mergeCP(arr, l, m, r) {
  if (l >= r) {
    return 0;
  }
  let i, j;
  let result = [];
  let count = 0;
  for (i = l, j = m + 1; i <= m && j <= r; ) {
    if (arr[i] > arr[j]) {
      console.log(arr[i], arr[j]);
      result.push(arr[j++]);
      count++;
    } else {
      result.push(arr[i++]);
    }
  }
  for (; i <= m; ) {
    result.push(arr[i++]);
  }
  for (; j <= r; ) {
    result.push(arr[j++]);
  }
  for (i = l; i <= r; i++) {
    arr[i] = result[i - l];
  }
  return count;
}
