/*
 * 选择排序：遍历一圈，最小的和前面的第一个无序的交换
 * 时间复杂度 O(n²) 不稳定
 */
function selectionSort(array) {
  if (!array || array.length < 2) {
    return array;
  }
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      minIndex = array[minIndex] > array[j] ? j : minIndex;
    }

    // const temp  = array[minIndex];
    // array[minIndex] = array[i];
    // array[i] = temp;

    // 异或运算交换两个不等的数
    // 不等再交换，否则会得到0
    if (array[minIndex] !== array[i]) {
      array[i] = array[i] ^ array[minIndex];
      array[minIndex] = array[i] ^ array[minIndex];
      array[i] = array[i] ^ array[minIndex];
    }
  }
  return array;
}

function selectionSort(arr) {
  if (arr === null) return arr;
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i; // 注意minindex每轮初始值是i,不是0
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
  }
  return arr;
}
