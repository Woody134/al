/**
 * 堆排序
 * 知识点：大根堆，小根堆
 * 下标i节点的左子元素： 2*i+1; 右子元素 2*i+2; 用heapsize限制判断是否有子元素
 * 父元素下标：Math.floor((i-1)/2), 0父元素还是0
 */
/**
 * 堆插入
 */
function heapInsert(arr, heapsize, num) {
  let i = heapsize;
  arr[i] = num;
  for (let parentP = Math.floor((i - 1) / 2); arr[parentP] < arr[i]; ) {
    [arr[i], arr[parentP]] = [arr[parentP], arr[i]];
    i = parentP;
    parentP = Math.floor((i - 1) / 2);
  }
  return arr;
}
// console.log(heapInsert([9, 6, 4, 5, 1, 3], 6, 8));
/**
 * heapify
 */
function heapify(arr, heapsize, i) {
  for (let L = 2 * i + 1; L < heapsize; ) {
    let bigP = L + 1 < heapsize ? (arr[L + 1] > arr[L] ? L + 1 : L) : L;
    if (arr[bigP] > arr[i]) {
      [arr[i], arr[bigP]] = [arr[bigP], arr[i]];
      i = bigP;
      L = 2 * i + 1;
    } else {
      break;
    }
  }
  return arr;
}

// console.log(heapify([3, 6, 4, 5, 1, 2], 6, 0));
/**
 * 堆排序
 * 方法1，依次插入heapInsert，构建大根堆；依次取出，对0位置heapify
 */
function heapSort(arr) {
  if (!arr || arr.length < 2) {
    return arr;
  }
  for (let heapsize = 1; heapsize < arr.length - 1; heapsize++) {
    heapInsert(arr, heapsize, arr[heapsize]);
  }
  console.log('heapinsert大根堆:', arr);
  for (let heapsize = arr.length - 1; heapsize >= 0; heapsize--) {
    [arr[0], arr[heapsize]] = [arr[heapsize], arr[0]];
    heapify(arr, heapsize, 0);
  }
  return arr;
}

// console.log(heapSort([3, 6, 4, 5, 1, 2]));

/**
 * 堆排序
 * 方法2，倒序依次heapify,构建大根堆；依次取出，对0位置heapify
 * 理解，第一步为什么可以构建大根堆
 * 时间复杂度O(NlogN)，不稳定
 */
function heapSort2(arr) {
  if (!arr || arr.length < 2) {
    return arr;
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    heapify(arr, arr.length, i);
  }
  console.log('heapify大根堆:', arr);
  for (let heapsize = arr.length - 1; heapsize >= 0; heapsize--) {
    [arr[0], arr[heapsize]] = [arr[heapsize], arr[0]];
    heapify(arr, heapsize, 0);
  }
  return arr;
}
// console.log(heapSort2([3, 6, 4, 5, 1, 2]));

/**
 * 堆排序扩展题目：
 * 一个几乎有序的数字，若把数组排序，每个元素移动的距离不超过k，且k相对数组长度来说比较小，请选择一个合适的排序算法对该数组进行排序
 */
function sort(arr, k) {
  for (let i = 0; i + k < arr.length; i++) {
    arr.splice(i, k + 1, ...heapSort2(arr.slice(i, i + k + 1)));
  }
  return arr;
}

console.log(sort([1, 2, 3, 0, 8, 9, 5, 6, 7], 4));
