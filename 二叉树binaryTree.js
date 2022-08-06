class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
/**
 *         5
 *      3     8
 *   2  4   7  10
 * 1       6   9 11
 */

function getBT() {
  let head = new Node(5);
  head.left = new Node(3);
  head.right = new Node(8);
  // head.left.left = new Node(2);
  // head.left.right = new Node(4);

  // head.left.left.left = new Node(1);
  head.right.left = new Node(7);
  head.right.left.left = new Node(6);
  head.right.right = new Node(10);
  head.right.right.left = new Node(9);
  head.right.right.right = new Node(11);
  return head;
}
const root = getBT();
/**
 *         5
 *      3     8
 *   2  4    7  10
 * 1|2 12|13 6|10 9|11
 */
function getBT2() {
  let head = new Node(5);
  head.left = new Node(3);
  head.right = new Node(8);
  head.left.left = new Node(2);
  head.left.right = new Node(4);

  head.left.left.left = new Node(1);
  head.left.left.right = new Node(2);

  head.left.right.left = new Node(12);
  head.left.right.right = new Node(13);

  head.right.left = new Node(7);
  head.right.right = new Node(10);

  head.right.left.left = new Node(6);
  head.right.left.right = new Node(10);

  head.right.right.left = new Node(9);
  head.right.right.right = new Node(11);
  return head;
}
const root2 = getBT2();

/**
 * 二叉树遍历1：递归遍历
 * 二叉树的递归序，递归遍历二叉树，第一次，（左边）第二次，（右边）第三次来到当前节点，没个节点都会来到三次
 * 先序：头左右 第一次来到当前节点就打印
 * 中序：左中右 第二次来到当前节点
 * 后序：左右中 第三次来到当前节点
 */
function recursiveTraversal(root) {
  if (!root) return;
  recursiveTraversal(root.left);
  recursiveTraversal(root.right);
}

function firstRecursiveTraversal(root) {
  if (!root) return;
  console.log(root.value);
  firstRecursiveTraversal(root.left);
  firstRecursiveTraversal(root.right);
}

function middleRecursiveTraversal(root) {
  if (!root) return;
  middleRecursiveTraversal(root.left);
  console.log(root.value);
  middleRecursiveTraversal(root.right);
}

function lastRecursiveTraversal(root) {
  if (!root) return;
  lastRecursiveTraversal(root.left);
  lastRecursiveTraversal(root.right);
  console.log(root.value);
}

// lastRecursiveTraversal(root);

/**
 * 二叉树遍历2：非递归遍历
 */
/**
 * 先序：中左右
 * 头节点进栈
 * 弹出打印
 * 压右，压左如果有
 * 循环
 */
function first(head) {
  if (!head) return;
  let stack = [head];
  while (stack.length) {
    let i = stack.pop();
    console.log(i.value);
    if (i.right) stack.push(i.right);
    if (i.left) stack.push(i.left);
  }
}

// first(root);
/**
 * 中序：左中右
 * 头节点进栈
 * 有左压左，一直压
 * 无左弹出，打印
 * 弹出的有右压一个右，循环
 * 循环
 */
function middle(head) {
  if (!head) return;
  let stack = [head];
  while (stack.length > 0) {
    if (head && head.left) {
      stack.push(head.left);
      head = head.left;
    } else {
      let i = stack.pop();
      console.log(i.value);
      head = null; // 用head标记需要判断有左子树的节点
      if (i.right) {
        stack.push(i.right);
        head = i.right;
      }
    }
  }
}
// middle(root);

/**
 * 后序：左右中(先序不打印，压进收集栈)
 * 头节点进栈，
 * 弹出进收集栈，压左压右
 * 循环
 */
function last(head) {
  if (!head) return;
  let stack = [head];
  let collectStack = [];
  while (stack.length) {
    let i = stack.pop();
    if (i.left) stack.push(i.left);
    if (i.right) stack.push(i.right);
    collectStack.push(i);
  }
  while (collectStack.length) {
    let i = collectStack.pop();
    console.log(i.value);
  }
}
// last(root);

/**
 * 宽度优先遍历
 * 宽度遍历用队列,压头节点
 * 弹出，打印，压左压右
 */
function widthTraversal(head) {
  if (!head) return;
  let queue = [head];
  while (queue.length) {
    let i = queue.shift();
    console.log(i.value);
    if (i.left) queue.push(i.left);
    if (i.right) queue.push(i.right);
  }
}

// widthTraversal(root);

/**
 * 宽度优先遍历,求最大宽度
 * 注意map的使用
 * let levelMap = new Map();
 * 属性：
 * levelMap.size
 * 方法：
 * levelMap.set(head, 1);
 * levelMap.get(i)
 * wrongMap.has('bla')
 * wrongMap.delete('bla')
 * wrongMap.clear('bla')
 * 遍历方法：
 */
function width(head) {
  if (!head) return 0;
  let queue = [head];
  let levelMap = new Map();
  levelMap.set(head, 1);
  let curLevel = 1;
  let curNum = 0;
  let Max = 0;
  while (queue.length) {
    let i = queue.shift();
    // console.log(i.value);
    if (levelMap.get(i) === curLevel) {
      curNum++;
    } else {
      Max = Math.max(Max, curNum);
      curLevel = levelMap.get(i);
    }
    if (i.left) {
      queue.push(i.left);
      levelMap.set(i.left, ++curLevel);
    }
    if (i.right) {
      queue.push(i.right);
      levelMap.set(i.right, ++curLevel);
    }
  }
  return Max;
}

/**
 * 不用哈希表
 */
function width2(head) {
  if (!head) return 0;
  let queue = [head];
  let curEndNode = head;
  let nextEndNode = null;
  let curLevel = 1;
  let curNum = 0;
  let Max = 0;
  while (queue.length) {
    let i = queue.shift();
    // console.log(i.value);
    if (i.left) {
      queue.push(i.left);
      nextEndNode = i.left;
    }
    if (i.right) {
      queue.push(i.right);
      nextEndNode = i.right;
    }
    if (i === curEndNode) {
      curNum++;
      Max = Math.max(Max, curNum);
      curNum = 0;
      curLevel++;
      curEndNode = nextEndNode;
      nextEndNode = null;
    } else {
      curNum++;
    }
  }
  return Max;
}
// console.log(width(root));

// console.log(width2(root));

/**
 * 判断一棵树是否是搜索二叉树
 * 搜索二叉树：左树比根小，右数比根大
 * 方法1：中序遍历，升序则是搜索二叉树
 */
let pre = Number.MIN_VALUE;
function isSearchBinaryTree(head) {
  if (!head) return true;
  let leftIsSearchBinaryTree = isSearchBinaryTree(head.left);
  if (head.value < pre) {
    return false;
  } else {
    pre = head.value;
  }
  let rightIsSearchBinaryTree = isSearchBinaryTree(head.right);
  return leftIsSearchBinaryTree && rightIsSearchBinaryTree;
}
/**
 * 方法2：套路 信息左树{is, max} 右树 {is, min} => {is,min,max}
 */
function isSearchBinaryTree2(head) {
  return isSearchBinaryTree2Process(head).is;
}
function isSearchBinaryTree2Process(head) {
  // debugger;
  if (!head) {
    return {
      is: true,
      min: Number.MAX_VALUE,
      max: Number.MIN_VALUE,
    };
  }
  let leftR = isSearchBinaryTree2Process(head.left);
  let rightR = isSearchBinaryTree2Process(head.right);
  return {
    is: leftR.max <= head.value && head.value <= rightR.min,
    min: Math.min(leftR.min, head.value, rightR.min),
    max: Math.max(leftR.max, head.value, rightR.max),
  };
}

// console.log(isSearchBinaryTree(root));
// console.log(isSearchBinaryTree2(root));

/**
 * 判断一棵树是否是完全二叉树
 * 完全二叉树：前面都是满的，后面可以不满
 * 方法：宽度遍历 1）若一个节点有右无左，false 2)前面节点不双全，后面节点有子节点，false
 */
function isFBT(head) {
  if (!head) return true;
  let queue = [head];
  let beginUnFull = false;
  while (queue.length) {
    let i = queue.shift();
    if (beginUnFull) {
      if (i.left || i.right) return false;
    } else {
      if (!i.left && i.right) return false;
      if (!i.left || !i.right) beginUnFull = true;
      i.left && queue.push(i.left);
      i.right && queue.push(i.right);
    }
  }
  return true;
}

// console.log(isFBT(root2));

/**
 * 二叉树的递归套路：
 * 树型dp（动态规划）
 * 我可以向左树要信息，可以向右数要信息
 * 确定要什么信息，确定信息结构体
 */
/**
 * 判断一棵树是否是平衡二叉树
 * 平衡二叉树：每一棵子树左右子树高度差不大于1
 */
function isBalanceBT(head) {
  return isBalanceBTProcess(head).isBalanced;
}
function isBalanceBTProcess(head) {
  if (!head) {
    return {
      isBalanced: true,
      height: 0,
    };
  }
  let leftR = isBalanceBTProcess(head.left);
  let rightR = isBalanceBTProcess(head.right);
  return {
    isBalanced: leftR.isBalanced && rightR.isBalanced && Math.abs(leftR.height - rightR.height) <= 1,
    height: Math.max(leftR.height, rightR.height) + 1,
  };
}

// console.log(isBalanceBT(root));

/**
 * 判断一棵树是否是满二叉树
 * 麻烦做法：节点个数N，最大深度l  N = 2的l次方 - 1
 * 方法2：二叉树的递归套路
 */
function isFullBT(head) {
  return isFullBTProcess(head).is;
}

function isFullBTProcess(head) {
  if (!head)
    return {
      is: true,
      level: 0,
    };
  let leftR = isFullBTProcess(head.left);
  let rightR = isFullBTProcess(head.right);
  return {
    is: leftR.is && rightR.is && leftR.level === rightR.level,
    level: Math.max(leftR.level, rightR.level) + 1,
  };
}
// console.log(isFullBT(root2));

var isSymmetric = function (root) {
  if (!root || !root.left || !root.right) return true;
  let stack = [];
  leftProcess(root.left, stack);
  return rightProcess(root.right, stack);
};

var leftProcess = function (root, stack) {
  if (!root) return;
  root.left && leftProcess(root.left, stack);
  !root.left && root.right && stack.push(null); // 用null补满
  stack.push(root);
  root.right && leftProcess(root.right, stack);
  !root.right && root.left && stack.push(null);
};

var rightProcess = function (root, stackL) {
  if (!root && stackL.length) return false;
  if (!root && !stackL.length) return true;
  root.left && rightProcess(root.left, stackL);
  if (!root.left && root.right && stackL.pop() !== null) {
    return false;
  }
  if (stackL.pop().value !== root.val) return false;
  root.right && rightProcess(root.right, stackL);
  if (!root.right && root.left && stackL.pop() !== null) {
    return false;
  }
};

// function getBTmmm() {
//   let head = new Node(1);
//   head.left = new Node(2);
//   head.right = new Node(2);
//   head.left.left = new Node(null);
//   head.left.right = new Node(3);
//   head.right.left = new Node(null);
//   head.right.right = new Node(3);
//   return head;
// }

// let bt = getBTmmm();
// console.log(isSymmetric(bt));

var isValidBST = function (root) {
  return process(root).is;
};

var process = function process(root) {
  if (!root) {
    return {
      is: true,
      min: Number.POSITIVE_INFINITY, // 注意min max
      max: Number.NEGATIVE_INFINITY,
    };
  }
  let left = process(root.left);
  let right = process(root.right);
  return {
    is: left.is && right.is && left.max < root.value && right.min > root.value,
    min: Math.min(left.min, root.value, right.min),
    max: Math.max(right.max, root.value, left.max),
  };
};

function getBTmmm() {
  let head = new Node(0);
  return head;
}

let bt = getBTmmm();

// console.log(isValidBST(bt));

var buildTree = function (preorder, inorder) {
  let indexMap = new Map();
  inorder.forEach((item, i) => {
    indexMap.set(item, i);
  });
  return process(preorder, inorder, indexMap, 0);
};

var process = function (preorder, inorder, indexMap, diff) {
  if (!preorder.length) return null;
  let head = new Node(preorder.shift());
  let index = indexMap.get(head.value) - diff;
  let index2 = inorder.indexOf(head.value);
  head.left = process(preorder.slice(0, index), inorder.slice(0, index), indexMap, 0);
  head.right = process(preorder.slice(index), inorder.slice(index + 1), indexMap, diff + index + 1);
  return head;
};

console.log(buildTree([1, 2, 3, 4], [1, 2, 3, 4]));
