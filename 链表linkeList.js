/**
 * Node类
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * 链表类
 */
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = this.head;
    this.length = 0;
  }

  append(value) {
    const node = new Node(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  prepend(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    this.length++;
  }
}

/**
 * 打印两个有序链表的相同值部分
 * list1 1->5->7->8->12->13
 * list2 5->6->9->12
 * 打印 5 12
 */

function printSamePartInTwoList(list1, list2) {
  let p = list1.head;
  let q = list2.head;
  let result = [];
  for (; p && q; ) {
    if (p.value === q.value) {
      result.push(p.value);
      p = p.next;
      q = q.next;
    } else if (p.value < q.value) p = p.next;
    else q = q.next;
  }
  return result;
}

list1 = new LinkedList();
list1.append(1);
list1.append(5);
list1.append(7);
list1.append(8);
list1.append(12);
list1.append(13);

list2 = new LinkedList();
list2.append(5);
list2.append(6);
list2.append(9);
list2.append(12);

// console.log(printSamePartInTwoList(list1, list2));

/**
 * 重要技巧：
 * 1.额外数据结构记录（哈希表、数组等容器）
 * 2.快慢指针
 */

/**
 * 题目1：判断一个单链表是否是回文结构
 * 笔试遇到：
 * 1.遍历一遍放进栈里，栈依次弹出（Math.ceil(n/2))，比较是否一样
 * 2.后面一半入栈：快慢指针，2倍快指针到尾时，慢指针后位置开始入栈
 */
function isPalindromeList(list) {
  if (list.head === null) {
    return true;
  }
  let f = list.head;
  let s = list.head;
  while (f && f.next) {
    s = s.next;
    f = f.next.next;
  }
  let buff = [];
  while (s) {
    buff.push(s.value);
    s = s.next;
  }
  let p = list.head;
  while (buff.length) {
    if (buff.pop() !== p.value) return false;
    p = p.next;
  }
  return true;
}

list3 = new LinkedList();

list4 = new LinkedList();
list4.append(1);

list5 = new LinkedList();
list5.append(1);
list5.append(3);
list5.append(1);

list6 = new LinkedList();
list6.append(1);
list6.append(1);
list6.append(2);

list7 = new LinkedList();
list7.append(1);
list7.append(2);
list7.append(2);
list7.append(1);

list8 = new LinkedList();
list8.append(1);
list8.append(2);
list8.append(3);
list8.append(1);

console.log('list3:', isPalindromeList(list3));
console.log('list4:', isPalindromeList(list4));
console.log('list5:', isPalindromeList(list5));
console.log('list6:', isPalindromeList(list6));
console.log('list7:', isPalindromeList(list7));
console.log('list8:', isPalindromeList(list8));

/**
 * 面试解法3:要求若链表长度为N，时间复杂度O(N),空间复杂度O(1)
 * 快慢指针走，快指针走到底，慢指针边走边逆序
 * 1->2<-3
 * 1->2->2<-3
 */
// function isPalindromeList2(list) {
//   let f = (s = list.head);
//   while (f & f.next) {
//     s = s.next;
//     f = f.next.next;
//   }
//   let m = s;
//   let p = s.next;
// }

// function reverse(list) {
//   if (!list.head || !list.head.next) return;
//   let pre = list.head;
//   let p = pre.next;
//   pre.next = null;
//   let q = p.next;
//   for (; p; ) {
//     p.next = pre;
//     p = q;
//   }
// }
