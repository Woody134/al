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

  insert(node) {
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
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

list9 = new LinkedList();
list9.append(1);
list9.append(2);
list9.append(3);
list9.append(4);
node1 = new Node(10);
list9.insert(node1);
list9.append(5);
list9.append(6);
list9.append(7);
list9.append(8);
list9.append(9);
list9.append(10);
list9.insert(node1);

// console.log('list3:', isPalindromeList(list3));
// console.log('list4:', isPalindromeList(list4));
// console.log('list5:', isPalindromeList(list5));
// console.log('list6:', isPalindromeList(list6));
// console.log('list7:', isPalindromeList(list7));
// console.log('list8:', isPalindromeList(list8));

/**
 * 面试解法3:要求若链表长度为N，时间复杂度O(N),空间复杂度O(1)
 * 快慢指针走，快指针走到底，慢指针边走边逆序
 * 1->2<-3
 * 1->2->2<-3
 */
function isPalindromeList2(list) {
  let f = (s = list.head);
  while (f && f.next) {
    s = s.next;
    f = f.next.next;
  }
  let reverHalfListHead = reverse(s);
  let tail = reverHalfListHead;
  let head = list.head;
  for (; head && tail; ) {
    console.log(head.value, tail.value);
    if (head.value !== tail.value) {
      reverse(reverHalfListHead);
      return false;
    }
    head = head.next;
    tail = tail.next;
  }
  reverse(reverHalfListHead);
  return true;
}

function reverse(listHead) {
  let pre = null;
  let p = listHead;
  for (; p; ) {
    let next = p.next;
    p.next = pre;
    pre = p;
    p = next;
  }
  return pre;
}

// console.log('list3:', isPalindromeList2(list3));
// console.log('list4:', isPalindromeList2(list4));
// console.log('list5:', isPalindromeList2(list5));
// console.log('list6:', isPalindromeList2(list6));
// console.log('list7:', isPalindromeList2(list7));
// console.log('list8:', isPalindromeList2(list8));

/**
 * 题目2：将单链表按某值划分成左边小，中间等，右边大的形式
 * 方法1：压进栈里，分三类弹出，三个list，再串起来
 */
function threePartList(list, num) {
  let head = list.head;
  let arr = [];
  for (; head; head = head.next) {
    arr.push(head.value);
  }
  let less = new LinkedList();
  let more = new LinkedList();
  let equal = new LinkedList();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < num) {
      less.append(arr[i]);
    } else if (arr[i] === num) {
      equal.append(arr[i]);
    } else {
      more.append(arr[i]);
    }
  }
  let lessP = less.head;
  let equalP = equal.head;
  let moreP = more.head;
  let resultHead = null;
  resultHead = lessP || equalP || moreP;
  let p = resultHead;
  while (lessP && lessP.next) {
    p.next = lessP.next;
    lessP = lessP.next;
    p = p.next; // 注意：务必记得移动指针
  }
  p === equalP && equalP ? (equalP = equalP.next) : '';
  while (equalP) {
    p.next = equalP;
    equalP = equalP.next;
    p = p.next;
  }
  p === moreP && moreP ? (moreP = moreP.next) : '';
  while (moreP) {
    p.next = moreP;
    moreP = moreP.next;
    p = p.next;
  }
  for (p = resultHead; p; p = p.next) {
    console.log(p.value);
  }
  return resultHead;
}

// console.log(threePartList(list3, 4));
// console.log(2);

/**
 * 方法二，直接拆成三个链表，再串起来
 */
function threePartList2(list, num) {
  let lessHead = null;
  let lessTail = null;
  let equalHead = null;
  let equalTail = null;
  let moreHead = null;
  let moreTail = null;
  let head = list.head;
  while (head) {
    if (head.value < num) {
      if (!lessHead) {
        lessHead = head;
      } else {
        lessTail.next = head;
      }
      lessTail = head;
    } else if (head.value === num) {
      if (!equalHead) {
        equalHead = head;
      } else {
        equalTail.next = head;
      }
      equalTail = head;
    } else {
      if (!moreHead) {
        moreHead = head;
      } else {
        moreTail.next = head;
      }
      moreTail = head;
    }
    head = head.next;
  }

  // 三个串起来
  // 注意给endTail.next赋值null
  let resultHead = null;
  resultHead = lessHead || equalHead || moreHead;
  lessTail && (equalHead || moreHead) ? (lessTail.next = equalHead || moreHead) : lessTail ? (lessTail.next = null) : '';
  equalTail && moreHead ? (equalTail.next = moreHead) : equalTail ? (equalTail.next = null) : '';
  moreTail ? (moreTail.next = null) : '';
  for (let p = resultHead; p; p = p.next) {
    console.log(p.value);
  }
  return resultHead;
}

// console.log(threePartList2(list8, 2));

/**
 * 题目3：特殊含有random指针的Node,复制
 * 方法1：用哈希表，key旧节点，value新节点，第一次遍历复制节点；第二次遍历根据哈希表，把ranom指针加上
 * 方法2: 第一遍遍历节点，新节点插在旧节点后面；第二遍，新节点random指针指向旧节点指针的next；第三遍，分离新旧节点
 * 方法二链表位置的一一对应，相当于哈希表的作用
 */

/**
 * 题目：两个链表相交的一系列问题
 * 题目4：判断一个链表是否有环，有环返回第一个入环节点，否则返回null
 * 方法1：使用额外数据结构,遍历，set，第一个重复的
 * 方法2：快慢指针
 */
function getFirstCircleNode(list) {
  if (!list.head || !list.head.next || !list.head.next.next) {
    return null;
  }
  let s = list.head.next;
  let f = list.head.next.next;
  while (f && s !== f) {
    s = s.next;
    f = f.next.next;
  }
  if (!f) return null;
  f = list.head;
  while (s !== f) {
    s = s.next;
    f = f.next;
  }
  return f;
}

console.log(getFirstCircleNode(list9));
console.log(getFirstCircleNode(list8));

/**
 * 题目：两个链表相交的一系列问题
 * 题目5：给定两个可能有环也可能无环的单链表，头节点head1、head2，请实现一个函数，若两个链表相交，返回第一个相交节点，否则返回null
 * 要求时间复杂度o(N),空间复杂度o(1)
 */
function getTwoListFirstSameNode(list1, list2) {
  let list1Length = 0;
  let list2Length = 0;
  let p = null;
  let q = null;
  let list1FirstCircleNode = getFirstCircleNode(list1);
  let list2FirstCircleNode = getFirstCircleNode(list2);

  if((list1FirstCircleNode && !list2FirstCircleNode) ||(!list1FirstCircleNode && list2FirstCircleNode)) return null;

  // 都无环
  if(!list1FirstCircleNode && !list2FirstCircleNode) {
    for(p = list1.head;p.next;p=p.next) {
      list1Length++;
    }
    for(q = list2.head;q.next;q=q.next) {
      list2Length++;
    }
  
    if(p && p === q) {
      let n = list2Length-list1Length;
      let p = list1.head;
      let q = list2.head;
      for(let i = 0; i< (n + Math.abs(-n))/2;i++){

      }

      for(let i = 0; i< (n + Math.abs(n))/2;)
    }
  }



}
