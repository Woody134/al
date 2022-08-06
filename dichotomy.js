/**
 * 题目1：一个有序数组中，找到某个数的位置，不存在返回-1
 * P3 1:32 https://www.bilibili.com/video/BV13g41157hK?p=3&vd_source=b89b387b8770a0b69ddab591194bd329
 */
function binarySearchEqual(arr, num) {
  if (!arr) {
    return -1;
  }
  for (let l = 0, r = arr.length - 1; l <= r; ) {
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] === num) return mid;
    if (arr[mid] < num) l = mid + 1;
    if (arr[mid] > num) r = mid - 1;
  }
  return -1;
}

/**
 * 题目2：一个有序数组中，给定一个数，找到数组中第一个>=该数的位置，不存在返回-1
 * P3 1:32 https://www.bilibili.com/video/BV13g41157hK?p=3&vd_source=b89b387b8770a0b69ddab591194bd329
 */
function binarySearchMoreOrEqual(arr, num) {
  if (!arr) {
    return -1;
  }
  let mid, l, r;
  for (l = 0, r = arr.length - 1; l < r; ) {
    mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] < num) l = mid + 1;
    if (arr[mid] >= num) r = mid;
  }
  if (arr[r] >= num) return r;
  else return -1;
}

// for 插入排序
function binarySearchFirstEqualMore(arr, num, s, e) {
  let l = s,
    r = e;
  for (; l < r; ) {
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] < num) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return arr[r] < num ? r + 1 : r;
}

/**
 * 题目3：局部最小值问题
 * 一个无序数组，任何相邻两数不相等，求一个局部最小的位置，时间复杂度好于O(N);
 * P3 1:42 https://www.bilibili.com/video/BV13g41157hK?p=3&vd_source=b89b387b8770a0b69ddab591194bd329
 */
function localMinima(arr) {
  if (!arr) {
    return -1;
  }
  if (arr.length < 2) {
    return 1;
  }
  let l = 0,
    r = arr.length - 1;
  if (arr[0] < arr[1]) return 0;
  if (arr[arr.length - 1] < arr[arr.length - 2]) return arr.length - 1;
  for (l = 0, r = arr.length - 1; l <= r; ) {
    mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] < arr[mid + 1] && arr[mid] < arr[mid - 1]) return mid;
    if (arr[mid] > arr[mid - 1]) r = mid - 1;
    if (arr[mid] > arr[mid + 1]) l = mid + 1;
  }
  return null;
}

// 寻找峰值
var findPeakElement = function (nums) {
  debugger;
  let length = nums.length;

  let l = 0,
    r = length - 1;

  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if ((mid === length - 1 || nums[mid] > nums[mid + 1]) && (mid = 0 || nums[mid] > nums[mid - 1])) return mid;
    if (nums[mid] < nums[mid - 1]) r = mid - 1;
    else l = mid + 1;
  }
  return l;
};

// console.log(findPeakElement([1, 2, 3, 1]));

var findMin = function (nums) {
  debugger;
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if ((mid === 0 || nums[mid] < nums[mid - 1]) && (mid === nums.length - 1 || nums[mid] < nums[mid + 1])) return nums[mid];
    if (nums[mid] > nums[mid - 1]) l = mid + 1;
    else r = mid - 1;
  }
  return nums[r];
};

console.log(findMin([4, 5, 6, 7, 0, 1, 2]));
