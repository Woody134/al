/**
 * 桶排序
 * 假定数字都是小于1000的正数
 */
function bucketSort(arr) {
  let buckets = Array(10)
    .fill(null)
    .map(() => []);
  for (let r = 10; r <= 1000; r *= 10) {
    buckets = buckets.map(() => []);
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i], r, Math.floor((arr[i] % r) / (r / 10)));
      buckets[Math.floor((arr[i] % r) / (r / 10))].push(arr[i]);
    }
    arr = [];
    for (let i = 0; i < buckets.length; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        arr.push(buckets[i][j]);
      }
    }
  }
  return arr;
}
console.log(bucketSort([20, 16, 301, 892, 21, 69, 3, 10, 1, 8]));
