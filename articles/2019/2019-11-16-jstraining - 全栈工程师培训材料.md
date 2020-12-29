## 前言

-   [ruanyf/jstraining](https://github.com/ruanyf/jstraining)
    -   [demos - 课堂练习的操作指导](https://github.com/ruanyf/jstraining/tree/master/demos)

## 目录

**第一讲：前端开发的历史和趋势**

1.  前端开发的历史演变
2.  前端 MVC 框架的兴起
3.  前后端分离
4.  全栈工程师
5.  前端开发的未来

**第二讲：React 技术栈**

1.  React 的基本用法
2.  React 应用的架构

**第三讲：Node 应用开发**

1.  Node 的基本用法
2.  Restful API
3.  Express 框架搭建 Web 应用

**第四讲：前端工程简介**

1.  持续集成
2.  静态代码检查
3.  单元测试
4.  功能测试
5.  持续集成服务 Travis CI

## 前端开发的历史和趋势

> 前端是针对浏览器的开发，代码运行在浏览器

### 前后端不分的时代

互联网发展的早期，前后端开发是一体的，前端代码是后端代码的一部分。

前端被称为页面仔，实际上是模板工程师，负责编写页面模板。

后端采用 MVC 方式开发，前端所控制的的不完全 View 层由后端读取，使用模板方式，动态渲染。

[![MVC](https://github.com/ruanyf/jstraining/raw/master/docs/images/laravel-mvc.png)](https://github.com/ruanyf/jstraining/raw/master/docs/images/laravel-mvc.png)

#### [Ajax](https://zh.wikipedia.org/zh-cn/AJAX)

Ajax 技术诞生，改变了一切。

20世纪90年代，几乎所有的网站都由HTML页面实现，服务器处理每一个用户请求都需要重新加载网页。

Ajax 的最大优点，就是能在不更新整个页面的前提下异步维护数据。

许多事件使得Ajax被大众所接受：

-   2004年：Gmail
-   2005年：Google 地图

前端不再是后端的模板，可以独立得到各种数据。

#### [Web 2.0](https://zh.wikipedia.org/zh-cn/Web_2.0)

Ajax 技术促成了 Web 2.0 的诞生。

-   Web 1.0：静态网页，纯内容展示
-   Web 2.0：动态网页，富交互，前端数据处理

从那时起，前端变得复杂了，对前端工程师的要求越来越高。

产品例子:

-   全球： 维基百科, Twitter, Facebook, YouTube
-   中国： 豆瓣网，百度贴吧, 新浪微博,优酷网, QQ群

### 前后端分离

-   Ajax -> 前端应用兴起
-   智能手机 -> 多终端支持  
    这两个原因，导致前端开发方式发生根本的变化。

前端不再是后端 MVC 中的 V，而是单独的一层。

**REST 接口**

前后端分离以后，它们之间通过接口通信。

后端暴露出接口，前端消费后端提供的数据。

后端接口一般是 REST 形式，前后端的通信协议一般是 HTTP。

#### 前端 MVC 框架

前端通过 Ajax 得到数据，因此也有了处理数据的需求。

前端代码变得也需要保存数据、处理数据、生成视图，这导致了前  
端 MVC 框架的诞生

**Backbone.js**

> 2010 年

Backbone 将前端代码分成两个基本部分。

-   Model：管理数据
-   View：数据的展现

[![img](https://github.com/ruanyf/jstraining/raw/master/docs/images/backbone-model-view.png)](https://github.com/ruanyf/jstraining/raw/master/docs/images/backbone-model-view.png)

Backbone 只有 M 和 V，没有 C。因为，前端 Controller 与后端不同。

-   不需要，也不应该处理业务逻辑
-   只需要处理 UI 逻辑，响应用户的一举一动

所以，前端 Controller 相对比较简单。Backbone 没有 C，只用事件来处理 UI 逻辑。

### MVVM 模式

另一些框架提出 MVVM 模式，用 View Model 代替 Controller。

-   Model
-   View
-   View-Model：简化的 Controller，唯一作用就是为 View 提供处理好的数据，不含其他逻辑。

本质：view 绑定 view-model，视图与数据模型强耦合。数据的变化实时反映在 view 上，不需要手动处理。

[![](https://github.com/ruanyf/jstraining/raw/master/docs/images/mvvm.png)](https://github.com/ruanyf/jstraining/raw/master/docs/images/mvvm.png)

**Angular**

Google 公司推出的 Angular 是最流行的 MVVM 前端框架。

它的风格属于 HTML 语言的增强，核心概念是双向绑定。

**Vue**

Vue.js 是现在很热门的一种前端 MVVM 框架。

它的基本思想与 Angular 类似，但是用法更简单，而且引入了响应式编程的概念。

### SPA

> SPA = Single-page application

单页面应用，就是只有一张Web页面的应用，是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。

2010年后，前端工程师从开发页面，变成了开发“前端应用”（跑在浏览器里面的应用程序）。

### Node

2009年，Node 项目诞生，它是服务器上的 JavaScript 运行环境。

Node = JavaScript + 操作系统 API

**意义**

-   JavaScript 成为服务器脚本语言，与 Python 和 Ruby 一样
-   JavaScript 成为唯一的浏览器和服务器都支持的语言
-   前端工程师可以编写后端程序了

### 前端开发模式的根本改变

-   Node 环境下开发
-   大量使用服务器端工具
-   引入持续集成等软件工程的标准流程
-   开发完成后，编译成浏览器可以运行的脚本，放上 CDN

### 全栈工程师

前端工程师正在转变为全栈工程师

-   一个人负责开发前端和后端
-   从数据库到 UI 的所有开发

**全栈技能**

怎样才能称为全栈工程师？

-   传统前端技能：HTML、JavaScript、CSS
-   一门后端语言
-   移动端开发：iOS / Android / HTML5
-   其他技能：数据库、HTTP 等等

### 软件行业的发展动力

历史演变：前后端不分 -> 前后端分离 -> 全栈工程师

动力：更加产业化、大规模地生产软件

-   效率更高
-   成本更低
-   通用性好、能够快速产出的技术最终会赢，单个程序员的生产力要求越来越高。

**H5 就是一个最好的例子**

为什么 H5 技术会赢得移动端？

-   开发速度快：Native 需要重新编译才能看到结果，H5 是即时输出
-   开发成本低：Native 需要两个开发团队，H5 只要一个
-   快速发布：安卓 Native 新版本需要24小时，iOS 需要 3 ～ 4 天，H5 可以随时更新

### 前端开发的未来

**软件的特点**

-   联网
-   高并发
-   分布式
-   跨终端

现在基于 Web 的前端技术，将演变为未来所有软件的通用的 GUI（图形使用界面） 解决方案。

**只有两种软件工程师**

-   端工程师
    -   手机端
    -   PC 端
    -   TV 端
    -   VR 端
    -   ……
-   云工程师

## React 技术栈

Facebook 公司2013年推出，现在最好的社区支持和生态圈，大量的第三方工具

**React 的优点**

-   组件模式：代码复用和团队分工
-   虚拟 DOM：性能优势
-   移动端支持：跨终端

### React 的基本用法

-   JSX语法与Babel 转码器
-   React 组件语法
-   React 组件的参数（使用 Props 获取）
-   React 组件的状态（使用`setState`更新受控组件的内部状态）
-   React 组件实战（学写简单的 React 组件）
-   React 组件的生命周期（Ajax使用）
-   React 组件库（了解使用 [React­Bootstrap](https://react%C2%ADbootstrap.github.io/)，[ReCharts](http://recharts.org/))）

### React 的核心思想

View 是 State 的输出。

`view = f(state)`

上式中，f表示函数关系。只要 State 发生变化，View 也要随之变化。

React 的本质是将图形界面（GUI）函数化。

### React 没有解决的问题

React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。

如果开发大应用，还需要解决两个问题。

-   架构：大型应用程序应该如何组织代码？
-   通信：组件之间如何通信？

### React 应用的架构

React 架构的最重要作用：管理 Store 与 View 之间的关系。

Facebook 提出 Flux 架构的概念，被认为是 React 应用的标准架构。

[![](https://github.com/ruanyf/jstraining/raw/master/docs/images/flow.png)](https://github.com/ruanyf/jstraining/raw/master/docs/images/flow.png)

最大特点：数据单向流动。与 MVVM 的数据双向绑定，形成鲜明对比。

目前最流行的两个 React 架构

-   MobX：采用观察者模式，自动响应数据变化，state 是可变对象，适合中小型项目
-   Redux：Flux 的函数式实现，state 是不可变对象，适合大型项目

#### MobX 架构

MobX 的核心概念，就是组件是观察者，一旦  Store  有变化，会立  
刻被组件观察到，从而引发重新渲染。

```js
@observer
class App extends React.Component {
  render() {
    // ...
  }
}
```

UI 层是观察者，Store 是被观察者。

Store 所有的属性，分成两大类：直接被观察的属性和自动计算出来  
的属性。

```js
class Store {
  @observable name = 'Bartek';
  @computed get decorated() {
    return `${this.name} is awesome!`;
  }
}
```

UI 会观察到 Store 的变化，自动重新渲染。

#### Redux 架构

Redux 的核心概念

-   所有的状态存放在Store。组件每次重新渲染，都必须由状态变化引起。  
    用户在 UI 上发出action。
-   reducer函数接收action，然后根据当前的state，计算出新的state。

[![img](https://github.com/ruanyf/jstraining/raw/master/docs/images/redux-architecture.png)](https://github.com/ruanyf/jstraining/raw/master/docs/images/redux-architecture.png)

## Node 开发

Node 是服务器的 JavaScript 运行环境，提供 API 与操作系统互动。

主要用途：

-   开发前端应用
-   快速搭建服务
-   架设网站

### Node 的基本用法

**npm**

安装 Node 的时候，会同时安装 npm。

`$ npm -v`

它是 Node 的模块管理器，开发 Node 项目的必备工具。

**Node 开发前端脚本的好处**

1. 模块机制

2. 版本管理

3. 对外发布

4. 持续集成的标准开发流程

### Restful API

REST 是浏览器与服务器通信方式的一种设计风格。

它的全称是“REpresentational State Transfer”，中文意为“表现层状态转换”。

-   Resource：资源
-   Representation：表现层
-   State：状态
-   Transfer：转换

**核心概念**

-   互联网上所有可以访问的内容，都是资源。
-   服务器保存资源，客户端请求资源。
-   同一个资源，有多种表现形式。
-   协议本身不带有状态，通信时客户端必须通过参数，表示请求不同状态的资源。
-   状态转换通过HTTP动词表示。

**HTTP 动词**

| 操作 | SQL方法 | HTTP动词 |
| --- | --- | --- |
| CREATE | INSERT | POST |
| READ | SELECT | GET |
| UPDATE | UPDATE | PUT/PATCH |
| DELETE | DELETE | DELETE |

```shell
POST /v1/stores
GET /v1/stores/1234
PUT /v1/stores/1234
DELETE /v1/stores/1234
```

### Express 框架搭建 Web 应用

**动态端口设定**

```js
var express    = require('express');
var app        = express();
var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
  res.send('<h1>Hello World</h1>');
});

app.use('/home', router);
app.listen(port);
console.log('Magic happens on port ' + port);
```

上面代码指定了外部访问的端口，如果环境变量没有指定，则端口默认为8080。最后两行是启动应用，并输出一行提示文字。

通过环境变量，自定义启动端口。

假定我们指定必须启动在7070端口，命令行可以这样操作。

```shell
# Linux & Mac
$ PORT=7070 node app1.js

# windows cmd / (git cmd)
$ set PORT=7070
$ node app1.js

# windows powershell
$ $env:PORT=7070
$ node app1.js
```

**传递参数的方式**

1.  路由路径传参，浏览器访问`localhost:8080/home/张三`，输出`Hello 张三`。

```js
router.get("/:name", function(req, res) {
  res.send("<h1>Hello " + req.params.name + "</h1>");
});
```

2.  Http POST 方法传参

```js
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

router.post("/", function(req, res) {
  var name = req.body.name;
  res.json({ message: "Hello " + name });
});
```

使用 Postman 模拟发出 POST 请求：

```shell
POST /home HTTP/1.1
Host: 127.0.0.1:8080
Content-Type: application/x-www-form-urlencoded

name=Alice
```

3.  浏览器地址添加 query 参数,访问 `http://localhost:8080/home?name=Rainbow`返回 `Hello Rainbow`

```js
router.get("/", function(req, res) {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});
```

**中间件**

对 HTTP 请求进行加工。

```js
router.use(function(req, res, next) {
  console.log('There is a requesting.');
  next();
});
```

## 前端工程 - 流程篇

### 持续集成

**概念**

Continuous integration（简称 CI）

开发代码频繁地合并进主干，始终保持可发布状态的这个过程。

优点

-   快速发现错误
-   防止分支大幅偏离主干
-   让产品可以快速迭代，同时还能保持高质量

### 流程

前端开发转移到后端环境，意味着可以适用标准的软件工程流程。

1. 本地开发（developing）

2. 静态代码检查（linting）

3. 单元测试（testing）

4. 合并进入主干（merging）

5. 自动构建（building）

6. 自动发布（publishing）

### 静态代码检查工具

ESLint：

-   发现语法错误
-   发现风格错误
-   自动纠正错误

安装相关模块，设置代码检查的风格, 这里使用的是 Airbnb 公司的规则

```shell
npm install eslint eslint-plugin-import eslint-config-airbnb-base --save-dev
```

项目更目录添加配置文件 `eslintrc.json`，指定检验规则

```json
{
  "extends": "airbnb-base"
}
```

项目的`package.json`文件

```json
{
  // ...
  "scripts" : {
    "lint": "eslint **/*.js",
    "lint-html": "eslint **/*.js -f html -o ./reports/lint-results.html",
    "lint-fix": "eslint --fix **/*.js"
  },
  // ...
}
```

上面代码新定义了三个脚本，运行方式 `npm run lint | yarn lint`, 它们的作用如下:

-   `lint`：检查所有js文件的代码
-   `lint-html`：将检查结果写入一个网页文件./reports/lint-results.html
-   `lint-fix`：自动修正某些不规范的代码

### 单元测试

**为什么写测试？**

Web 应用越来越复杂，意味着更可能出错。测试是提高代码质量、降低错误的最好方法之一。

-   测试可以确保得到预期结果。
-   加快开发速度。
-   方便维护。
-   提供用法的文档。
-   对于长期维护的项目，测试可以减少投入时间，减轻维护难度。

**测试的类型**

-   单元测试（unit testing）
-   功能测试（feature testing）
-   集成测试（integration testing）
-   端对端测试 (End-to-End testing）

**使用 Mocha 进行单元测试**

> test: 1 + 1 = 2

-   [mocha-demo](https://github.com/ruanyf/jstraining/tree/master/demos/mocha-demo)

**使用 Nightmare 进行功能测试**

> test: 首先打开网页，点击h1元素，然后等待 1 秒钟，判断获取h1元素的文本内容与期望值是否一致。

-   [nightmare-demo](https://github.com/ruanyf/jstraining/tree/master/demos/nightmare-demo)

```js
it('点击后标题改变', function(done) {
    var nightmare = Nightmare({ show: true });
    nightmare
      .goto('http://127.0.0.1:8080/index.html')
      .click('h1')
      .wait(1000)
      .evaluate(function () {
        return document.querySelector('h1').textContent;
      })
      .end()
      .then(function(text) {
        expect(text).to.equal('Hello Clicked');
        done();
      })
  });
```

### 持续集成服务平台

代码合并进主干以后，就可以进行自动构建和发布了。

Travis CI 提供持续集成服务。它可以根据你提供的脚本，自动完成构建和发布。

添加`.travis.yml`配置文件,构建时默认依次执行以下九个脚本。

-   `before_install`
-   `install`
-   `before_script`
-   `script`
-   `after_success` 或者 `after_failure`
-   `after_script`
-   `before_deploy`（可选）
-   `deploy`（可选）
-   `after_deploy`（可选）

在 before\_install、before\_script之前，或者after\_script之后，都可以运行自定义命令，详细资料可参考官方文档：Job Lifecycle

完整的配置文件

```shell
language: node_js
node_js: stable

cache:
  directories:
    - node_modules

install:
  - npm install

script:
  - hexo g

after_script:
  - cd ./public
  - git init
  - git config user.name "your-git-name"
  - git config user.email "your-email-address"
  - git add .
  - git commit -m "Update blog content by Travis CI"
  - git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master

branches:
  only:
    - master
```

#### 拓展链接

-   [阮一峰 - 持续集成是什么？](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)
-   [前端工程——基础篇](https://github.com/fouber/blog/issues/10)
-   [使用 Travis CI 实现 Hexo 博客自动部署](https://xirikm.net/2019/826-2)

The text was updated successfully, but these errors were encountered: