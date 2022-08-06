/**
 * 扁平化组织架构JSON数据转嵌套
 */
/**
 * 1.一个部门JSON数据中，属性名是部门id，属性值是个部门成员id数组集合，现在要把有部门的成员id都提取到一个数组集合中
 */
const deps = {
  采购部: [1, 2, 3],
  人事部: [5, 8, 12],
  行政部: [5, 14, 79],
  运输部: [3, 64, 105],
};
let member = Object.values(deps).flat(Infinity);

// console.log(member);

/**
 * 2.
 * 树状结构
 * source = [
{
  id: 1,
  name: "X公司",
  pid: 0, // 父级id
  children: [
    {
      id: 2,
      name: "技术部",
      pid: 1,
      children: [],
    },
    {
      id: 3,
      name: "人力资源部",
      pid: 1,
      children: [
        {
          id: 4,
          pid: 3,
          name: "招聘组",
        },
      ],
    },
  ],
},
];
 * 扁平结构
 * source = [
    {id: 1, name: 'X公司', pid: 0},
    {id: 2, name: '技术部', pid: 1},
    {id: 3, name: '人力资源部', pid: 1},
    {id: 4, name: '招聘组', pid: 3},
] 
 * 相互转化
 */
let flatSource = [
  { id: 1, name: 'X公司', pid: 0 },
  { id: 2, name: '技术部', pid: 1 },
  { id: 3, name: '人力资源部', pid: 1 },
  { id: 4, name: '招聘组', pid: 3 },
];

let treeSource = [
  {
    id: 1,
    name: 'X公司',
    pid: 0, // 父级id
    children: [
      {
        id: 2,
        name: '技术部',
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: '人力资源部',
        pid: 1,
        children: [
          {
            id: 4,
            pid: 3,
            name: '招聘组',
          },
        ],
      },
    ],
  },
];

/**
 * treeToFlat
 * 递归
 */
function treeToFlat(tree) {
  let result = [];
  treeToFlatProcess(tree, result);
  console.log(result);
}

function treeToFlatProcess(tree, result) {
  tree.forEach(({ id, name: name1, pid, children }) => {
    result.push({ id, name: name1, pid });
    children && treeToFlatProcess(children, result);
  });
  return;
}

// treeToFlat(treeSource);

/**
 * flatToTree
 * 借助两个map，第一遍遍历建立起两个map
 * 再遍历map建立起树形结构
 */
function flatToTree(flat) {
  let parentChildrenMap = new Map();
  let idObjMap = new Map();
  let result;
  flat.forEach(({ id, name: name1, pid }) => {
    if (!parentChildrenMap.has(pid)) {
      parentChildrenMap.set(pid, [id]);
    } else {
      parentChildrenMap.get(pid).push(id);
    }
    idObjMap.set(id, { id, name: name1, pid });
    if (pid === 0) result = idObjMap.get(id);
  });
  for (const [pid, cidArry] of parentChildrenMap) {
    if (pid === 0) continue;
    const pobj = idObjMap.get(pid);
    for (const cid of cidArry) {
      const cobj = idObjMap.get(cid);
      if (!pobj.children) pobj.children = [];
      pobj.children.push(cobj);
    }
  }
  return result;
}

// console.log(flatToTree(flatSource));

// Manacher算法
var getManacherString = function (str) {
  if (str === null || str.length < 1) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    // result.concat('#');
    // result.concat(str[i]);
    // tips注意 concat padEnd都不修改原字符串
    result = result.padEnd(result.length + 1, '#');
    result = result.padEnd(result.length + 1, str[i]);
  }
  // result.concat('#');
  result = result.padEnd(result.length + 1, '#');
  return result;
};

var longestPalindrome = function (s) {
  debugger;
  if (s === null || s.length < 1) return '';
  let str = getManacherString(s);
  let maxlenth = Number.NEGATIVE_INFINITY; // 当前最长回文序列长度
  let maxIndex = -1; // 当前最长回文序列中心位置
  let R = -1; // 回文右边界加一的位置
  let C = -1; // 得到R值的回文序列终点位置
  let pArr = []; // 回文半径数组

  for (let i = 0; i < str.length; i++) {
    // 当前位置的不用再匹配的半径
    pArr[i] = i < R ? Math.min(pArr[2 * C - i], R - i) : 1;

    // 向外匹配拓展pArr[i]
    while (i - pArr[i] >= 0 && i + pArr[i] < str.length && str[i + pArr[i]] === str[i - pArr[i]]) {
      pArr[i]++;
    }

    // 更新R,C
    if (pArr[i] + i > R) {
      R = pArr[i] + i;
      C = i;
    }
    // 更新maxlenth,maxIndex
    if (pArr[i] > maxlenth) {
      maxlenth = pArr[i];
      maxIndex = i;
    }
  }

  // 取最长回文子串
  let realStart = Math.floor((maxIndex - maxlenth + 1) / 2);
  let real2R = maxlenth - 1;
  return s.slice(realStart, realStart + real2R);
};

// console.log(longestPalindrome('babad'));

var maxSumMinProduct = function (nums) {
  // 计算数组左右最近的，比当前值小的index
  let stack = []; // 栈底到栈顶由小到大
  let result = new Map(); // key:index value: 最近的比当前元素小的坐标[l,r];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length !== 0 && nums[i] < nums[stack[stack.length - 1][0]]) {
      let curr = stack.pop();
      let l = -1;
      if (stack.length - 1 >= 0) {
        let arr = stack[stack.length - 1];
        l = arr[arr.length - 1];
      }
      let r = i;
      for (let j = 0; j < curr.length; j++) {
        result.set(curr[j], [l, r]);
      }
    }
    if (stack.length === 0 || nums[stack[stack.length - 1][0]] !== nums[i]) stack.push([i]);
    else stack[stack.length - 1].push(i);
  }

  while (stack.length > 0) {
    curr = stack.pop();
    let r = nums.length;
    let l = 0;
    if (stack.length - 1 >= 0) {
      let arr = stack[stack.length - 1];
      l = arr[arr.length - 1];
    }
    for (let j = 0; j < curr.length; j++) {
      result.set(curr[j], [l, r]);
    }
  }

  // 算最小乘积
  let max = 0;
  let maxIndex = -1;
  for (let i = 0; i < nums.length; i++) {
    let [l, r] = result.get(i);
    let sum = getSum(nums, l, r); // 求和，不包括l,r
    let product = sum * nums[i];
    // max = Math.max(max, product);
    if (product > max) {
      max = product;
      maxIndex = i;
    }
  }

  return maxIndex;
};

// todo
// kmp manancher等算法
