## 前言

ES2017 标准引入了 async 函数，使得异步操作变得更加方便。 可以利用它们像编写同步代码那样编写基于 Promise 的代码，而且还不会阻塞主线程。 它们可以让异步代码可读性提高。

## 认识 async & await

异步函数的工作方式是这样的：

```js
async function myFirstAsyncFunction() {
  try {
    const fulfilledValue = await promise;
  } catch (rejectedValue) {
    // …
  }
}
```

如果在函数定义之前使用了 async 关键字，就可以在函数内使用 await。 当您 await 某个 Promise 时，函数暂停执行，直至该 Promise 产生结果，并且暂停并不会阻塞主线程。 如果 Promise 执行，则会返回值。 如果 Promise 拒绝，则会抛出拒绝的值。

## 改造实例：Promise => Async

假设我们想获取某个网址并以文本形式记录响应日志。以下是利用 Promise 编写的代码:

```js
function logFetch(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
    })
    .catch((err) => {
      console.error('fetch failed', err);
    });
}
```

以下是利用异步函数具有相同作用的代码：

```js
async function logFetch(url) {
  try {
    const response = await fetch(url);
    console.log(await response.text());
  } catch (err) {
    console.log('fetch failed', err);
  }
}
```

> **Note: 您 await 的任何内容都通过 Promise.resolve() 传递，这样您就可以安全地 await 非原生 Promise。**

## 业务案例

### 案例 1

假设我们获取时间后，再进行 ajax 请求

**反面实例**

```js
Page({
  async init() {
    await this.initDate();
    console.log('date 时间 获取到');
    this.getMycommission();
  },
  async initDate() {
    console.log('date 时间 开始获取');
    const formatNumber = (n) => {
      n = n.toString();
      return n[1] ? n : '0' + n;
    };
    let date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.setData(
      {
        year,
        month: formatNumber(month),
      },
      () => {
        console.log(this.data.year);
      },
    );
  },
  getMycommission() {
    const { year, month } = this.data;
    const params = {
      year,
      month,
    };
    console.log('params', params);
    // dom Ajax request
  },
});
```

**返回结果**

```shell
date 时间 开始获取
date 时间 获取到
params {year: 2020, month: "07"}
2020
Request Successful
```

> 代码中使用了 async 却并没有在 await 一个有 resolve 状态的 Promise，没有了 `initDate`的等待，code 所以会按照顺序执行，虽然结果参数正确，但在 await 需要延迟的场景很有可能造成参数获取不正确

**正面实例**

```js
Page({
  initDate() {
    return new Promise((resolve, reject) => {
      console.log('date 时间 开始获取');
      const formatNumber = (n) => {
        n = n.toString();
        return n[1] ? n : '0' + n;
      };
      let date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      this.setData(
        {
          year,
          month: formatNumber(month),
        },
        () => {
          console.log(this.data.year);
          resolve();
        },
      );
    });
  },
});
```

**返回结果**

```shell
date 时间 开始获取
2020
date 时间 获取到
params {year: 2020, month: "07"}
Request Successful
```

### 案例 2

获取两个字典项数据后再渲染详情页的数据。（请求有依赖项）

```js
export default {
  components: {},
  props: {},
  data() {
    return {
      id: '',
      loading: true,
      detail: {},
      idTypes: [], // 证件类型字典
      relationship: [], // 与被保人关系字典
    };
  },
  computed: {
    getIDType() {
      return function (id) {
        if (id) {
          const select = this.idTypes.find((v) => v.num == id);
          return select ? select.name : '';
        }
      };
    },
    getRelationship() {
      return function (id) {
        if (id) {
          const select = this.relationship.find((v) => v.num == id);
          return select ? select.name : '';
        }
      };
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.init();
  },
  methods: {
    getDictID() {
      return this.$http.getList({ name: '证件类型' }).then((res) => {
        const data = res.data;
        this.idTypes = data;
        console.log('拿到 【证件类型】 data');
      });
    },
    getDictRelationship() {
      return this.$http.getList({ name: '与投保人关系' }).then((res) => {
        const data = res.data;
        this.relationship = data;
        console.log('拿到 【与投保人关系】 data');
      });
    },
    async init() {
      await this.getDictID();
      await this.getDictRelationship();
      console.log('获取详情数据');
      this.$http.getOrderDetail({ id: this.id }).then((res) => {
        if (res.success) {
          const result = res.data;

          // 格式化缴费年限，保险期间
          result.insOrderRisks.forEach((n) => {
            n.insuredYearText = this.createText(n, 'insuYear'); // 提供字段有误  insuredYear
            n.payEndYearText = this.createText(n, 'payEndYear');
          });
          console.log('result', result);
          this.detail = result;
          this.loading = false;
        }
      });
    },
  },
};
```

**返回结果**

```shell
拿到 【证件类型】
拿到 【与投保人关系】 data
获取详情数据
```

### 案例 3

获取所有贴文且加载所有评论数据，借助 Promise.all 实现。

```js
Page({
  data: {
    chooseTab: 0,
    tabList: ['资讯', '问答'],
    categoryId: '', // 维度 id
    newsList: [], // 资讯
    qaList: [], // 问答
    // 问答分页
    page_qa: 0,
    limit: 10,
    total_qa: 10,
  },
  getTabData(type, categoryId, isPagination) {
    let userId = wx.Storage.getItem('userInfo_Studio').cusInfo.accountId;
    const { page_qa, limit } = this.data;
    const params = {
      categoryId: categoryId,
      page: isPagination ? page_qa + 1 : 1,
      limit: limit,
      userId,
      type,
    };
    API.getDimensionDetail(params).then((res) => {
      // 资讯
      if (type === 1) {
        this.setData({
          newsList: res.data.data.records,
        });
        // 问答
      } else if (type === 2) {
        let data = res.data.data;
        let result = data.records;
        // 不含评论数据的结果
        const qaList = result;
        const promises = qaList.map((qa) =>
          this.getSimgleQuestionAllComents(qa),
        );
        Promise.all(promises).then((res) => {
          if (res.length === qaList.length) {
            qaList.forEach((v, index) => {
              v.showAll = false;
              v.commentList = res[index]; // 所有评论
              v.writeNum = res[index].length; // 前端重置 评论数量
              v.commentList_short = res[index].slice(0, 2); // 短评论（两个）
              res[index].forEach((a) => {
                a['time_zh'] = util.formatTime_zh(a.createTime, 2); // 评论时间
              });
              v['time_zh'] = util.formatTime_zh(v.createTime, 2); // 提示时间
            });
            const temp = this.data.qaList;
            if (!isPagination) {
              this.setData({
                qaList,
                page_qa: page_qa + 1, // 保存页数
                total_qa: data.total, // 保存贴文总量
              });
            } else {
              this.setData({
                qaList: temp.length > 0 ? temp.concat(qaList) : qaList,
                page_qa: page_qa + 1, // 保存页数
                total_qa: data.total, // 保存贴文总量
              });
            }
          } else {
            console.log('评论结果获取错误');
          }
        });
      }
    });
  },
  getSimgleQuestionAllComents(qa) {
    return new Promise((resolve, reject) => {
      const ACCOUNT_ID = wx.Storage.getItem('userInfo_Studio').agtInfo
        .accountId;
      const params = { modelId: qa.id, modelType: 1, spaceUserId: ACCOUNT_ID };
      API.getAllcomment(params).then((res) => {
        const comments = res.data.data;
        resolve(comments);
      });
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { chooseTab, page_qa, categoryId, qaList, total_qa } = this.data;
    if (chooseTab === 1) {
      if (qaList.length < total_qa) {
        this.getTabData(2, categoryId, true);
      }
    }
  },
});
```

## 异步函数返回值

无论是否使用 await，异步函数都会返回 Promise。该 Promise 解析时返回异步函数返回的任何值，拒绝时返回异步函数抛出的任何值。

因此，对于：

```js
// wait ms milliseconds
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function hello() {
  await wait(500);
  return 'world';
}
```

…调用 hello() 返回的 Promise 会在执行时返回 "world"。

```shell
hello().then(res=>{console.log(res)})
Promise {<pending>}
world
```

```js
async function foo() {
  await wait(500);
  throw Error('bar');
}
```

…调用 foo() 返回的 Promise 会在拒绝时返回 Error('bar')。

**利用 async 返回值的业务**

场景：获取系统通知消息与个人消息数量之和后，展示未读消息提示 badge

正面实例：

```js
Page({
  init() {
    this.initMessage();
  },
  async initMessage() {
    await this.getSystemMessages();
    const messagesConcat__unReadNum = await this.getConcatMsg();
    const { noticeLength } = this.data;
    this.setData({
      messages__unReadNum: noticeLength + messagesConcat__unReadNum,
    });
  },
  async getConcatMsg() {
    const fetch = () => {
      return new Promise((resolve, reject) => {
        API.getUnReadMsgNum({
          userId: this.data.accountId,
          userType: 'a',
        }).then((res) => {
          resolve(res.data.data);
        });
      });
    };

    let response = await fetch();
    return response;
  },
  getSystemMessages() {
    return new Promise((resolve, reject) => {
      API.getMessageTotalNum({
        accountId: this.data.accountId,
        pushFlag: '1',
      }).then((res) => {
        this.setData(
          {
            noticeLength: res.data.data || 0,
          },
          () => {
            resolve();
          },
        );
      });
    });
  },
});
```

## 并发

`await` 在等待 async resolve 响应的时候，应该 await (等待) 的是 Promise 的返回结果，而不是 Promise 执行函数，否则异步函数将会由`并行`变为`串行`。

### 同步 async（串行）

```js
const fetch = require('node-fetch');

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

async function getZhihuColumn(id) {
  await sleep(2000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const showColumnInfo = async () => {
  console.time('showColumnInfo');

  // 串行
  const feweekly = await getZhihuColumn('feweekly');
  const toolingtips = await getZhihuColumn('toolingtips');

  console.log(`NAME: ${feweekly.title}`);
  console.log(`INTRO: ${feweekly.intro}`);

  console.log(`NAME: ${toolingtips.title}`);
  console.log(`INTRO: ${toolingtips.intro}`);

  console.timeEnd('showColumnInfo');
};
showColumnInfo();
```

**打印结果：**

```shell
NAME: 前端周刊
INTRO: 在前端领域跟上时代的脚步，广度和深度不断精进
NAME: tooling bits
INTRO: 工欲善其事必先利其器
showColumnInfo: 4391.631ms
```

### 异步 async （并行）

```js
const fetch = require('node-fetch');

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

async function getZhihuColumn(id) {
  await sleep(2000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const showColumnInfo = async () => {
  console.time('showColumnInfo');

  // 并行
  const feweeklyPromise = getZhihuColumn('feweekly');
  const toolingtipsPromise = getZhihuColumn('toolingtips');
  const feweekly = await feweeklyPromise;
  const toolingtips = await toolingtipsPromise;

  console.log(`NAME: ${feweekly.title}`);
  console.log(`INTRO: ${feweekly.intro}`);

  console.log(`NAME: ${toolingtips.title}`);
  console.log(`INTRO: ${toolingtips.intro}`);

  console.timeEnd('showColumnInfo');
};
showColumnInfo();
```

**打印结果：**

```shell
NAME: 前端周刊
INTRO: 在前端领域跟上时代的脚步，广度和深度不断精进
NAME: tooling bits
INTRO: 工欲善其事必先利其器
showColumnInfo: 2245.060ms
```

### 参考链接

-   [ECMAScript 6 入门 : async 函数](https://es6.ruanyifeng.com/#docs/async)
-   [ASYNC/AWAIT 使用警示](http://huihuawk.com/front/async-await/)
-   [How to escape async/await hell](https://www.freecodecamp.org/news/avoiding-the-async-await-hell-c77a0fb71c4c/)
-   [github/course-javascript-async-await](https://github.com/wangshijun/course-javascript-async-await) - Source code for course "asynchronous javascript with async/await"
-   [https://developers.google.com/web/fundamentals/primers/async-functions](https://developers.google.com/web/fundamentals/primers/async-functions)

The text was updated successfully, but these errors were encountered: