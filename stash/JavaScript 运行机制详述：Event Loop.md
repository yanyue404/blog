## 一、单线程的 Javascript

诞生之初，JavaScript 被设计为单线程、非阻塞、异步、解释性的语言，作为客户端脚本在网页浏览器环境运行，主要用来向 HTML 页面添加交互行为。

为了并发地处理事件，JavaScript 程序输入/输出是使用事件和回调函数执行的。例如，这意味着 JavaScript 可以在等待数据库查询返回信息时处理鼠标单击。ECMAScript ES6 引入了 Promise 用于优雅地处理异步事件，其可以使得传统的基于回调的异步代码更加清晰与简单。

在最新的 HTML5 中提出了 Web-Worker，但 javascript 是单线程这一核心仍未改变。所以一切 javascript 版的"多线程"都是用单线程模拟出来的，将来也不会变。

## 二、任务队列

单线程模式就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

为了解决排队等待的耗时问题，聪明的 Javascript 设计者将任务分为了：

- 同步任务
- 异步任务

同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

任务分类：

- 同步任务：UI 渲染,alert
- 异步任务：ajax (XMLHttpRequest)，定时器，DOM 事件监听、资源下载

主线程处理任务队列的运行机制如下:

> （1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

> （2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

> （3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

> （4）主线程不断重复上面的第三步。

## 三、什么是 Event Loop

主线程在空闲的时候从 `task queue` 中取出事件来执行，这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。

下图（转引自 Philip Roberts 的演讲《[What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)》

![bg2014100802.png](http://ww1.sinaimg.cn/large/df551ea5ly1g7c41f0eqoj20gp0endg6.jpg)

**Call Stack 例子**

```js
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  var squared = square(n);
  console.log(squared);
}

printSquare(4);
```

执行时发生了什么：

- Call Stack：main 文件自身执行
- 自上而下声明了每个函数
- Call Stack：推入栈 printSquare(4);
- Call Stack：推入栈 square(n);
- Call Stack：推入栈 multiply(n，n);
- Call Stack：弹出栈 multiply(n，n);
- Call Stack：弹出栈 square(n);
- Call Stack：console.log(squared);
- Call Stack：弹出栈 printSquare(4);

**Event loop 例子**

```js
$.on("button", "click", function onClick() {
  setTimeout(function timer() {
    console.log("You clicked the button!");
  }, 2000);
});

console.log("Hi!");

setTimeout(function timeout() {
  console.log("Click the button!");
}, 5000);

console.log("Welcome to loupe.");
```

Save + run 发生了什么：

执行的区域我们分为 Call Stack （调用栈）、Web Apis (浏览器环境的 API 线程)、Callback Queue（回调队列）

- Call Stack：代码块依次进入主线程（以下描述省略这一步）；
- Web Apis：注册 `$.on('button', 'click', ...)`；
- Call Stack：console.log("Hi!");
- Web Apis：注册 `setTimeout(timeout, 5000)`
- Call Stack：console.log("Welcome to loupe.");
- Web Apis：5S 后 `setTimeout(√) 清空`
- Callback Queue：加入`setTimeout(timeout, 5000)`的回调函数 timeout;
- Call Stack：主线程空闲;
- Call Stack：执行 回调函数 timeout => console.log("Click the button!");

> 注意执行结束后： Web Apis 依然存在 `$.on('button', 'click', ...)`事件，等待执行，除非事件被销毁；

## 四、宏任务与微任务

当主线程空闲时（执行栈为空），主线程会先查看微任务队列，执行清空后再查看宏任务队列，并执行清空，如此反复循环。

![15fdcea13361a1ec.png](http://ww1.sinaimg.cn/large/df551ea5ly1g7c45xi4jmj214s0y6abm.jpg)

micro-task(微任务)：Promise、process.nextTick、Object.observe、MutationObserver

macro-task(宏任务)：script 代码块、setTimeout、setInterval、I/O、UI rendering

举个例子：

```js
new Promise((resolve) => {
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

- 第一次事件循环开始
  - 这段代码作为宏任务，进入主线程
  - `new Promise` 立即执行 log：1
  - 遇到 `setTimeout`，注册其回调函数后分发到 宏任务队列
  - 微任务队列 + `Promise.resolve().then()` 的回调函数
  - 微任务队列 + `Promise.resolve().then().then()` 的回调函数
  - log: 5
  - 开始执行微任务
    - `Promise.resolve().then()` =》 log:3
    - `Promise.resolve().then().then()` =》 log:4
- 第一次事件循环结束，`task queue` 非空
- 第二次事件循环开始
  - 执行 宏任务 `setTimeout callback` log:2
  - 没有微任务
- 第二次事件循环结束， `task queue` 清空
- 代码执行完毕

**async/await 函数**

因为 `async/await` 本质上还是基于 `Promise` 的一些封装，而 `Promise` 是属于微任务的一种。所以在实际使用上效果类似：async 函数在 await 之前的代码都是同步执行的，可以理解为 await 之前的代码属于`new Promise`时传入的代码，await 之后的所有代码都是在`Promise.then`中的回调。

```js
setTimeout((_) => console.log(4));

async function main() {
  console.log(1);
  await Promise.resolve();
  console.log(3);
}

main();

console.log(2);
```

下面是代码的执行分析：

- 第一次事件循环开始
  - 整段代码作为宏任务，进入主线程
  - 宏任务队列 + `setTimeout callback`
  - 立即执行 async main,相当于 new Promise(),紧接着 log: 1,微任务队列 + Promise.then()
  - log:2
  - 执行所有微任务 Promise.then() log:3
- 第一次事件循环结束， `task queue` 非空
- 第二次事件循环开始
  - 执行宏任务 `setTimeout callback` log:4
  - 没有微任务
- 第二次事件循环结束， `task queue` 为空
- 代码执行完毕

### 参考

- [wiki - JavaScript](https://zh.wikipedia.org/zh-sg/JavaScript)
- [loupe](https://github.com/latentflip/loupe) - Visualizing the javascript runtime at runtime
- [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
- [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)
- [微任务、宏任务与 Event-Loop](https://juejin.im/post/5b73d7a6518825610072b42b)
