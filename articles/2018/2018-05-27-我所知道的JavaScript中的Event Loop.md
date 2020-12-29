## 单线程的 Javascript

javascript 是一门单线程语言

## 任务队列

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

于是任务又分为：

-   同步任务
-   异步任务

同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

## 什么是 Event Loop

`Event Loop`， 事件循环，是 Javascript 的执行机制，在主线程空闲的时候从 `task queue` 中取出事件来执行，遵守先进先出的原则。这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。

[![bg2014100802.png](https://camo.githubusercontent.com/2ba3f3caa3d139f0f112da2591284016c917f00e956a8820d775fd6cfd03145c/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c79316737633431663065716f6a3230677030656e6467362e6a7067)](https://camo.githubusercontent.com/2ba3f3caa3d139f0f112da2591284016c917f00e956a8820d775fd6cfd03145c/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c79316737633431663065716f6a3230677030656e6467362e6a7067)

## 宏任务与微任务

当主线程空闲时（执行栈为空），主线程会先查看微任务队列，执行清空后再查看宏任务队列，并执行清空，如此反复循环。

[![15fdcea13361a1ec.png](https://camo.githubusercontent.com/9effdac5a19ec23fb723e9cfa10e014e33400c6fa342bca87cc840ce15d365e7/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c793167376334357869346a6d6a3231347330793661626d2e6a7067)](https://camo.githubusercontent.com/9effdac5a19ec23fb723e9cfa10e014e33400c6fa342bca87cc840ce15d365e7/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c793167376334357869346a6d6a3231347330793661626d2e6a7067)

micro-task(微任务)：Promise、process.nextTick、Object.observe、MutationObserver

macro-task(宏任务)：script 代码块、setTimeout、setInterval、I/O、UI rendering

### Demo 举例

```js
new Promise(resolve => {
  console.log(1);
  setTimeout(() => {
    console.log(2);
  }, 0);
  Promise.resolve().then(() => {
    console.log(3);
  });
  resolve();
}).then(() => {
  console.log(4);
});
console.log(5);
```

> `new Promise`在实例化的过程中所执行的代码都是同步进行的，故会立即执行，而`then`中注册的回调是异步执行的(在`resolve`方法的调用下才会执行)

下面是代码的执行分析：

-   第一次事件循环开始
    -   这段代码作为宏任务，进入主线程
    -   `new Promise` 立即执行 log：1
    -   遇到 `setTimeout`，注册其回调函数后分发到 宏任务队列
    -   微任务队列 + `Promise.resolve().then()` 的回调函数
    -   微任务队列 + `Promise.resolve().then().then()` 的回调函数
    -   log: 5
    -   开始执行微任务
        -   `Promise.resolve().then()` =》 log:3
        -   `Promise.resolve().then().then()` =》 log:4
-   第一次事件循环结束，`task queue` 非空
-   第二次事件循环开始
    -   执行 宏任务 `setTimeout callback` log:2
    -   没有微任务
-   第二次事件循环结束， `task queue` 清空
-   代码执行完毕

### async/await 函数

因为 `async/await` 本质上还是基于 `Promise` 的一些封装，而 `Promise` 是属于微任务的一种。所以在实际使用上效果类似：async 函数在 await 之前的代码都是同步执行的，可以理解为 await 之前的代码属于`new Promise`时传入的代码，await 之后的所有代码都是在`Promise.then`中的回调。

```js
setTimeout(_ => console.log(4));

async function main() {
  console.log(1);
  await Promise.resolve();
  console.log(3);
}

main();

console.log(2);
```

下面是代码的执行分析：

-   第一次事件循环开始
    -   整段代码作为宏任务，进入主线程
    -   宏任务队列 + `setTimeout callback`
    -   立即执行 async main,相当于 new Promise(),紧接着 log: 1,微任务队列 + Promise.then()
    -   log:2
    -   执行所有微任务 Promise.then() log:3
-   第一次事件循环结束， `task queue` 非空
-   第二次事件循环开始
    -   执行宏任务 `setTimeout callback` log:4
    -   没有微任务
-   第二次事件循环结束， `task queue` 为空
-   代码执行完毕

## Node.js 的 Event Loop

-   待完善

### 参考

-   [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
-   [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)
-   [微任务、宏任务与 Event-Loop](https://juejin.im/post/5b73d7a6518825610072b42b)

The text was updated successfully, but these errors were encountered: