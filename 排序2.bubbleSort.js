/*
 * 选择排序：相邻比较，小的往前放
 * 时间复杂度 O(n²) 稳定
 */
function bubbleSort(array) {
  if (!array || array.length < 2) {
    return array;
  }
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i; j < array.length - 1; j++) {
      if (array[j + 1] < array[j]) {
        array[j + 1] = array[j + 1] ^ array[j];
        array[j] = array[j + 1] ^ array[j];
        array[j + 1] = array[j + 1] ^ array[j];
      }
    }
  }
  return array;
}
