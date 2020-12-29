## Promise

-   实现一个 sleep 函数

```js
const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time * 1000);
  });
};

sleep(1000).then(() => {
  // 这里写你的骚操作
});

async function sleepAsync() {
  console.log('fuck the code');
  await sleep(1000);
  console.log('fuck the code again');
}

sleepAsync();
```

## Promise.all

Promise.all(iterable) 方法接受一个由 promise 任务组成的数组作为参数，返回一个 Promise 实例。此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中 promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果。

它让我们方便的等待所有异步任务完成一并拿到返回结果，但其中只要有一个 Promise 任务失败则会返回该失败信息，所有的有效结果都拿不到。

要么全部都有，要么一个都没有，在开发中使用到了这样的逻辑我们显然不能接受，需要去想办法拿到有效的 Promise 任务返回信息。

```js
var promise1 = 41;
var promise2 = 42;
var promise3 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 5000, 'foo');
});

function p1(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(time);
    }, time);
  });
}
```

### 模拟实现

```js
// Promise 扩展
Promise.all__fake = (promiseAry) => {
  return new Promise((resolve, reject) => {
    let resultAry = [],
      index = 0;
    for (let i = 0; i < promiseAry.length; i++) {
      Promise.resolve(promiseAry[i])
        .then((result) => {
          index++;
          resultAry[i] = result;
          if (index === promiseAry.length) {
            resolve(resultAry);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    }
  });
};

Promise.all__fake([promise1, promise2, promise3]).then(function (values) {
  console.log(values);
});
Promise.all__fake([p1(5000), p1(1000)]).then(function (res) {
  console.log(res); //[5000,1000]
});
```

### 错误处理

1.  在 Promise.all 单个的 promise 任务使用 catch 对失败的 promise 请求做处理

```js
Page({
  init() {
    Promise.all([
      this.getArticleList().catch((err) => {
         return err;
      }),
      this.getVideoList(),
      this.getKnowList(),
      this.getMessageList(),
      this.getConcatMsg(),
    ]).then(res) => {
      // ...
    });
  },
  getArticleList() {
    return new Promise((resolve, reject) => {
      API.getArticle().then((res) => {
        reject('Promise.all get Error');
      });
    });
  },
});
```

2.  把 reject 操作换成 resolve(new Error("自定义的 error"))

```js
Page({
  getArticleList() {
    return new Promise((resolve, reject) => {
      API.getArticle().then((res) => {
        try {
          throw new Error('Get res Data Error');
          resolve(res.data);
        } catch (error) {
          resolve('Promise.all getArticleList get Error');
        }
        resolve({ articleList: res.data.data.records.splice(0, 5) });
      });
    });
  },
});
```

3.  [Promise.allSettled](https://javascript.info/promise-api#promise-allsettled)

```js
let p1 = new Promise((resolve) => resolve('result1'));
let p2 = new Promise((resolve, reject) => reject('some troubles'));
let p3 = new Promise((resolve) => resolve('result3'));

Promise.allSettled([p1, p2, p3]).then((result) => console.log(result));

// 它返回有关每个 Promise 最终的状态和值
/* (3) [{…}, {…}, {…}]
0: {status: "fulfilled", value: "result1"}
1: {status: "rejected", reason: "some troubles"}
2: {status: "fulfilled", value: "result3"} */
```

4.  扩展`Promise.every`， 所有的 promise 都错误才触发 reject, 单个 Promise 中使用 try catch 捕获错误

```js
Page({
  getArticleList() {
    return new Promise((resolve, reject) => {
      API.getArticle().then((res) => {
        try {
          throw new Error('Get res Data Error');
          resolve(res.data);
        } catch (error) {
          reject('Promise.all getArticleList get Error');
        }
      });
    });
  },
});
```

```js
Promise.every = (promiseAry) => {
  // 所有的 promise 都错误才触发 reject
  return new Promise((resolve, reject) => {
    if (!isArray(promiseAry)) {
      return reject(new TypeError('arguments must be an array'));
    }
    let resultAry = [],
      errorAry = [],
      index = 0,
      index__error = 0;
    for (let i = 0; i < promiseAry.length; i++) {
      Promise.resolve(promiseAry[i])
        .then((result) => {
          index++;
          resultAry[i] = result;
          if (index === promiseAry.length) {
            resolve(resultAry);
          }
        })
        .catch((reason) => {
          index__error++;
          errorAry[i] = reason;
          resultAry[i] = reason;
          // 都有都错误
          if (index__error === promiseAry.length) {
            reject(errorAry);
          }
          if (index + index__error === promiseAry.length) {
            resolve(resultAry);
          }
        });
    }
  });
};
```

### 参考

-   [https://developers.google.com/web/fundamentals/primers/promises](https://developers.google.com/web/fundamentals/primers/promises)
-   [https://github.com/Advanced-Frontend/Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)
-   [https://stackoverflow.com/questions/30362733/handling-errors-in-promise-all](https://stackoverflow.com/questions/30362733/handling-errors-in-promise-all)

The text was updated successfully, but these errors were encountered: