/**
 * 希尔排序，插入排序的改进版，克服了插入排序只能移动一个相邻位置的缺陷
 */
function shellSort(arr) {
  if (!arr || arr.length < 2) return arr;
  let gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      let num = arr[i];
      for (let j = i; j >= gap; j -= gap) {
        if (num < arr[j - gap]) {
          arr[j] = arr[j - gap];
        } else {
          arr[j] = num;
          break; // break不要忘记
        }
      }
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}

console.log(shellSort([0, 3, 5, 2, 1, 1, 8]));
