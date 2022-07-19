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

console.log(flatToTree(flatSource));
