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
 * 浅拷贝
 * 基本类型拷贝值，引用类型拷贝地址
 */
function shallowCopy(target, origin) {
  const basetype = ['undefined', 'boolean', 'number', 'string', 'symbol'];
  if (origin === null || basetype.includes(typeof origin)) target = origin;
  else if (Array.isArray(origin)) target = origin.slice(0);
  else target = Object.assign(origin);
  console.log(target);
  return target;
}

// 使用
// let a;
// let arr = [1, 2, 3];
// let obj = { 1: 1 };
// let anull = null;
// let aundefined = undefined;

// shallowCopy(a, arr);
// shallowCopy(a, obj);
// shallowCopy(a, anull);
// shallowCopy(a, aundefined);

/**
 * 深拷贝
 * 对值进行拷贝，嵌套也要拷贝
 */
// 方法1：JSON.parse(JSON.stringify(obj))
// 缺点，1.循环引用会报错 2.不可枚举变量，symbol会被忽略 3.function NaN Date等不能完美复制
function deepCloneJsonParse(target, origin) {
  return (target = JSON.parse(JSON.stringify(origin)));
}
// 方法2：对象的深拷贝,递归，
// basecase 不是对象，直接赋值；是对象，遍历属性，递归深拷贝
function isObject(val) {
  return typeof val === 'object' && val !== null;
}
function deepClone(origin, hash = new WeakMap()) {
  if (!isObject(origin)) return origin;
  if (hash.has(origin)) return hash.get(origin);
  let target = Array.isArray(origin) ? [] : {};
  hash.set(origin, target);
  Reflect.ownKeys(origin).forEach((item) => {
    target[item] = deepClone(origin[item], hash);
  });
  return target;
}

// // 使用
// var obj3 = { mm: 2 };
// var obj1 = {
//   a: 1,
//   b: { a: 2 },
//   c: [1, 2, 3],
//   d: obj3,
// };
// obj3.cc = obj1;
// var obj2 = deepClone(obj1);
// console.log(obj1);
// console.log(obj2);

// 完美深拷贝思路（lodash）
// 1.判断数值的数据类型
// 2.根据特定数据类型进行具体的拷贝
//   可遍历类型(Object/Array/Map/Set等)：遍历每个值递归处理
//   不可遍历类型： 根据类型进行赋值
//   根据类型，通过constructor构造初始值然后拷贝内容
// 3.引用类型，记录拷贝情况，出现循环引用且已经拷贝过的对象，不另外拷贝
function deeoClone(target, origin) {}

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
 * 防抖，节流todo
 */
/**
 * 节流
 * 连续触发事件但是在 n 秒中只执行一次函数
 * 例：
 * （连续不断动都需要调用时用，设一时间间隔），
 * 像dom的拖拽，如果用消抖的话，就会出现卡顿的感觉，
 * 因为只在停止的时候执行了一次，这个时候就应该用节流，
 * 在一定时间内多次执行，会流畅很多。
 */
function throttle(fn, delay) {
  let timer;
  return function () {
    let args = arguments;
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      // this和外面的this一致
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// function throttle(fn, delay) {
//   let timer;
//   return function () {
//     var _this = this;
//     var args = arguments;
//     if (timer) {
//       return;
//     }
//     timer = setTimeout(function () {
//       fn.apply(_this, args); // 这里args接收的是外边返回的函数的参数，不能用arguments
//       // fn.apply(_this, arguments); 需要注意：Chrome 14 以及 Internet Explorer 9 仍然不接受类数组对象。如果传入类数组对象，它们会抛出异常。
//       timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
//     }, delay);
//   };
// }

// // 使用
// window.onload = function () {
//   document.getElementById('hh').onclick = throttle(function () {
//     console.log(2);
//   }, 2000);
// };

/**
 * 防抖
 * 指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 */
function debounce(fn, delay) {
  let timer;
  console.log('arguments:', arguments);

  return function () {
    let args = arguments; // 是啥
    console.log('args:', args);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// // 使用
// window.onload = function () {
//   document.getElementById('hh').onclick = debounce(function () {
//     console.log(2);
//   }, 2000);
// };

function debounceMax(fn, delay, maxTime) {
  let timer;
  let endTime;

  return function () {
    let args = arguments; // 是啥
    if (!endTime) {
      endTime = Date.now() + maxTime;
    }
    let remainTime = Math.min(endTime - Date.now(), delay);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
      endTime = null;
    }, remainTime);
  };
}

// 使用
window.onload = function () {
  document.getElementById('hh').onclick = debounceMax(
    function () {
      console.log(2);
    },
    2000,
    5000
  );
};

/**
 * EventBus
 * 实现EventBus类，有 on off once trigger功能，
 * 分别对应绑定事件监听器，解绑，执行一次后解除事件绑定，触发事件监听器。
 *
 * 核心，维护一个对象，key:事件名eventname ，value：绑定的fn
 */
class EventBus {
  constructor() {
    this.eventlist = {}; // 收集事件对象
  }

  $on(eventName, fn) {
    this.eventlist[eventName] ? this.eventlist[eventName].push(fn) : (this.eventlist[eventName] = [fn]);
  }

  $emit(eventName, ...rest) {
    if (!eventName) throw new Error('事件名不能为空');
    if (this.eventlist[eventName]) {
      this.eventlist[eventName].forEach((fn) => {
        try {
          fn(...rest);
        } catch (e) {
          console.error(e + 'eventname:' + eventName);
        }
      });
    }
  }

  $once(eventName, fn) {
    const _this = this;
    function onceHandle() {
      fn.apply(null, arguments);
      _this.$off(eventName, onceHandle);
    }
    this.$on(eventName, onceHandle);
  }

  $off(eventName, fn) {
    // 不传参数时，取消全部订阅
    if (!arguments.length) {
      return (this.eventlist = {});
    }
    // eventName是数组，逐个取消
    if (Array.isArray(eventName)) {
      return eventName.forEach((e) => {
        this.$off(e, fn);
      });
    }
    // !fn取消eventName下的全部
    if (!fn) {
      this.eventlist[eventName] = [];
    }
    // 取消eventName下的fn
    this.eventlist[eventName] = this.eventlist[eventName].filter((f) => f !== fn);
  }
}

// // 使用
// const e = new EventBus();
// // fn1 fn2
// e.$on('e1', fn1);
// e.$once('e1', fn2);
// e.$emit('e1'); // fn1() fn2()
// e.$emit('e1'); // fn1()
// e.$off('e1', fn1);
// e.$emit('e1'); // null

// function fn1() {
//   console.log('f1');
// }
// function fn2() {
//   console.log('f2');
// }
