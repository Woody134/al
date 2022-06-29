/**
 * 快排
 */

/**
 * 荷兰国旗问题
 * 把一个数组，分为按小于某数，等于某数，大于某数排列
 * p4 1:57 https://www.bilibili.com/video/BV13g41157hK?p=4&vd_source=b89b387b8770a0b69ddab591194bd329
 */
function dutchFlagProblem(arr, num) {
  if (!arr || arr.length < 2) {
    return arr;
  }
  let l = -1; // 小于区右边界
  let r = arr.length; // 大于区左边界
  for (let i = 0; i < r; ) {
    if (arr[i] < num) {
      // arr[i] < num 当前元素和小于区下一个元素交换，小于区右扩，当前i++
      [arr[i], arr[l + 1]] = [arr[l + 1], arr[i]];
      i++;
      l++;
    } else if (arr[i] === num) {
      // arr[i] === num 当前i++
      i++;
    } else {
      // arr[i] > num 当前元素和大于区前一个元素交换，大于区左扩，当前i不变，因为换过来的元素没有处理过
      [arr[i], arr[r - 1]] = [arr[r - 1], arr[i]];
      r--;
    }
  }
  return arr;
}

/**
 * 快排1.0
 * 最后一个数，做num,开始划分；小于等于区，大于区，重复，搞定num的位置
 * 最坏时间复杂度O(N2),num打偏
 */
/**
 * 快排2.0
 * 最后一个数，做num,开始划分；小于区，等于区，大于区，重复，搞定值等于num的位置
 * 最坏时间复杂度O(N2),num打偏
 */
/**
 * 快排3.0
 * 随机选一个数，跟最后位置一个数交换，做num,开始划分；小于区，等于区，大于区，重复，搞定值等于num的位置
 * 最坏时间复杂度O(NlogN),num打偏
 * 不稳定
 * p4 2:21 https://www.bilibili.com/video/BV13g41157hK?p=4&vd_source=b89b387b8770a0b69ddab591194bd329
 */
function quickSort(arr) {
  quickSortProcess(arr, 0, arr.length - 1);
  return arr;
}

function quickSortProcess(arr, l, r) {
  if (!arr || arr.length < 2 || l >= r) return arr;
  let [lessP, moreP] = partation(arr, l, r);
  quickSortProcess(arr, l, lessP);
  quickSortProcess(arr, moreP, r);
}

function partation(arr, l, r) {
  // 区别好r,arr.length-1,moreP
  if (l >= r) return arr;
  // 注意random的算法
  let random = Math.random();
  random = Math.floor(random * (r - l + 1) + l);
  [arr[random], arr[r]] = [arr[r], arr[random]];
  let lessP = l - 1,
    moreP = r + 1;
  let num = arr[r];
  for (let i = l; i < moreP; ) {
    if (arr[i] < num) {
      [arr[i], arr[lessP + 1]] = [arr[lessP + 1], arr[i]];
      lessP++;
      i++;
    } else if (arr[i] === num) {
      i++;
    } else if (arr[i] > num) {
      [arr[i], arr[moreP - 1]] = [arr[moreP - 1], arr[i]];
      moreP--;
    }
  }
  return [lessP, moreP];
}
