/*
简明解释
默认 a[0] 为已排序数组中的元素，从 arr[1] 开始逐渐往已排序数组中插入元素，从后往前一个个比较，如果待插入元素小于已排序元素，则已排序元素往后移动一位，直到待插入元素找到合适的位置并插入已排序数组。
经过 n - 1 次这样的循环插入后排序完毕。
属性

稳定
适合场景：对快要排序完成的数组时间复杂度为 O(n)
非常低的开销
时间复杂度 O(n²)
稳定

 */
// 基础写法
// function insertionSort(arr) {
//   if (!arr || arr.length < 2) {
//     return arr;
//   }
//   for (let i = 1; i < arr.length; i++) {
//     let n = arr[i];
//     for (let j = i - 1; j >= 0; j--) {
//       if (n < arr[j]) {
//         arr[j + 1] = arr[j];
//       } else {
//         arr[j + 1] = n;
//         break;
//       }
//     }
//   }
//   return arr;
// }

// 二分
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

// console.log(binarySearchFirstEqualMore([1, 2, 3], 0, 0, 2));

// 二分写法 todo
function binarySearchInsertionSort(arr) {
  if (!arr || arr.length < 2) {
    return arr;
  }
  for (let i = 1; i < arr.length; i++) {
    let index = binarySearchFirstEqualMore(arr, arr[i], 0, i - 1);
    let num = arr[i];
    for (let j = i; j > index; j--) {
      arr[j] = arr[j - 1];
    }
    arr[index] = num;
  }
  return arr;
}

console.log(binarySearchInsertionSort([2, 6, 7, 2, 9, 1, 0, 10]));

function insertionSort(arr) {
  if (arr === null) return arr;
  for (let i = 1; i < arr.length; i++) {
    let n = arr[i];
    let j = i - 1;
    for (; j >= 0; j--) {
      if (arr[j] > n) arr[j + 1] = arr[j];
      else {
        break;
      }
    }
    arr[j] = n;
  }
  return arr;
}
