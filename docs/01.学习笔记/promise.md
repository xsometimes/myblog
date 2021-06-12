---
title: 手写Promise
date: 2021-06-09 10:14:50
permalink: /pages/9c8a34/
categories:
  - 学习笔记
tags:
  - 重读前端
---



## 背景
Javascript异步编程先后经历了四个阶段，分别是`Callback`阶段，`Promise`阶段，`Generator`阶段和`Async/Await`阶段。Callback很快就被发现存在回调地狱和控制权问题，Promise就是在这个时间出现，用以解决这些问题，Promise并非一个新事务，而是按照一个规范实现的类，这个规范有很多，如 Promise/A，Promise/B，Promise/D以及 Promise/A 的升级版 Promise/A+，最终 ES6 中采用了 [Promise/A+ 规范](https://promisesaplus.com/#notes)。后来出现的Generator函数以及Async函数也是以Promise为基础的进一步封装，可见Promise在异步编程中的重要性。

## Promise/A+ 规范解读

### 2.1 术语

**Promise**：promise 是一个拥有 then 方法的对象或函数，其行为符合本规范。

**thenable**：是一个定义了 then 方法的对象或函数。

**value**：指任何 JavaScript 的合法值（包括 undefined , thenable 和 promise）。

**异常（exception）**：是使用 throw 语句抛出的一个值。

**据因（reason）**：表示一个 promise 被拒绝的原因。

### 2.1 要求

#### 2.1.1 Promise States

一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。状态转换只能是pending -> resolved 或者 pending -> rejected，且resolved或rejected的状态一旦转换完成，不能再次改变。

#### 2.1.2 `then` 方法
Promise必须提供then方法来访问它当前或最终结果（value，或reason）。

then方法接收两个参数：

```js
promise.then(onFulfilled, onRejected)
```

1. 参数可选：onFulfilled和onRejected参数变量类型是函数，参数可选；若不是函数将会被忽略。

2. 参数特性：当promise执行结束后onFulfilled函数必须被调用，其第一个参数为promise的value；当promise被拒绝执行后onRejected函数必须被调用，其第一个参数为promise的reason。这两个参数函数的调用次数都不可超过一次。

3. 调用时机：onFulfilled 和 onRejected 只有在execution context stack执行环境堆栈仅包含platform code时才可被调用。

（这里的platform code指引擎、环境和promise实现代码。在实践中，这个要求**确保 onFulfilled 和 onRejected 方法异步执行**，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。这个事件队列可以采用“宏任务（macro-task）”机制或者“微任务（micro-task）”机制来实现。）

4. 调用要求：onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值）。

（在**严格模式（strict）**中，函数 this 的值为 undefined ；在非严格模式中其为全局对象。）

5. 多次调用：then 方法可以被同一个 promise 调用多次。

6. 返回：then 方法必须返回一个 promise 对象。

```js
promise2 = promise1.then(onFulfilled, onRejected);
```

- onResolved/onRejected有返回值则把返回值定义为x，并执行[[Resolve]](promise2, x);
- onResolved/onRejected运行出错，则把promise2设置为rejected状态；
- onResolved/onRejected不是函数，则需要把promise1的状态传递下去。

#### 2.1.3 Promise 解决过程

Promise 解决过程是一个抽象的操作，其需输入一个 promise 和一个值，表示为 [[Resolve]](promise, x)。promise为要返回的新promise对象，x为onResolved/onRejected的返回值。如果x有then方法且看上去像一个promise，我们就把x当成一个promise的对象，即thenable对象，这种情况下尝试让promise接收x的状态。如果x不是thenable对象，就用x的值来执行 promise。

[[Resolve]](promise, x)函数具体运行规则：
- x 与 promise 相等：如果 promise 和 x 指向同一对象，以 TypeError 为reason拒绝执行 promise;
- x 为 Promise：如果 x 为 Promise ，则使 promise 接受 x 的状态。
- x 为对象或函数
  - 把 x.then 赋值给 then
  - 若取x.then值时出现错误，则让promise进入rejected状态
  - 如果then不是函数，说明x不是thenable对象，直接以x的值resolve，如果then存在并且为函数，则把x作为then函数的作用域this调用，then方法接收两个参数，resolvePromise和rejectPromise，如果resolvePromise被执行，则以resolvePromise的参数value作为x继续调用
  - [[Resolve]](promise, value)，直到x不是对象或者函数，如果rejectPromise被执行则让promise进入rejected状态；
  - 如果 x 不为对象或者函数，以 x 为参数执行 promise


  ## 手写代码实现

  ```js

  const PENDING = 'pending',
        RESOLVED = 'resolved',
        REJECTED = 'rejected';

  class MyPromise {

    state = PENDING;

    value = undefined;
    reason = undefined;

    // 存放成功和失败的两个数组，一旦reject或resolve，就调用它们
    // 类似发布订阅，
    onResolvedCallbacks = [];
    onRejectedCallbacks = [];

    // Promise构造函数，传入参数为一个可执行的函数
    constructor(executor) {

      try {
        executor(resolve, reject)
      } catch(e) {
        reject(e);
      }

      // resolve函数负责把状态转换为resolved
      function resolve (value) {
        this.state = RESOLVED;
        this.value = value;

        for (const func of this.onRejectedCallbacks) {
          func(this.value)
        }
      }

      // reject函数负责把状态转换为rejected
      function reject (reason) {
        this.state = REJECTED;
        this.reason = reason;
        for (const func of this.onResolvedCallbacks) {
          func(this.value)
        }
      }
    }


    /**
     * @params onFulfilled: 状态为resolved时的回调函数
     * @params onRejected：状态为rejected时的回调函数
     * @returns 一个新的promise
     */
    then (onFulfilled, onRejected) {
      onFulfilled = isFunction(onFulfilled) ? onFulfilled : v => v;
      onRejected = isFunction(onRejected) ? onRejected : e => { throw e };

      let newPromise = new MyPromise((resolve, reject) => {
        if (this.state === PENDING) {
          // then方法执行时如果promise仍然处于pending状态，
          // 则把处理函数进行储存，等resolve/reject函数真正执行的的时候再调用。
          this.onResolvedCallbacks.push(() => {
            try {
              const x = onFulfilled(this.value);
              // 执行[[Resolve]](promise, x)
              this.resolvePromise(newPromise, x, resolve, reject);
            } catch(error) {
              reject(error)
            }
          })

          this.onRejectedCallbacks.push(() => {
            try {
              const x = onRejected(this.reason);
              this.resolvePromise(newPromise, x, resolve, reject);
            } catch(error) {
              reject(error)
            }
          })
        }
        if (this.state === RESOLVED) {
          nextTick(() => {
            const x = onFulfilled(this.value);
            this.resolvePromise(newPromise, x, resolve, reject);
          })
        }
        if (this.state === REJECTED) {
          nextTick(() => {
            const x = onRejected(this.reason)
            this.resolvePromise(newPromise, x, resolve, reject);
          })
        }
      })

      return newPromise;
    }

    // catch方法是对then方法的封装，只用于接收reject(reason)中的错误信息
    // 在then方法中onRejected参数是可不传的，不传的情况下，错误信息会依次往后传递，直到有onRejected函数接收为止
    // 因此在写promise链式调用的时候，then方法不传onRejected函数，只需要在最末尾加一个catch()就可以了，这样在该链条中的promise发生的错误都会被最后的catch捕获到
    catch(onRejected) {
      return this.then(null, onRejected);
    }

    // catch方法内部也可能出现错误，所以有些promise实现中增加了一个方法done，done相当于提供了一个不会出错的catch方法，并且不再返回一个promise，一般用来结束一个promise链。
    // done = catch的参数onRejected函数用于throw reason
    done () {
      this.catch(reason => {
        console.log('done', reason);
        throw reason;
      });
    }
    // finally方法用于无论是resolve还是reject，finally的参数函数都会被执行。
    finally(fn) {
      return this.then(value => {
        fn();
        return value;
      }, reason => {
        fn();
        throw reason;
      });
    }


    // -----------------------静态方法 start--------------------------------
    static resolve(value) {
      let promise = new MyPromise((resolve, reject) => {
        this.resolvePromise(promise, value, resolve, reject);
      });

      return promise;
    }
    static reject(reason) {
      return new MyPromise((resolve, reject) => {
        reject(reason);
      });
    }

    static all (promiseArr) {
      return new MyPromise((resolve, reject) => {
        const res = [];
        let i = 0;
        for (const p of promiseArr) {
          p.then(value => {
            res[i] = value;
            if (res.length === promiseArr.length) {
              resolve(res);
            }
          }, reject);
          i++;
        }
      })
    }

    static race (promiseArr) {
      return new Promise((resolve, reject) => {
        for (const p of promiseArr) {
          p.then((value) => {
            resolve(value);   
          }, reject);
        }
      });
    }
    static deferred() {}

    // -----------------------静态方法 end----------------------------------


    /**
     * promise解决过程：[[Resolve]](promise, x)函数
     * 其中，promise为要返回的新promise对象，x为onFulfilled/onRejected的返回值
     * 这个函数就是解决x的几种情况：
     * 1）promise===x：TypeError （自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise）
     * 2）x为Promise：让promise接收x的状态
     * 3）x 为对象或者函数：
     *       Let then be x.then；
     *       x.then取值出现错误，则rejected，抛出异常
     *       若then是一个函数，call it with x as this，第一个参数是resolvePromise，第二个参数是rejectPromise
     *       若then不是个函数，fulfill promise with x.
     * 4）x非对象或函数，fulfill promise with x.
     *
     */
    resolvePromise(newPromise, x, resolve, reject) {

      let called = false;

      // 1)
      if (newPromise === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
      }

      // 2)
      if (x instanceof Promise) {
        // 若x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值
        // 所以需要继续调用resolvePromise
        if (x.state === PENDING) {
          x.then(value => {
            this.resolvePromise(newPromise, value, resolve, reject);
          }, reject)
        } else {
          // 若x状态已经确定了，直接取它的状态
          x.then(resolve, reject);
        }

        return
      }

      // 3)
      if (isObject(x) || isFunction(x)) {

        
        try {
          // 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用，所以通过变量called进行控制
          const then = x.then;
          // 若then是函数，那就说明x是thenable，继续执行resolvePromise函数，直到x为普通值
          if (typeof then === 'function') {
            then.call(x, y => {
              if (called) return;
              called = true;
              this.resolvePromise(newPromise, y, resolve, reject);
            }, r => {
              if (called) return;
              called = true;
              reject(r);
            })
          } else {
            // 如果then不是函数，那就说明x不是thenable，直接resolve x
            if (called) return ;
            called = true;
            resolve(x);
          }

        } catch (error) {
          if (called) return;
          called = true;
          reject(e);
        }
      } else {
        // 4)
        resolve(x);
      }
    }
  }


  // -----------------------utils---------------------------------

  function nextTick(fn) {
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(fn);
      let counter = 1;
      const textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      counter = (counter + 1) % 2;
      textNode.data = counter;
    } else {
      setTimeout(fn, 0)
    }
  }

  function isObject (obj) {
    return obj !== null && Object.prototype.toString.call(obj) === '[object Object]'
  }

  function isFunction (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
  }
  ```



## 知识点考察

当面试官问“你能手写一个Promise吗”，他在考察哪些点？

### 基本介绍

1. 介绍下promise？

Promise是异步编程的一种解决方案。有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了“回调地狱”（层层嵌套的回调函数）。此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

2. Promise存在哪些缺点？
- 无法中途取消
- 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
- 吞掉错误或异常，错误只能顺序处理，即便在Promise链最后添加catch方法，依然可能存在无法捕捉的错误（catch内部可能会出现错误）

3. 如何停止一个Promise链？

在要停止的promise链位置添加一个方法，返回一个永远不执行resolve或者reject的Promise，那么这个promise永远处于pending状态，所以永远也不会向下执行then或catch了。这样我们就停止了一个promise链。

```js
Promise.cancel = Promise.stop = function() {
  return new Promise(function(){})
}
```

4. Promise链上返回的最后一个Promise出错了怎么办？
catch在promise链式调用的末尾调用，用于捕获链条中的错误信息，但是catch方法内部也可能出现错误。可选择用.done()。done相当于提供了一个不会出错的catch方法，并且不再返回一个promise，一般用来结束一个promise链。

### 异步处理、eventloop相关

1. Promise.then在Event Loop中的执行顺序？

JS中分为两种任务类型：macrotask和microtask，其中macrotask包含：主代码块，setTimeout，setInterval，setImmediate等（setImmediate规定：在下一次Event Loop（宏任务）时触发）；microtask包含：Promise，process.nextTick等（在node环境下，process.nextTick的优先级高于Promise）Event Loop中执行一个macrotask任务（栈中没有就从事件队列中获取）执行过程中如果遇到microtask任务，就将它添加到微任务的任务队列中，macrotask任务执行完毕后，立即执行当前微任务队列中的所有microtask任务（依次执行），然后开始下一个macrotask任务（从事件队列中获取） 浏览器运行机制。


2. constructor、then中的代码执行是同步还是异步？

constructor中的代码是同步，then中是异步执行。


3. promise中抛出的异常为什么不能被catch不能捕捉？为啥 promise出错 程序抛出异常后还能继续走下去？


### then 的链式调用&值穿透特性

1. promise 的优势在于可以链式调用。在我们使用 Promise 的时候，当 then 函数中 return 了一个值，不管是什么值，我们都能在下一个 then 中获取到，这就是所谓的**then 的链式调用**。

如何实现？每次调用 then 的时候，我们都重新创建一个 promise 对象，并把上一个 then 的返回结果传给这个新的 promise 的 then 方法

2. 当我们不在 then 中放入参数，例：promise.then().then()，那么其后面的 then 依旧可以得到之前 then 返回的值，这就是所谓的**值的穿透**。



## 学习文档
- [Promise/A规范](https://promisesaplus.com/#notes)，[Promise/A规范 翻译](https://zhuanlan.zhihu.com/p/143204897)
- [9k字 | Promise/async/Generator实现原理解析](https://juejin.cn/post/6844904096525189128)
- [Promise必备知识汇总和面试情况](https://mp.weixin.qq.com/s?__biz=MzI0MzIyMDM5Ng==&mid=2649835656&idx=1&sn=e18e89e9a26028b496c3d624c8c8b2ec&chksm=f175824bc6020b5d0ff9b15c42386d24f1cb31516c0a8c09d15457ddf83760df5c58e73fd4c8&mpshare=1&scene=1&srcid=06114REiX8Qdaon6f63zU6rP&sharer_sharetime=1623377732568&sharer_shareid=240280dad34afa83333ba12be4c57ba8&exportkey=AwaACruqEXxR2gYB%2Fbxtfsc%3D&pass_ticket=15Sb0U5Fj23Ny4HpHVX7eSPs3SK6RWZBdFE8nzNidpGWeSsyetCz%2FW089RL3PqPy&wx_header=0#rd)
