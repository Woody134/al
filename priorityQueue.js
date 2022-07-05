function queueElement(value, priority) {
  this.value = value;
  this.priority = priority;
}
// 封装优先队列
function priorityQueue() {
  // 声明队列
  let queue = [];
  // 入队
  this.enqueue = function (value, priority) {
    // 声明入队的元素
    let ele = new queueElement(value, priority);
    // console.log(ele);
    // 当前元素是否已经入队
    flag = false;
    // 入队
    // 队列为空直接入队
    if (this.listsize() == 0) {
      queue.push(ele);
      flag = true;
      // console.log(queue);
    }
    // 队列不为空，判断优先级，插入到正确位置
    else {
      for (let i = 0; i < queue.length; i++) {
        if (ele.priority > queue[i].priority) {
          queue.splice(i, 0, ele);
          flag = true;
          break;
        }
      }
      if (!flag) {
        queue.push(ele);
        flag = true;
      }
    }
  };
  // 出队
  this.shift = function () {
    return queue.shift();
  };
  // 获取队首元素
  this.front = function () {
    console.log('队首元素：' + queue[0].value);
  };
  // 获取队列长度
  this.listsize = function () {
    return queue.length;
  };
  // 清空队列
  this.clearlist = function () {
    queue = [];
  };
  // 打印队列元素
  this.print = function () {
    for (let i = 0; i < queue.length; i++) console.log('优先级：' + queue[i].priority + '  ' + queue[i].value);
  };
}
