# Javascript模块化

## 前言

探究 Javascript 模块化进程，感叹发展迅速！

## IIFE

(Immediately-Invoked Function Expression) 自执行函数

```js
var myGradesCalculate = (function () {
    
  // Keep this variable private inside this closure scope
  var myGrades = [93, 95, 88, 0, 55, 91];
  
  var average = function() {
    var total = myGrades.reduce(function(accumulator, item) {
      return accumulator + item;
      }, 0);
      
    return'Your average grade is ' + total / myGrades.length + '.';
  };

  var failing = function() {
    var failingGrades = myGrades.filter(function(item) {
        return item < 70;
      });

    return 'You failed ' + failingGrades.length + ' times.';
  };

  // Explicitly reveal public pointers to the private functions 
  // that we want to reveal publicly

  return {
    average: average,
    failing: failing
  }
})();

myGradesCalculate.failing(); // 'You failed 2 times.' 
myGradesCalculate.average(); // 'Your average grade is 70.33333333333333.'
```

## CommonJS

Node.js 的 `module.exports`导出 与 `require` 的导入，采用同步模式。

## AMD

(Asynchronous Module Definition），代表`require.js`框架，充分利用浏览器的并发异步加载能力

## UMD

(Universal Module Definition)，前后端跨平台的解决方案(支持AMD与CommonJS模块方式),。

```js
// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));
```

## ES6 Modules

关键字就是`import` 与 `export`，作为 JavaScript 官方标准，日渐成为了开发者的主流选择。通过 Babel 等转化工具能帮我们巴 ES6 的模块机制 转化为 `CommonJS` 兼容。

### 参考文章

-   [JavaScript模块化编程简史（2009-2016）](https://yuguo.us/weblog/javascript-module-development-history/)
-   [JavaScript 模块演化简史](https://zhuanlan.zhihu.com/p/26231889)
-   [浏览器加载 CommonJS 模块的原理与实现](http://www.ruanyifeng.com/blog/2015/05/commonjs-in-browser.html)
-   [Javascript模块化编程（三）：require.js的用法](http://www.ruanyifeng.com/blog/2012/11/require_js.html)
-   [分析 Babel 转换 ES6 module 的原理](https://juejin.im/entry/5af3a3f6518825670d731cea)

The text was updated successfully, but these errors were encountered: