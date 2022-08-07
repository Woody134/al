/**
 * 1.instanceof
 * 作用：判断一个实例是否是其父类或者祖先类型的实例。
 * 原理：instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype查找失败，返回 false
 */
let myInstanceOF = function (target, origin) {
  let t = target;
  while (t) {
    if (t.__proto__ === origin.prototype) {
      return true;
    }
    t = t.__proto__;
  }
  return false;
};
// console.log(myInstanceOF([1, 2, 3], Array));

/**
 * 2.new
 * 过程：创建一个新对象；将对象的隐式原型指向构造函数的显示原型；this指向该对象执行构造函数；若构造函数没有返回对象，默认返回this
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHi = function () {
  console.log('hi, 我是' + this.name);
};

// let p1 = new Person('yy', '20');
// p1.sayHi();

let MyNew = function () {
  let obj = {};
  let arg = [...arguments];
  let fn = arg.shift();
  obj.__proto__ = fn.prototype;
  let res = fn.apply(obj, arg);
  if (res && typeof res === 'object') {
    return res;
  }
  return obj;
};

// let p2 = MyNew(Person, 'hh', '16');
// p2.sayHi();
/**
 * js继承
 * 寄生组合继承todo
 */
function Parent(name) {
  this.name = name;
  this.say = () => {
    console.log('hi,我是' + this.name);
  };
}
Parent.prototype.play = () => {
  console.log('play');
};

function Children(name, hobby) {
  Parent.call(this);
  this.hobby = hobby;
}

Children.prototype = Object.create(Parent.prototype);
Children.prototype.constructor = Children;

/**
 * 3.promise promise.all promise.race promise.settled
 * todo
 */
const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

class MyPromise {
  // 构造函数接收一个回调
  constructor(executor) {
    this._status = STATUS.PENDING; // 状态，初值
    this._value = undefined; // 返回值
    this._resolveQueue = []; // resolve时触发的成功队列
    this._rejectQueue = []; // reject时触发的失败队列

    // 箭头函数固定this
    const resolve = (val) => {
      const run = () => {
        if (this._status !== STATUS.PENDING) return;
        this._status = STATUS.FULFILLED;
        this._value = val;

        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      };

      // setTimeout实现异步
      setTimeout(run);
    };

    // 同resolve，状态转换不同
    const reject = (val) => {
      const run = () => {
        if (this._status !== STATUS.PENDING) return;
        this._status = STATUS.REJECTED;
        this._value = val;

        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      };

      setTimeout(run);
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  /**
   * 实例方法then
   *
   * @param {*} onFulFIlled 成功回调
   * @param {*} onRejected 失败回调
   */
  then(onFulFilled, onRejected) {
    // 若then参数不是函数，则让值向下传递
    typeof onFulFilled !== 'function' ? (onFulFilled = (val) => val) : null;
    typeof onRejected !== 'function' ? (onRejected = (val) => val) : null;

    // then返回一个新的promise
    return new MyPromise((resolve, reject) => {
      const resolveFn = (val) => {
        try {
          // 若返回值为MyPromise，等待MyPromise状态变更，否则直接resolve
          // 如果回调函数结果是普通值 那么就resolve出去给下一个then链式调用  如果是一个promise对象（代表又是一个异步） 那么调用x的then方法 将resolve和reject传进去 等到x内部的异步 执行完毕的时候（状态完成）就会自动执行传入的resolve 这样就控制了链式调用的顺序
          const r = onFulFilled(val);
          r instanceof MyPromise ? r.then(resolve, reject) : resolve(r);
        } catch (err) {
          reject(err);
        }
      };

      const rejectFn = (val) => {
        try {
          const r = onRejected(val);
          r instanceof MyPromise ? r.then(resolve, reject) : resolve(r);
        } catch (err) {
          reject(err);
        }
      };

      this._resolveQueue.push(resolveFn);
      this._rejectQueue.push(rejectFn);
    });
  }

  catch(rejectFn) {
    return this.then(undefined, rejectFn);
  }

  finally(callback) {
    return this.then(
      (val) => MyPromise.resolve(callback().then(() => val)),
      (err) => {
        MyPromise.resolve(callback()).then(() => err);
      }
    );
  }

  static resolve(val) {
    return val instanceof MyPromise ? val : new MyPromise((resolve) => resolve(val));
  }

  static reject(err) {
    return new MyPromise((resolve, reject) => reject(val));
  }

  /**
   * 静态方法 all
   * @param {*} promiseArr promise数组
   */
  static all(promiseArr) {
    let result = [];
    let count = 0; // promise完成计数器
    return new MyPromise((resolve, reject) => {
      if (Object.prototype.toString.call(promiseArr) !== '[object Array]') {
        return reject(new TypeError('...'));
      }
      if (promiseArr.length < 1) {
        return resolve(result);
      }
      promiseArr.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (val) => {
            count++;
            result[i] = val;
            if (count === promiseArr.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p) => {
        MyPromise.resolve(p).then(
          (val) => resolve(val),
          (err) => reject(err)
        );
      });
    });
  }

  static allSettled(promiseArr) {
    return new MyPromise((resolve, reject) => {
      if (Object.prototype.toString.call(promiseArr) !== '[object Array]') {
        return reject(new TypeError('...'));
      }
      let len = promiseArr.length;
      // 如果传入的是一个空数组，那么就直接返回一个resolved的空数组promise对象
      if (len === 0) {
        return resolve([]);
      }
      let args = Array.prototype.slice.call(promiseArr);

      function resolvePromise(index, value) {
        if (value instanceof MyPromise) {
          const then = value.then;
          then.call(
            value,
            function (val) {
              args[index] = { status: STATUS.FULFILLED, value: val };
              checkIsSetteld();
            },
            function (e) {
              args[index] = { status: STATUS.REJECTED, reason: e };
              checkIsSetteld();
            }
          );
        } else {
          args[index] = { status: STATUS.FULFILLED, value: value };
          checkIsSetteld();
        }
      }

      // 计算当前是否所有的 promise 执行完成，执行完毕则resolve
      function checkIsSetteld() {
        len--;
        if (len === 0) {
          resolve(args);
        }
      }

      // 每个都执行resolvePromise
      for (let i = 0; i < promiseArr.length; i++) {
        resolvePromise(i, promiseArr[i]);
      }
    });
  }

  // 使用resolve实现
  // static allSettled(values) {
  //   let promises = [].slice.call(values)
  //   return new MyPromise((resolve, reject) => {
  //     let result = [], count = 0
  //     promises.forEach(promise => {
  //       MyPromise.resolve(promise).then(value=>{
  //         result.push({status: 'fulfilled', value})
  //       }).catch(err=>{
  //         result.push({status: 'rejected', value: err})
  //       }).finally(()=>{
  //         if(++count === promise.length) {
  //           resolve(result)
  //         }
  //       })
  //     })
  //   })
  // }
}

// promise 加载图片

// // 使用：
// let promise1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('promise1');
//   }, 2000);
// });

// let promise2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('promise2');
//   }, 1000);
// });

// MyPromise.all([promise1, promise2]).then((res) => {
//   console.log('all' + res);
// });

// MyPromise.race([promise1, promise2]).then((res) => {
//   console.log('race' + res);
// });

// MyPromise.allSettled([promise1, promise2]).then((res) => {
//   console.log('allSettled' + res);
// });

// 具有并行限制的promise调度器

/**
 * 4.AJAX
 * 创建 XMLHttpRequest 实例
   发出 HTTP 请求
   服务器返回 XML 格式的字符串
   JS 解析 XML，并更新局部页面
 */
function getXHR() {
  let xhr = null;
  if (XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (xhr === null) {
    throw new Error('XMLHttpRequest not support');
  }
  return xhr;
}

function httpRequest(method, url, headers, content) {
  return new Promise((resolve, reject) => {
    // 获取xmlHttp，open
    let xmlHttp = getXHR();
    xmlHttp.open(method, url, true);

    // 若有，设置请求头
    if (headers) {
      for (const headerKey in headers) {
        xmlHttp.setRequestHeader(headerKey, headers[headerKey]);
      }
    }

    // 设置回调
    xmlHttp.onreadstatechange(() => {
      if (xmlHttp.readState === 4) {
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status === 304) {
          try {
            const res = JSON.parse(xmlHttp.responseText);
            resolve(res);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('网络错误'));
        }
      }
    });

    // 发送
    if (content) {
      xmlHttp.send(content);
    } else {
      xmlHttp.send(null);
    }
  });
}

/**
 * 5.appaly,call,bind
 */

Function.prototype.myCall = function (context, ...arg) {
  if (!context) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this; //this指向调用call的函数
  // 执行函数并返回结果 相当于把自身作为传入的context的方法进行调用了
  return context[fn](...arg);
};

Function.prototype.myApply = function (context, arg) {
  if (!context) {
    context = window;
  }
  let fn = Symbol();
  context[fn] = this;
  return context[fn](...arg);
};

let printNameAndOthers = function (...arg) {
  let name = 'inside';
  console.log(this.name + arg.join('.'));
  function hh() {
    console.log('hh' + this.name);
  }
  let a = () => {
    console.log('hh' + this.name);
  };
  hh();
  a();
};

var name = 'windowName';
let yy = {
  name: 'yy',
};

// // 使用
// printNameAndOthers(1, 2, 3);
// printNameAndOthers.myApply(yy, [1, 2, 3]);
// printNameAndOthers.call(yy, 1, 2, 3);

Function.prototype.myBind = function (context, ...args) {
  if (!context) {
    context = window;
  }
  let fn = Symbol();
  context[fn] = this;
  let _this = this; // 指向调用myBind的函数
  const result = function (...innerArgs) {
    if (this instanceof _this) {
      // 使用new操作符进行构造函数调用,this指向result实例对象
      this[fn] = _this;
      this[fn](...[...args, ...innerArgs]);
    } else {
      // 普通调用
      context[fn](...[...args, ...innerArgs]);
    }
  };

  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用Object.create 创建一个新对象，使用现有对象作为新对象的原型
  result.prototype = Object.create(this.prototype);
  return result;
};
// 使用
// let yyprint = printNameAndOthers.myBind(yy);
// yyprint(1, 2, 3);
// function Person(name, age) {
//   console.log(name); //'我是参数传进来的name'
//   console.log(age); //'我是参数传进来的age'
//   console.log(this); //构造函数this指向实例对象
// }
// // 构造函数原型的方法
// Person.prototype.say = function () {
//   console.log(123);
// };
// let obj = {
//   objName: '我是obj传进来的name',
//   objAge: '我是obj传进来的age',
// };
// // 普通函数
// function normalFun(name, age) {
//   console.log(name); //'我是参数传进来的name'
//   console.log(age); //'我是参数传进来的age'
//   console.log(this); //普通函数this指向绑定bind的第一个参数 也就是例子中的obj
//   console.log(this.objName); //'我是obj传进来的name'
//   console.log(this.objAge); //'我是obj传进来的age'
// }

// let bindFun = Person.myBind(obj, '我是参数传进来的name');
// let a = new bindFun('我是参数传进来的age');
// a.say(); //123

// let bindFun = normalFun.myBind(obj, '我是参数传进来的name');
// bindFun('我是参数传进来的age');

/**
 * currying 柯里化
 * 把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，
 * 并且返回接受余下的参数而且返回结果的新函数的技术
 * 核心思想是把多参数传入的函数拆成单参数（或部分）函数，
 * 内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数
 */
function currying(fn, ...args) {
  const length = fn.length;
  let allArgs = [...args];
  const res = (...newArgs) => {
    allArgs = [...allArgs, ...newArgs];
    if (allArgs.length >= length) {
      return fn(...allArgs);
    } else {
      return res;
    }
  };
  return res;
}

// 用法如下：
// const add = (a, b, c) => a + b + c;
// const a = currying(add, 1);
// console.log(a(2, 3, 4));

/**
 * 6.compose
 */

let compose = function (...fns) {
  if (fns.length < 1) return (v) => v;
  if (fns.length === 1) {
    return (v) => fns[0](v);
  }
  return fns.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
};

// 用法如下:
// function fn1(x) {
//   return x + 1;
// }
// function fn2(x) {
//   return x + 2;
// }
// function fn3(x) {
//   return x + 3;
// }
// function fn4(x) {
//   return x + 4;
// }
// const a = compose(fn1, fn2, fn3, fn4);
// console.log(a(1)); // 1+4+3+2+1=11

/**
 * settimeout setinterval
 */
// 7.用setTimeout模拟setInterval
// setInterval缺点，queue里有interval待执行时，就不往里推了；可能连续执行
function myInterval(fn, t) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, t);
  }
  interval();
  return {
    cancel: () => {
      clearTimeout(timer);
      timer = null;
    },
  };
}
// 使用
// let a = myInterval(() => {
//   console.log(111);
// }, 1000);
// 用setInterval模拟setTimeout
function myTimeout(fn, t) {
  let timer = setInterval(() => {
    clearInterval(timer);
    timer = null;
    fn();
  }, t);
}

/**
 * 发布订阅 todo
 */

/**
 * 数组相关
 */
// 数组扁平化，多维数组扁平化为一位数组
// 方法arr.flat(Infinity)
// a.flat(Infinity);
// 方法1：利用reduce 递归
function flat(arr) {
  if (!arr || arr.length < 1) return [];
  return arr.reduce((pre, cur) => (Array.isArray(cur) ? [...pre, ...flat(cur)] : [...pre, cur]), []);
}
// 方法2：利用concat迭代
function flat2(arr) {
  if (!arr || arr.length < 1) return [];
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 使用

// console.log(flat2([1, 2, [1, [2, 3, [4, 5, [6]]]]]));

/**
 * 手写map
 */
// 方法1：
Array.prototype.myMap = function (fn, thisValue) {
  if (typeof fn !== 'function') throw new Error(fn + 'is not function');
  let res = [];
  let thisV = thisValue || null;
  let arr = this;
  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(thisV, arr[i], i, arr));
  }
  return res;
};
// 方法2：利用数组内置的reduce方法实现map方法，考察对reduce原理的掌握
Array.prototype.myMapUseReduce = function (fn, thisValue) {
  let res = [];
  let thisV = thisValue || null;
  this.reduce((pre, cur, index, arr) => {
    // 传入map回调函数拥有的参数
    // 把每一项的执行结果push进res中
    res.push(fn.call(thisV, cur, index, arr));
  }, res);
  return res;
};

// 使用
// let arr = [2, 3, 1, 5];
// let a = arr.myMap((item, index, arr) => {
//   return item * 2;
// });
// console.log('a:', a);

/**
 * 手写reduce
 */
Array.prototype.myReduce = function (fn, initialValue) {
  if (typeof fn !== 'function') throw new Error(fun + 'is not function');
  if (this === null) throw new Error('Array.prototype.myReduce called on null');
  let arr = this;
  let pre, index;
  if (initialValue) {
    pre = initialValue;
    index = 0;
  } else {
    pre = arr[0];
    index = 1;
  }

  for (; index < arr.length; index++) {
    pre = fn(pre, arr[index], index, arr);
  }
  return pre;
};
// // 使用
// let arr = [2, 3, 1, 5];
// let reduceResult = arr.myReduce((pre, cur, index, arr) => {
//   console.log(pre, cur, index, arr);
//   return pre + cur;
// });
// console.log('reduceResult:', reduceResult);

/**
 * symbol 尝试
 * 1.如果使用 new ，就报错
2.如果 description 是 undefined，让 descString 为 undefined
3.否则 让 descString 为 ToString(description)
4.如果报错，就返回
5.返回一个新的唯一的 Symbol 值，它的内部属性 [[Description]] 值为 descString
 */
var SymbolPolyfill = function Symbol(description) {
  // 实现特性第 2 点：Symbol 函数前不能使用 new 命令
  if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor');

  // 实现特性第 5 点：如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
  var descString = description === undefined ? undefined : String(description);

  // Symbol 值可以显式转为字符串。
  var symbol = Object.create({
    toString: function () {
      return 'Symbol(' + this.__Description__ + ')';
    },
  });

  Object.defineProperties(symbol, {
    __Description__: {
      value: descString,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  });

  // 实现特性第 6 点，因为调用该方法，返回的是一个新对象，两个对象之间，只要引用不同，就不会相同
  return symbol;
};

// console.log(SymbolPolyfill('hhh'));

/**
 * 浅拷贝，深拷贝todo
 */

/**
 * 防抖，节流todo
 */
