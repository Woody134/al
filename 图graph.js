class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  parent(i) {
    return ((i + 1) >>> 1) - 1;
  }
  left(i) {
    return (i << 1) + 1;
  }
  right(i) {
    return (i + 1) << 1;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[0];
  }
  push(...values) {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[0] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > 0 && this._greater(node, this.parent(node))) {
      this._swap(node, this.parent(node));
      node = this.parent(node);
    }
  }
  _siftDown() {
    let node = 0;
    while (
      (this.left(node) < this.size() && this._greater(this.left(node), node)) ||
      (this.right(node) < this.size() && this._greater(this.right(node), node))
    ) {
      let maxChild =
        this.right(node) < this.size() && this._greater(this.right(node), this.left(node)) ? this.right(node) : this.left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

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
//
let data4 = [
  [100, 'A', 'B'],
  [100, 'B', 'A'],
  [2, 'A', 'C'],
  [2, 'C', 'A'],
  [10, 'A', 'D'],
  [10, 'D', 'A'],
  [50, 'B', 'C'],
  [50, 'C', 'B'],
  [6, 'B', 'E'],
  [6, 'E', 'B'],
  [3, 'C', 'E'],
  [3, 'E', 'C'],
  [10, 'E', 'D'],
  [10, 'D', 'E'],
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
const graph4 = createGraph(data4);

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
// sortedTopology2(graph3);

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

/**
 * 并查集结构（连通存在两个集合连起来的情况）
 */
class MySets {
  constructor(nodes) {
    this.NodesSetMap = new Map();
    nodes.forEach((node) => {
      let set = new Set();
      set.add(node.value);
      this.NodesSetMap.set(node.value, set);
    });
  }
  /**
   * nodeA nodeB是否在同一个set中
   */
  isInSameSet(nodeAValue, nodeBValue) {
    let setA = this.NodesSetMap.get(nodeAValue);
    let setB = this.NodesSetMap.get(nodeBValue);
    return setA === setB;
  }

  /**
   * 合并nodeA nodeB所在的set
   */
  union(nodeAValue, nodeBValue) {
    let setA = this.NodesSetMap.get(nodeAValue);
    let setB = this.NodesSetMap.get(nodeBValue);
    // let unionSet = new Set(setA);
    for (let nodeValue of setB) {
      setA.add(nodeValue);
      this.NodesSetMap.set(nodeValue, setA); // 不要忘记变更setB中每个点对应的map
    }
  }
}

/**
 * 1. K kruskal 算法
 */
function kruskalMST(graph) {
  let edges = graph.edges;
  let nodes = graph.nodes;
  let nodesSets = new MySets(nodes);
  let edgesArr = [...edges];
  let result = new Set();
  edgesArr.sort((a, b) => a.weight - b.weight);
  for (let edge of edgesArr) {
    if (!nodesSets.isInSameSet(edge.from, edge.to)) {
      result.add(edge);
      nodesSets.union(edge.from, edge.to);
      // 区分node和nodeValue(edge.from,edge.to)
    }
  }
  return result;
}

// console.log(kruskalMST(graph2));

/**
 * 2. P prim 算法
 * 初始所有边都没有被解锁，任选一个点，挑一个属于该点的最小的边，将连着的点拉进来；连着这两个点的边中找一个最小的，且可以拉新点进来的边。。。
 * （连通不存在两个集合连起来的情况，不需要集合，用哈希表即可）
 */
// todo 7详解blabla 1:50 https://www.bilibili.com/video/BV13g41157hK?p=9&vd_source=b89b387b8770a0b69ddab591194bd329
function primMST(graph) {
  let nodeBegin;
  let priorEdges = new PriorityQueue((a, b) => {
    // console.log('a:', a);
    // console.log('b:', b);
    a.weight <= b ? b.weight : Number.MAX_VALUE;
  });
  let nodesValueSet = new Set();
  let edgesSet = new Set();
  let resultEdges = new Set();

  for (let node of graph.nodes.values()) {
    nodeBegin = node;
    nodesValueSet.add(nodeBegin.value);
    for (let edge of nodeBegin.edges) {
      // if (!edgesSet.has(edge)) {
      priorEdges.push(edge);
      edgesSet.add(edge);
      // }
    }
    break;
  }

  while (nodesValueSet.size < graph.nodes.size) {
    let minEdge = priorEdges.pop();
    console.log('minEdge:', minEdge);
    while (nodesValueSet.has(minEdge.to) && priorEdges.size() > 0) {
      minEdge = priorEdges.pop();
      console.log('priorEdges:', priorEdges);
      console.log('minEdge:', minEdge);
    }
    if (priorEdges.size() === 0) {
      return false;
    }

    resultEdges.add(minEdge);
    nodesValueSet.add(minEdge.to);
    let toNode = graph.nodes.get(minEdge.to);
    for (let edge of toNode.edges) {
      // if (!edgesSet.has(edge)) {
      priorEdges.push(edge);
      // }
    }
  }
  return resultEdges;
}

// console.log(primMST(graph2));
/**
 * Dijkstra 算法 start
 * 单元最短路径算法，适用于没有权值为负数的边
 *  7详解blabla 2:10 https://www.bilibili.com/video/BV13g41157hK?p=9&vd_source=b89b387b8770a0b69ddab591194bd329
 *
 */
function dijkstra(nodeStart, graph) {
  let distansMap = new Map();
  distansMap.set(nodeStart.value, {
    distance: 0,
    list: [nodeStart.value],
    isLocked: false,
  });
  let nodeValue = getMinDistanceNodeInRest(distansMap);
  // for (let nodeValue of distansMap.keys()) {// 错误，需要getMinDistanceNodeInRest
  while (nodeValue) {
    let node = graph.nodes.get(nodeValue);
    let distanc2Node = distansMap.get(nodeValue);
    for (let edge of node.edges.values()) {
      if (!distansMap.has(edge.to) || distanc2Node.distance + edge.weight < distansMap.get(edge.to).distance) {
        distansMap.set(edge.to, {
          distance: distanc2Node.distance + edge.weight,
          list: distanc2Node.list.concat(edge.to),
          isLocked: distansMap.has(edge.to) ? distansMap.get(edge.to).isLocked : false,
        });
      }
    }
    nodeValue = getMinDistanceNodeInRest(distansMap);
  }
  return distansMap;
}

function getMinDistanceNodeInRest(distansMap) {
  let nodeValue = null;
  let minDistance = Number.MAX_VALUE;
  for (let [nV, nVInfo] of distansMap) {
    // console.log(JSON.stringify(nV), JSON.stringify(nVInfo));
    if (nVInfo.isLocked) continue;
    if (nVInfo.distance < minDistance) {
      nodeValue = nV;
      minDistance = nVInfo.distance;
    }
  }
  if (nodeValue) {
    // debugger;
    nVInfo = distansMap.get(nodeValue);
    nVInfo.isLocked = true;
  }
  // console.log(nodeValue);
  return nodeValue;
}

let nodeStartForDijkstra;
for (let node of graph4.nodes.values()) {
  nodeStartForDijkstra = node;
  break;
}
console.log(dijkstra(nodeStartForDijkstra, graph4));
// Dijkstra 算法 end
