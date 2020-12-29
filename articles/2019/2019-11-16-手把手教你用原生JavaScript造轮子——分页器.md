## 前言

学习制造可以在生产环境使用的轮子，Start ！

-   csdoker
    -   [原文](https://juejin.im/post/5b592635e51d4533d2043e15)
    -   [source code](https://github.com/csdoker/csdwheels) / [pagination](https://github.com/csdoker/csdwheels/blob/master/src/es5/pagination/pagination.js)
    -   [Demo-pagination](https://csdoker.github.io/csdemos/pagination/)
-   [FrankFang](https://github.com/FrankFang/)
    -   [source code](https://github.com/FrankFang/wheels/blob/master/lib/pager/index.js) / [Demo](https://fangyinghang.com/wheels/demos/pager.html)

## 插件设计分析

开发插件最重要的一点，就是插件的兼容性，一个插件至少要能同时在几种不同的环境中运行（**UMD 模块机制**）。

其次，它还需要满足以下几种功能及条件：

1.  插件自身的作用域与用户当前的作用域相互独立，也就是插件内部的私有变量不能影响使用者的环境变量；（**IIFE**）
2.  插件需具备默认设置参数；插件除了具备已实现的基本功能外，需提供部分 API，使用者可以通过该 API 修改插件功能的默认参数，从而实现用户自定义插件效果；（**默认参数设计 + exend 扩展接口**）
3.  插件支持链式调用；（**不做考虑**）
4.  插件需提供监听入口，及针对指定元素进行监听，使得该元素与插件响应达到插件效果。（**添加事件相关辅助函数**）

基础模板：

```js
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Plugin = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";

  // tool
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  // polyfill
  var EventUtil = {
    //  https://www.cnblogs.com/hykun/p/EventUtil.html
  };

  // plugin construct function
  function Plugin(selector, userOptions) {
    // Plugin() or new Plugin()
    if (!(this instanceof Plugin)) return new Plugin(selector, userOptions);
    this.init(selector, userOptions);
  }
  Plugin.prototype = {
    constructor: Plugin,
    // default option
    options: {},
    init: function(selector, userOptions) {
      extend(this.options, userOptions, true);
    }
  };

  return Plugin;
});
```

## 思路分析

要实现的分页效果是什么样的，分成两种情况，显示和不显示省略号的

**第一种： 不显示省略号**

```js
// 总共30页
// 第一种情况：不显示省略号，当前页码前后最多显示2个页码
当前页码为 1，那么显示 1 2 3 4 5
当前页码为 2，那么显示 1 2 3 4 5
当前页码为 3，那么显示 1 2 3 4 5
当前页码为 4，那么显示 2 3 4 5 6
...
当前页码为 15，那么显示 13 14 15 16 17
...
当前页码为 27，那么显示 25 26 27 28 29
当前页码为 28，那么显示 26 27 28 29 30
当前页码为 29，那么显示 26 27 28 29 30
当前页码为 30，那么显示 26 27 28 29 30
```

```js
var total = 30;
for (var i = 1; i <= total; i++) {
  console.log(showPages(i, total, 2));
}
function showPages(page, total, show) {
  var str = "";
  // 当前页前无空余页数，不需要位移 1，2 ，3，4，5
  if (page < show + 1) {
    for (var i = 1; i <= show * 2 + 1; i++) {
      str = str + " " + i;
    }
    // 当前页后无空余页数，不需要位移 26 27 28 29 30
  } else if (page > total - show) {
    for (var i = total - show * 2; i <= total; i++) {
      str = str + " " + i;
    }
    // 当前页有空余页数，拥有位移
  } else {
    for (var i = page - show; i <= page + show; i++) {
      str = str + " " + i;
    }
  }
  return str.trim();
}
```

打印结果：

[![](https://camo.githubusercontent.com/6edb697ee9be0f40367f30e9a4e210e78c6a4d540460e7a5d6080c6289e4d2dd/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f372f32362f313634643433643764613963363330393f696d61676556696577322f302f772f313238302f682f3936302f666f726d61742f776562702f69676e6f72652d6572726f722f31)](https://camo.githubusercontent.com/6edb697ee9be0f40367f30e9a4e210e78c6a4d540460e7a5d6080c6289e4d2dd/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f372f32362f313634643433643764613963363330393f696d61676556696577322f302f772f313238302f682f3936302f666f726d61742f776562702f69676e6f72652d6572726f722f31)

**第二种： 显示省略号**

待分析...

## 基本架构

```js
// 模仿jQuery $()
function $(selector, context) {
  context = arguments.length > 1 ? context : document;
  return context ? context.querySelectorAll(selector) : null;
}
var Pagination = function(selector, pageOption) {
  // 默认配置
  this.options = {
    curr: 1, // 当前页码
    pageShow: 2, // 当前页前后两边可显示的页码个数（选填，默认为2）
    ellipsis: true, // 是否显示省略号
    hash: false
  };
  // 合并配置
  extend(this.options, pageOption, true);
  // 分页器元素
  this.pageElement = $(selector)[0];
  // 数据总数
  this.dataCount = this.options.count;
  // 当前页码
  this.pageNumber = this.options.curr;
  // 总页数
  this.pageCount = Math.ceil(this.options.count / this.options.limit);
  // 渲染
  this.renderPages();
  // 执行回调函数
  this.options.callback &&
    this.options.callback({
      curr: this.pageNumber,
      limit: this.options.limit,
      isFirst: true
    });
  // 改变页数并触发事件
  this.changePage();
};

Pagination.prototype = {
  constructor: Pagination,
  changePage: function() {}
};

return Pagination;
```

**基本参数**

```js
// 分页元素ID（必填）
var selector = "#pagelist";

// 分页配置
var pageOption = {
  limit: 5, // 每页显示数据条数（必填）
  count: 162, // 数据总数（一般通过后端获取，必填）
  curr: 1, // 当前页码（选填，默认为1）
  ellipsis: true, // 是否显示省略号（选填，默认显示）
  pageShow: 2, // 当前页前后两边可显示的页码个数（选填，默认为2）
  hash: false, // 开启location.hash，并自定义hash值对追加 #!hash值={curr} （默认关闭）
  // 页面加载后默认执行一次，然后当分页被切换时再次触发
  callback: function(obj) {
    // obj.curr：获取当前页码
    // obj.limit：获取每页显示数据条数
    // obj.isFirst：是否首次加载页面，一般用于初始加载的判断
    // 首次不执行
    if (!obj.isFirst) {
      // do something
    }
  }
};

// 初始化分页器
new Pagination(selector, pageOption);
```

## 事件绑定

对分页器进行点击事件的绑定，`changePage()`方法，对各项点击事件的监听重新渲染 `renderPages`

## 渲染 DOM

期望渲染效果：

```html
<ol class="pagination" id="pagelist">
  <li class="pagination-item">
    <a href="javascript:;" id="page" class="pagination-link current">1</a>
  </li>
  <li class="pagination-item">
    <a href="javascript:;" id="page" class="pagination-link">2</a>
  </li>
  <li class="pagination-item">
    <a href="javascript:;" id="page" class="pagination-link">3</a>
  </li>
  <li class="pagination-item">
    <a href="javascript:;" id="page" class="pagination-link">4</a>
  </li>
  <li class="pagination-item">
    <a href="javascript:;" id="page" class="pagination-link">5</a>
  </li>
  <li class="pagination-item">
    <a href="javascript:;" id="next" class="pagination-link">后一页</a>
  </li>
  <li class="pagination-item">
    <a href="javascript:;" id="last" class="pagination-link">尾页</a>
  </li>
</ol>
```

在这里仅分析下没有省略号的情况,`renderPages`渲染页面实际执行下面的 `renderNoEllipsis`方法

```js
 renderNoEllipsis: function() {
      var fragment = document.createDocumentFragment();
      // 处理当前 pageNumber 刚开始，没有位移的情况
      if (this.pageNumber < this.options.pageShow + 1) {
        fragment.appendChild(this.renderDom(1, this.options.pageShow * 2 + 1));
     // 处理当前 pageNumber 快结束，没有位移的情况
      } else if (this.pageNumber > this.pageCount - this.options.pageShow) {
        fragment.appendChild(
          this.renderDom(
            this.pageCount - this.options.pageShow * 2,
            this.pageCount
          )
        );
      } else {
        // 有位移
        fragment.appendChild(
          this.renderDom(
            this.pageNumber - this.options.pageShow,
            this.pageNumber + this.options.pageShow
          )
        );
      }
      // 加首页以及前一页
      if (this.pageNumber > 1) {
        this.addFragmentBefore(fragment, [
          this.pageInfos[0],
          this.pageInfos[1]
        ]);
      }
       // 加后一页和尾页
      if (this.pageNumber < this.pageCount) {
        this.addFragmentAfter(fragment, [this.pageInfos[2], this.pageInfos[3]]);
      }
      return fragment;
    },
```

**核心工具函数**

-   `renderDom`,DOM 操作实现 **思路分析**中的`for`循环：
-   `addFragmentAfter`DOM 结构向后插入，向前插入 `addFragmentBefore`
-   `createHtml` 生成单个渲染页码 `html`结构
    -   `<li class="pagination-item"><a href="javascript:;" id="page" class="pagination-link">5</a> </li>`

```js
renderDom: function(begin, end) {
  var fragment = document.createDocumentFragment();
  var str = "";
  for (var i = begin; i <= end; i++) {
    // str 为 clasName
    str = this.pageNumber === i ? CLASS_NAME.LINK + " current" : CLASS_NAME.LINK;
    this.addFragmentAfter(fragment, [this.getPageInfos(str, i)]);
  }
  return fragment;
}

addFragmentBefore: function(fragment, datas) {
  fragment.insertBefore(this.createHtml(datas), fragment.firstChild);
}

addFragmentAfter: function(fragment, datas) {
  fragment.appendChild(this.createHtml(datas));
}
createHtml: function(elemDatas) {
//   [ { className: "pagination-link current", content: 1, id: "page" } ];
  var self = this;
  var fragment = document.createDocumentFragment();
  var liEle = document.createElement("li");
  var aEle = document.createElement("a");
  elemDatas.forEach(function(v, index) {
    liEle.setAttribute("class", CLASS_NAME.ITEM);
    aEle.setAttribute("href", "javascript:;");
    aEle.setAttribute("id", v.id);
    if (v.id !== 'page') {
      aEle.setAttribute("class", CLASS_NAME.LINK);
    } else {
      aEle.setAttribute("class", v.className);
    }
    aEle.innerHTML = v.content;
    liEle.appendChild(aEle);
    fragment.appendChild(liEle);
  });
  return fragment;
}
```

> 细节优化：`document.createDocumentFragment` API, 创建一个临时占位符再插入 DOM，避免 DOM 操作时的重绘和回流，提高页面性能

## ES6 升级

**环境配置**

采用 `webpack`打包构建流程：

1.  寻找到`./src/es6/`目录下面的 `index.js` 项目入口文件
2.  使用 `Babel` 编译它及它所引用的所有依赖（如 Scss、css 文件等）
3.  压缩编译完成后的 js 文件，配置为 **umd** 规范，重命名为 csdwheels.min.js
4.  清空 dist-es6 目录
5.  输出至 dist-es6 目录下

```js
// webpack.config.js
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin"); //每次构建清理dist目录

module.exports = {
  // 模式配置
  mode: "development",
  // 入口文件
  entry: {
    pagination: "./src/es6/index.js"
  },
  // 出口文件
  output: {
    path: path.resolve(__dirname, "dist-es6"),
    filename: "csdwheels.min.js",
    libraryTarget: "umd",
    library: "csdwheels"
  },
  // 对应的插件
  plugins: [
    new CleanWebpackPlugin(["dist-es6"]),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    })
  ],
  // 开发服务器配置
  devServer: {},
  // 处理对应模块
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "src/es6"),
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  }
};
```

**代码重构**

使用 ES6 中的 `Class`重构代码，[源码](https://github.com/csdoker/csdwheels/blob/master/src/es6/pagination/pagination.js)

梳理改造过程：

-   const、let 替换 var
-   用 constructor 实现构造函数
-   箭头函数替换 function

```js
import "../../../style/pagination/pagination.scss";

class Pagination {
  static PAGE_INFOS = [
    {
      id: "first",
      content: "首页"
    },
    {
      id: "prev",
      content: "前一页"
    },
    {
      id: "next",
      content: "后一页"
    },
    {
      id: "last",
      content: "尾页"
    },
    {
      id: "",
      content: "..."
    }
  ];

  constructor(selector, options = {}) {
    // 默认配置
    this.options = {
      curr: 1,
      pageShow: 2,
      ellipsis: true,
      hash: false
    };
    Object.assign(this.options, options);
    this.init(selector);
  }

  changePage() {}

  init(selector) {
    // 分页器元素
    this.pageElement = this.$(selector)[0];
    // 数据总数
    this.dataCount = this.options.count;
    // 当前页码
    this.pageNumber = this.options.curr;
    // 总页数
    this.pageCount = Math.ceil(this.options.count / this.options.limit);
    // 渲染
    this.renderPages();
    // 执行回调函数
    this.options.callback &&
      this.options.callback({
        curr: this.pageNumber,
        limit: this.options.limit,
        isFirst: true
      });
    // 改变页数并触发事件
    this.changePage();
  }
}
export default Pagination;
```

> 补充：ES7 新提案的 static 语法，添加 babel 语法转换 `npm i babel-preset-stage-0 -D`

## FrankFang 的 分页分析

```js
class Pager {
  constructor(options) {
    let defaultOptions = {
      element: null,
      buttonCount: 10,
      currentPage: 1,
      totalPage: 1,
      pageQuery: "", // 'page'
      templates: {
        number: "<span>%page%</span>",
        prev: "<button class=prev>上一页</button>",
        next: "<button class=next>下一页</button>",
        first: "<button class=first>首页</button>",
        last: "<button class=last>末页</button>"
      }
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.domRefs = {};
    this.currentPage = parseInt(this.options.currentPage, 10) || 1;
    this.checkOptions()
      .initHtml()
      .bindEvents();
  }
  checkOptions() {}
  bindEvents() {}
  goToPage(page) {
    if (!page || page > this.options.totalPage || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.rerender();
  }
  rerender() {
    this._checkButtons();
    let newNumbers = this._createNumbers();
    let oldNumbers = this.domRefs.numbers;
    oldNumbers.parentNode.replaceChild(newNumbers, oldNumbers);
    this.domRefs.numbers = newNumbers;
  }
  initHtml() {
    let pager = (this.domRefs.pager = document.createElement("nav"));
    this.domRefs.next = dom.create(this.options.templates.next);
    this._checkButtons();
    this.domRefs.numbers = this._createNumbers();
    // 此处省略 first prev  last
    pager.appendChild(this.domRefs.numbers);
    pager.appendChild(this.domRefs.next);
    this.options.element.appendChild(pager);
    return this;
  }
  _checkButtons() {}
  _createNumbers() {
    let currentPage = this.currentPage;
    let { buttonCount, totalPage } = this.options;
    let start1 = Math.max(currentPage - Math.round(buttonCount / 2), 1);
    let end1 = Math.min(start1 + buttonCount - 1, totalPage);
    let end2 = Math.min(
      currentPage + Math.round(buttonCount / 2) - 1,
      totalPage
    );
    let start2 = Math.max(end2 - buttonCount + 1, 1);
    let start = Math.min(start1, start2);
    let end = Math.max(end1, end2);

    let ol = dom.create('<ol data-role="pageNumbers"></ol>');
    let numbers = [];
    for (var i = start; i <= end; i++) {
      let li = dom.create(
        `<li data-page="${i}">${this.options.templates.number.replace(
          "%page%",
          i
        )}</li>`
      );
      if (i === currentPage) {
        li.classList.add("current");
      }
      ol.appendChild(li);
    }
    return ol;
  }
}
```

## Vue 插件版本

待更新...

#### 参考

-   [github - umd](https://github.com/umdjs/umd)
-   [如何定义一个高逼格的原生 JS 插件](https://www.jianshu.com/p/e65c246beac1)

The text was updated successfully, but these errors were encountered: