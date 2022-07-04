/**
 * 图的表达方法多
 */
/**
 * 基本知识
 * 1.点集，边集
 * 2.有向图，无向图
 *
 * 邻接表法
 * 邻接矩阵法
 */
// 类定义
class Graph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Set();
  }
}

class Node {
  constructor(value) {
    this.value = value; // 编号
    this.in = 0; // 入度
    this.out = 0; // 出度
    this.nexts = new Set(); // 指出连接到的点
    this.edges = new Set(); // 属于点的边（从该点指出）
  }
}

class Edge {
  constructor(weight, from, to) {
    this.weight = weight;
    this.from = from;
    this.to = to;
  }
}

// 构建图
//[边权重,from,to]
let data = [
  [3, 1, 2],
  [1, 1, 4],
  [2, 3, 1],
  [6, 3, 2],
  [5, 4, 3],
];
let data2 = [
  [1, 'A', 'B'],
  [1, 'B', 'A'],
  [2, 'B', 'C'],
  [2, 'C', 'B'],
  [3, 'A', 'E'],
  [3, 'E', 'A'],
  [4, 'A', 'C'],
  [4, 'C', 'A'],
  [5, 'C', 'E'],
  [5, 'E', 'C'],
  [6, 'E', 'D'],
  [6, 'D', 'E'],
];
// 拓扑排序
let data3 = [
  [1, 'A', 'B'],
  [1, 'B', 'C'],
  [1, 'C', 'D'],
  [1, 'B', 'D'],
  [1, 'A', 'C'],
];
function createGraph(data) {
  const graph = new Graph();
  for (let [weight, from, to] of data) {
    let edge = new Edge(weight, from, to);
    graph.edges.add(edge);
    if (!graph.nodes.has(from)) {
      let node = new Node(from);
      graph.nodes.set(from, node);
    }
    if (!graph.nodes.has(to)) {
      let node = new Node(to);
      graph.nodes.set(to, node);
    }
    let fromNode = graph.nodes.get(from);
    let toNode = graph.nodes.get(to);
    fromNode.out++;
    fromNode.nexts.add(toNode);
    fromNode.edges.add(edge);
    toNode.in++;
  }
  return graph;
}
const graph = createGraph(data);
const graph2 = createGraph(data2);
const graph3 = createGraph(data3);

// console.log(graph3);
// console.log(graph2);
// console.log(createGraph(data));

/**
 * 题目1：图的宽度优先遍历BFS
 * (与树的宽度优先遍历的区别，可能有环，需要避免在环里绕，拿一个set记录遍历过的点)
 * 1.拿一个队列，找一个起点进队列, 进set
 * 2.弹出，遍历nexts节点，若不在set中，压队列，
 * 3.循环至队列为空
 */
function BFS(node) {
  if (!node) return;
  let queue = [node];
  let nodeSet = new Set();
  nodeSet.add(node);
  while (queue.length) {
    let node = queue.shift();
    console.log(node);
    for (let nextNode of node.nexts) {
      if (!nodeSet.has(nextNode)) {
        // 是对next节点判断，不是对原节点判断
        queue.push(nextNode);
        nodeSet.add(nextNode);
      }
    }
  }
}

// BFS(graph.nodes.get(1));
// BFS(graph2.nodes.get('A'));

/**
 * 题目2：图的深度优先遍历DFS
 * 1.拿一个栈
 */
// function DFS(node) {
//   if (!node) return;
//   let stack = [node];
//   let nodeSet = new Set();
//   nodeSet.add(node);
//   while (stack.length) {
//     let node = stack.pop();
//     console.log(node);
//     for (let nextNode of node.nexts) {
//       if (!nodeSet.has(nextNode)) {
//         stack.push(nextNode);
//         nodeSet.add(nextNode);
//       }
//     }
//   }
// }
// 7详解前缀树和贪心算法：55min
function DFS(node) {
  if (!node) return;
  let stack = [node];
  let nodeSet = new Set();
  nodeSet.add(node);
  console.log(node);
  while (stack.length) {
    let node = stack.pop();
    // console.log(node);
    for (let nextNode of node.nexts) {
      if (!nodeSet.has(nextNode)) {
        stack.push(node); // 注意
        stack.push(nextNode);
        nodeSet.add(nextNode);
        console.log(nextNode); // 注意
        break; // 注意
      }
    }
  }
}

// DFS(graph2.nodes.get('A'));

/**
 * 拓扑排序算法
 * A依赖[B,C,D] B依赖[C,D,E]... 不可以循环编译（A依赖B，B依赖A），求一个编译顺序
 * 有向图
 * 确实一个顺序，所有
 * 解法：
 * 1.找到一个入度为0的点，拿下来，从图中拿掉这个点及其影响
 * 循环
 */
// 可用但是破坏了原来的图，顺序可能也不是最好的
// function sortedTopology(graph) {
//   let queue = [];
//   while (graph.nodes.size) {
//     // for (let i in graph.nodes) { // 不能用for in遍历
//     graph.nodes.forEach((node, i) => {
//       if (node.in < 1) {
//         console.log(node);
//         for (let nextNode of node.nexts) {
//           nextNode.in--;
//         }
//         graph.nodes.delete(i);
//       }
//     });
//   }
// }

function sortedTopology2(graph) {
  let queue = [];
  let map = new Map();
  graph.nodes.forEach((node) => {
    if (node.in === 0) {
      queue.push(node);
    }
    map.set(node, node.in);
  });

  while (queue.length) {
    let node = queue.shift();
    console.log(node.value);
    for (let nextNode of node.nexts) {
      let nextNodeIn = map.get(nextNode) - 1;
      map.set(nextNode, nextNodeIn);
      if (nextNodeIn === 0) {
        queue.push(nextNode);
      }
    }
  }
}
// sortedTopology(graph3);
sortedTopology2(graph3);

/**
 * 生成最小生成树
 * 概念 最小生成树：对于无向图，保证所有点联通，且整体边的权值累加和最小的
 * 1. K算法
 * 2. P算法
 *
 */

/**
 * 1. K 算法
 * 从边上考虑，先看最小的边，且加上后不生成环，就加上
 * 关键点：怎么判断加上后会不会形成环，集合查询、集合合并
 * 并查集结构：集合查询、集合合并（todo）
 */

class MySets {
  constructor(nodes) {}
}
