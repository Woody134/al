/*
 * 冒泡排序：相邻比较，小的往前放
 * 时间复杂度 O(n²) 稳定
 */
function bubbleSort(array) {
  if (!array || array.length < 2) {
    return array;
  }
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // 注意j的终点，逐渐往前，大值随着i确定越来越多
      if (array[j + 1] < array[j]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  return array;
}
