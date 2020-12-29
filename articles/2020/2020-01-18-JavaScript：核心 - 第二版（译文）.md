> [原文链接](http://www.xiaojichao.com/post/jscorev2.html)

-   [对象](#%E5%AF%B9%E8%B1%A1)
-   [原型](#%E5%8E%9F%E5%9E%8B)
-   [类](#%E7%B1%BB)
-   [执行上下文](#%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87)
-   [环境](#%E7%8E%AF%E5%A2%83)
-   [闭包](#%E9%97%AD%E5%8C%85)
-   [This](#This)
-   [域](#%E5%9F%9F)
-   [作业](#%E4%BD%9C%E4%B8%9A)
-   [代理](#%E4%BB%A3%E7%90%86)

> 原文地址：[http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
> 
> 译者注：Dmitry Soshnikov 是 Facebook 软件工程师，ECMAScript 理论家。他编写的[《ECMAScript in detail》](http://dmitrysoshnikov.com)系列文章是对 ECMAScript 规范最优秀的解析，已经被翻译成多国语言（包括中文）。

* * *

这是[JavaScript：核心](http://dmitrysoshnikov.com/ecmascript/javascript-the-core/)概述讲稿的_第二版_，致力于 ECMAScript 编程语言及其运行时系统的核心组件。

**目标人群**：有经验的程序员、专家。

本文的[第一版](http://dmitrysoshnikov.com/ecmascript/javascript-the-core/)涵盖了 JS 语言的通用方面，主要讲解了旧式 ES3 规范中的概念，并参考了在 ES5 和 ES6（即 ES2015）中的一些变化。

从 ES2015 开始，规范修改了一些核心组件的描述和结构，引入了新的模型等等。所以在这个版本中，我们会关注较新的概念以及更新了的术语，但是依然保留在规范各个版本中保持一致的最基本的 JS 结构。

本文涵盖了 ES2017+运行时系统。

> **注：**[ECMAScript 规范](https://tc39.github.io/ecma262/)的最新版本可以在 TC-39 网站上找到。

我们从讨论 ECMAScript 最基础的概念_对象_开始。

## 对象

ECMAScript 是一门_面向对象_的编程语言，它_基于原型_，以_对象_作为其核心概念。

\*\*定义. 1: 对象:\*\*\*对象_是_属性的集合\*，并且有\*一个原型对象\*。原型要么是一个对象，要么是`null`值。

我们来看一个简单的对象示例。一个对象的原型是被内部的`[[Prototype]]`属性引用，通过`__proto__`属性暴露给用户级代码。

对于如下代码：

```js
let point = {
  x: 10,
  y: 20,
};
```

其结构中带有两个_显式的自有属性_和一个_隐式_的`__proto__`属性，`__proto__`属性是对`point`的原型的引用：

[![alt](https://camo.githubusercontent.com/12df6bb089d125fc90a4f5f1c898a752033afdd43f2ee6d7a482d32b3c683382/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f565550497848315f545277766b39494a416c6a632e706e67)](https://camo.githubusercontent.com/12df6bb089d125fc90a4f5f1c898a752033afdd43f2ee6d7a482d32b3c683382/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f565550497848315f545277766b39494a416c6a632e706e67)[![alt](https://camo.githubusercontent.com/12df6bb089d125fc90a4f5f1c898a752033afdd43f2ee6d7a482d32b3c683382/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f565550497848315f545277766b39494a416c6a632e706e67)](https://camo.githubusercontent.com/12df6bb089d125fc90a4f5f1c898a752033afdd43f2ee6d7a482d32b3c683382/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f565550497848315f545277766b39494a416c6a632e706e67)

图 1. 带有原型的基本对象

> \*\*注：\*\*对象也可以存储_symbol_。有关 symbol 的更多信息，请参考[这份文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。

原型对象用于以_动态调度_机制实现_继承_。下面我们研究一下_原型链_的概念，详细看看这种机制是怎么回事。

## 原型

每个对象在创建时都会得到其_原型_（prototype）。如果原型没有_显式_设置，对象会以_默认原型_作为其_继承对象_。

\*\*定义 2. 原型：\*\*\*原型_是用于实现_基于原型的继承\*的委托对象。

原型可以通过用`__proto__`属性或者`Object.create()`方法_显式_设置：

```js
// 基对象
let point = {
  x: 10,
  y: 20,
};
// 继承自point对象
let point3D = {
  z: 30,
  __proto__: point,
};
console.log(
  point3D.x, // 10, 继承来的
  point3D.y, // 20, 继承来的
  point3D.z, // 30, 自有的
);
```

> \*\*注：\*\*默认情况下，对象以`Object.prototype`作为其继承对象。

所有对象都可以作为另一个对象的原型，而且原型本身也可以有自己的原型。如果一个原型有一个对其原型的非空引用，依此类推，就称为_原型链_。

\*\*定义 3：原型链：\*\*原型链是用于实现_继承_和_共享属性_的_有限_对象链。

[![alt](https://camo.githubusercontent.com/2d551984ed7796e8c40772f2ddeed59c084d6538e4c6cfafa87d9d5ab028319e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f307a35366c427837504a3458464b6e4b5936696f2e706e67)](https://camo.githubusercontent.com/2d551984ed7796e8c40772f2ddeed59c084d6538e4c6cfafa87d9d5ab028319e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f307a35366c427837504a3458464b6e4b5936696f2e706e67)[![alt](https://camo.githubusercontent.com/2d551984ed7796e8c40772f2ddeed59c084d6538e4c6cfafa87d9d5ab028319e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f307a35366c427837504a3458464b6e4b5936696f2e706e67)](https://camo.githubusercontent.com/2d551984ed7796e8c40772f2ddeed59c084d6538e4c6cfafa87d9d5ab028319e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f307a35366c427837504a3458464b6e4b5936696f2e706e67)

图 2. 原型链

规则很简单：如果一个属性在对象本身中找不到，就试图在原型中_解析_；如果还找不到，就到原型的原型中找，等等 - 直到找完整个原型链。

从技术上讲，这种机制被称为_动态调度_（dynamic dispatch）或者_委托_。

**定义 4：委托（Delegation）：**一种用于在继承链中解析一个属性的机制。这个过程发生在运行时，因此也称为**动态调度**（dynamic dispath）。

> \*\*注：\*\*\*静态调度_是在_编译时_解析引用，而_动态调度_是在_运行时\*解析引用。

并且，如果一个属性最终在原型链中找不到，就返回`undefined`值：

```js
// 一个"空"对象
let empty = {};
console.log(
  // 来自默认运行的函数
  empty.toString,
  // undefined
  empty.x,
);
```

正如我们所见，默认对象实际上_永远不会是空的_ - 它总会从`Object.prototype`继承_一些东西_。如果要创建一个_无原型的词典_，我们必须显式将其原型设置为`null`：

```js
// 不继承任何东西。
let dict = Object.create(null);
console.log(dict.toString); // undefined
```

_动态调度_机制允许继承链的_完全可变性_，提供改变委托对象的能力：

```js
let protoA = { x: 10 };
let protoB = { x: 20 };
// 与`let objectC = {__proto__: protoA};`相同:
let objectC = Object.create(protoA);
console.log(objectC.x); // 10
// 改变委托：
Object.setPrototypeOf(objectC, protoB);
console.log(objectC.x); // 20
```

> \*\*注：\*\*即使现在`__proto__`属性被标准化了，并且它更容易用于解释，但是在实践中对原型操作更喜欢用 API 方法，比如`Object.create`、`Object.getPrototypeOf`、`Object.setPrototypeOf`以及类似的`Reflect`模块。

在`Object.prototype`示例中，我们看到_同样的原型_可以在_多个对象_之间共享。在这个原则的基础上，ECMAScript 中就实现了_基于类的继承_。下面我们看看这个示例，看看 JS 中`"类"`概念背后的机制。

## 类

当多个对象共享相同的初始状态以及行为时，它们就形成了一种_分类_（classification）。

\*\*定义 5：类（class）：\*\*一个类是一种形式化的概念集合，指定其对象的初始状态和行为。

假如我们需要有_多个对象_，这些对象都继承自同一个原型，我们自然会先创建这个原型，然后显式从新创建的对象继承它：

```js
// 所有字母的通用原型
let letter = {
  getNumber() {
    returnthis.number;
  },
};
let a = { number: 1, __proto__: letter };
let b = { number: 2, __proto__: letter };
// ...
let z = { number: 26, __proto__: letter };
console.log(
  a.getNumber(), // 1
  b.getNumber(), // 2
  z.getNumber(), // 26
);
```

我们可以在下图看到这些关系：

[![alt](https://camo.githubusercontent.com/02764b43a72ca593c418e62ba224fd7d3284e6a91724bae79f3d62fd755bb209/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5355325031423437744572636c414d326559644a2e706e67)](https://camo.githubusercontent.com/02764b43a72ca593c418e62ba224fd7d3284e6a91724bae79f3d62fd755bb209/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5355325031423437744572636c414d326559644a2e706e67)[![alt](https://camo.githubusercontent.com/02764b43a72ca593c418e62ba224fd7d3284e6a91724bae79f3d62fd755bb209/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5355325031423437744572636c414d326559644a2e706e67)](https://camo.githubusercontent.com/02764b43a72ca593c418e62ba224fd7d3284e6a91724bae79f3d62fd755bb209/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5355325031423437744572636c414d326559644a2e706e67)

图 3. 共享的原型

不过，这显然_很麻烦_。而类正是干这事的，它作为一种语法糖（即在语义上做同样事情的构造，不过是以更好的语法形式），允许用方便的模式创建这样的多个对象：

```js
class Letter {
  constructor(number) {
    this.number = number;
  }
  getNumber() {
    returnthis.number;
  }
}
let a = new Letter(1);
let b = new Letter(2);
// ...
let z = new Letter(26);
console.log(
  a.getNumber(), // 1
  b.getNumber(), // 2
  z.getNumber(), // 26
);
```

> \*\*注：\*\*在 ECMAScript 中，_基于类的继承_是在_基于原型的代理_基础上实现的。
> 
> **注：\***'类'_只是一个_理论上的概念\*。从技术上讲，它可以用像在 Java 或者 C++那样，用_静态调度_实现，或者像在 JavaScript、Python、Ruby 等中那样，用\*动态调度（委托）\*实现。

从技术上讲，一个类被表示为一对_构造函数+原型_。因此，构造函数_创建对象_，同时还_自动_为它新创建的实例设置_原型_。这个原型被存储在`<ConstructorFunction>.prototype`属性中。

\*\*定义 6：构造函数：\*\*\*构造函数\*是一个用于创建实例，并自动设置实例的原型的函数。

可以显式使用构造函数。而且，在引入类的概念之前，JS 开发者过去也没有更好的替代品（我们依然可以在互联网上找到很多这样的遗留代码）：

```js
function Letter(number) {
  this.number = number;
}
Letter.prototype.getNumber = function() {
  returnthis.number;
};
let a = new Letter(1);
let b = new Letter(2);
// ...
let z = new Letter(26);
console.log(
  a.getNumber(), // 1
  b.getNumber(), // 2
  z.getNumber(), // 26
);
```

而且然创建单层构造函数很容易，不过这种从父类继承的模式需要相当多的样板代码。目前这个样板代码是作为_实现细节_隐藏的，而这恰好就是在 JavaScript 创建类时背后发生的事情。

> \*\*注：\*\*\*构造函数_只是基于类的继承的_实现细节\*。

下面我们来看看对象及其类的关系：

[![alt](https://camo.githubusercontent.com/efd5799434ea5c2f4846dfd4674871920da570f77203ae752fa3dec730d2afc5/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f3865753359667a7a556a6e6e3733366c347441452e706e67)](https://camo.githubusercontent.com/efd5799434ea5c2f4846dfd4674871920da570f77203ae752fa3dec730d2afc5/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f3865753359667a7a556a6e6e3733366c347441452e706e67)[![alt](https://camo.githubusercontent.com/efd5799434ea5c2f4846dfd4674871920da570f77203ae752fa3dec730d2afc5/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f3865753359667a7a556a6e6e3733366c347441452e706e67)](https://camo.githubusercontent.com/efd5799434ea5c2f4846dfd4674871920da570f77203ae752fa3dec730d2afc5/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f3865753359667a7a556a6e6e3733366c347441452e706e67)

图 4. 构造函数和对象的关系

上图表明，_每个对象_都有一个相关的原型。甚至构造函数（类）`Letter`也有它自己的原型`Function.prototype`。注意，这个`Letter.prototype`是 Letter 的_实例_（即`a`、`b`和`z`）的原型。

> \*\*注：\*\*\*任何_对象的_实际_原型总是`__proto__`引用。而构造函数上的显式`prototype`属性只是一个对其_实例\*的原型的引用；在实例上，它依然是被`__proto__`引用。详情请参见[这里](http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/#explicit-codeprototypecode-and-implicit-codeprototypecode-properties)。

我们可以在[ES3. 7.1 OOP：通用理论](http://dmitrysoshnikov.com/ecmascript/chapter-7-1-oop-general-theory/) 这篇文章中找到有关通用 OOP 概念的详细讨论（包括基于类、基于原型等的详细描述）。

现在我们已经理解了 ECMAScript 对象之间的基本关系，下面我们深入看看 JS_运行时系统_。我们会看到，这里几乎所有东西也都可以被表示为对象。

## 执行上下文

为执行 JS 代码，并跟踪其运行时求值，ECMAScript 规范定义了_执行上下文_的概念。从逻辑上讲，执行上下文是用_栈_（_执行上下文栈_的简写）来维护的，栈与_调用栈_这个通用概念有关。

\*\*定义 7：执行上下文（Execution Context）：\*\*执行上下文是用于跟踪运行时代码求值的一个规范设备。

ECMAScript 代码有几种类型：_全局代码_、_函数代码_、_`eval`代码_和_模块代码_；每种代码都是在其执行上下文中求值。不同的代码类型及其对应的对象可能会影响执行上下文的结构：比如，_generator 函数_将其_generator 对象_保存在上下文中。

下面我们考虑一个递归函数调用：

```js
function recursive(flag) {
  // 退出条件
  if (flag === 2) {
    return;
  }
  // 递归调用。
  recursive(++flag);
}
// Go.
recursive(0);
```

当函数被调用时，就创建了一个_新的执行上下文_，并被_压_到栈中 - 此时，它变成一个_活动的执行上下文_。当函数返回时，其上下文被从栈中_弹出_。

调用另一个上下文的上下文被称为_调用者_（caller）。被调用的上下文相应地被称为_被调用者_（callee）。在我们的例子中，`recursive`函数在递归调用它本身时，同时扮演了这两个角色：既是调用者，又是被调用者。

\*\*定义 8：执行上下文栈：\*\*\*执行上下文栈\*是一种 LIFO（后进先出）结构，用于维护控制流程和执行顺序。

对于上面的例子，有如下的栈\*"压入-弹出"\*变动图：

[![alt](https://camo.githubusercontent.com/8da72c8d865354f19aade9cda3886f39516d16f317d1dd9f0b770f5146c4249d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70566437664e614e76547a795f725f6a57436b332e706e67)](https://camo.githubusercontent.com/8da72c8d865354f19aade9cda3886f39516d16f317d1dd9f0b770f5146c4249d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70566437664e614e76547a795f725f6a57436b332e706e67)[![alt](https://camo.githubusercontent.com/8da72c8d865354f19aade9cda3886f39516d16f317d1dd9f0b770f5146c4249d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70566437664e614e76547a795f725f6a57436b332e706e67)](https://camo.githubusercontent.com/8da72c8d865354f19aade9cda3886f39516d16f317d1dd9f0b770f5146c4249d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70566437664e614e76547a795f725f6a57436b332e706e67)

图 5. 执行上下文栈

从图中我们还可以看到，_全局上下文_（Global context）总是在栈的底部，它是由之前任何其它上下文的执行创建的。

我们可以在[对应的章](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)找到执行上下文的更多详细资料。

通常，一个上下文的代码会一直运行到结束，不过正如我们上面提到过的，有些对象，比如 generator，可能会违反栈的 LIFO 顺序。一个 generator 函数可能会挂起其正在执行的上下文，并在结束前将其从栈中删除。一旦 generator 再次激活，它上下文就被回复，并再次压入栈中：

```js
function* gen() {
  yield 1;
  return2;
}
let g = gen();
console.log(
  g.next().value, // 1
  g.next().value, // 2
);
```

这里的`yield`语句将值返回给调用者，并弹出上下文。在第二个`next`调用时，同一个上下文被再次压入栈中，并恢复。这样的上下文可能会比创建它的调用者活得长，所以会违反 LIFO 结构。

> \*\*注：\*\*我们可以在[这个文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)中阅读有关 generator 和 iterator 的更多资料。

下面我们要讨论执行上下文的最重要的部分；特别是我们应该看到 ECMAScript 运行时如何管理变量存储以及由嵌套代码块创建的作用域。这就是_词法环境_的通常概念，它用来在 JS 中存储数据，并用_闭包_的机制解决\*'Funarg 问题'\*。

## 环境

每个执行上下文都有一个相关联的_词法环境_。

\*\*定义 9：词法环境（lexical environment）：\*\*词法环境是一种用于定义出现在上下文中的_标识符_与其值之间的关联的结构。每个环境有一个对_可选的父环境_的引用。

所以，环境就是定义在一个作用域中的变量、函数和类的_仓库_（storage）。

从技术上讲，环境是由_一对\*\*环境记录（Environment Record）_（一个将标识符映射到值的实际存储表）以及对父的引用（可能是`null`）组成的。

对于如下代码：

```js
let x = 10;
let y = 20;
function foo(z) {
  let x = 100;
  return x + y + z;
}
foo(30); // 150
```

_全局上下文_以及`foo`函数的上下文的环境结构看起来会像下面这样：

[![alt](https://camo.githubusercontent.com/eb6dcd49f7bf20aca15e43a62ac5a3c69ad3e521b4e3c7496fd76564457a824e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5f345f6943543469326e57636b3744584f42335f2e706e67)](https://camo.githubusercontent.com/eb6dcd49f7bf20aca15e43a62ac5a3c69ad3e521b4e3c7496fd76564457a824e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5f345f6943543469326e57636b3744584f42335f2e706e67)[![alt](https://camo.githubusercontent.com/eb6dcd49f7bf20aca15e43a62ac5a3c69ad3e521b4e3c7496fd76564457a824e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5f345f6943543469326e57636b3744584f42335f2e706e67)](https://camo.githubusercontent.com/eb6dcd49f7bf20aca15e43a62ac5a3c69ad3e521b4e3c7496fd76564457a824e/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f5f345f6943543469326e57636b3744584f42335f2e706e67)

图 6. 环境链

在逻辑上讲，这会让我们回想起了上面已经讨论过的_原型链_。而_标识符解析_的规则是很相似的：如果一个变量在_自己的_环境中_找不到_，就试着在_父环境_、父环境的父环境中查找它，依此类推，直到查完整个_环境链_。

\*\*定义 10：标识符解析（Identifier Resolution）：\*_在一个环境链中解析一个变量_（绑定）\*的过程。一个解析不出来的绑定会导致`ReferenceError`。

这就解释了为什么变量`x`被解析为`100`，而不是`10`？因为它是直接在`foo`的_自身_环境中找到的；为什么可以访问参数`z`？因为它也是只存储在_激活环境_（activation environment）中；为什么我们还可以访问变量`y`？因为它是在父环境中找到的。

与原型类似，同一个父环境可以被几个子环境共享：比如，两个全局函数共享同一个全局环境。

> 注：有关词法环境的详细信息可以参考[本文](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/).

环境记录根据类型而有所不同。有**对象**环境记录和**声明式**环境记录。在声明式记录之上，还有**函数**环境记录和**模块**环境记录。每种类型的记录都有其特定的属性。不过，标识符解析的通用机制对于所有环境都是通用的，并且不依赖于记录的类型。

_全局环境_的记录就是_对象环境记录_的一个例子。这样的记录也有关联的_绑定对象_，该对象会存储一些来自该记录的属性，但是不会存储来自其它记录的属性，反之亦然。绑定对象也可以被提供为`this`值。

```js
// 旧式用`var`声明的变量。
var x = 10;
// 现代用`let`声明的变量。
let y = 20;
// 二者都被添加到环境记录：
console.log(
  x, // 10
  y, // 20
);
// 但是只有`x`被添加到"绑定对象"。
// 全局环境的绑定对象是鳏居对象，等于`this`：
console.log(
  this.x, // 10
  this.y, // undefined!
);
// 绑定对象可以存储一个名称，该名称不添加到环境记录，
// 因为它不是一个有效的标识符：
this['not valid ID'] = 30;
console.log(
  this['not valid ID'], // 30
);
```

可以用下图来描述：

[![alt](https://camo.githubusercontent.com/ebd22df88bf02a18a21b6653f8b002e7d9cbc97a0c79a2dc0bb3fc3c4be2d625/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f744a457832495549476a37626f63457133724c332e706e67)](https://camo.githubusercontent.com/ebd22df88bf02a18a21b6653f8b002e7d9cbc97a0c79a2dc0bb3fc3c4be2d625/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f744a457832495549476a37626f63457133724c332e706e67)[![alt](https://camo.githubusercontent.com/ebd22df88bf02a18a21b6653f8b002e7d9cbc97a0c79a2dc0bb3fc3c4be2d625/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f744a457832495549476a37626f63457133724c332e706e67)](https://camo.githubusercontent.com/ebd22df88bf02a18a21b6653f8b002e7d9cbc97a0c79a2dc0bb3fc3c4be2d625/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f744a457832495549476a37626f63457133724c332e706e67)

图 7. 绑定对象

注意，绑定对象的存在是为了涵盖_旧式构造_（比如`var`声明和`with`语句），这种构造也将其对象作为绑定对象提供。这些是环境被表示为简单对象时的历史原因。当前的环境模型更加优化，不过结果是我们再也不能将绑定当作属性来访问了。

我们已经看到环境是如何通过父链接关联。下面我们将看到环境如何比创建它的上下文存活得更久，这是我们将要讨论的_闭包_机制的基础。

## 闭包

ECMAScript 中的函数是_一等公民_。这个概念是_函数式编程_的基础，而 JavaScript 中是支持函数式编程的。

\*\*定义. 11：一等函数（First-class Function）：\*\*可以作为普通数据参与的一个函数：可以存储在一个变量中，作为实参传递、或者作为另一个函数的返回值返回。

与一等函数相关的是所谓["Funarg 问题"](https://en.wikipedia.org/wiki/Funarg_problem)（或者\*"函数式实参问题"_）。这个问题是在函数不得不处理_自由变量\*时候出现的。

\*\*定义. 12：自由变量（Free Variable）：\*\*一个既不是函数的形参，也不是函数的局部变量的变量。

下面我们来看看 Funarg 问题，看看在 ECMAScript 中如何解决这个问题。

考虑如下的代码段：

```js
let x = 10;
function foo() {
  console.log(x);
}
function bar(funArg) {
  let x = 20;
  funArg(); // 10, 而不是20!
}
// 将 `foo` 作为实参传给 `bar`。
bar(foo);
```

对于函数`foo`，变量`x`就是自由变量。当`foo`函数被激活时（通过`funArg`形参），它在哪里解析`x`绑定呢？是从创建函数的外层作用域，还是从调用者作用域，还是从函数被调用的地方？我们可以看到，调用者`bar`函数也提供了对`x`的绑定（值为`20`）。

上面描述的情况称为_向下 funarg 问题_，即在判断绑定的正确环境时的歧义性：它应该是创建时的环境，还是调用时的环境？

这是通过达成协议使用_静态作用域_来解决的，静态作用域是_创建时_的作用域。

\*\*定义 13：静态作用域：\*\*如果一个语言只通过查找源代码，就可以判断绑定在哪个环境中解析，那么该语言就实现了_静态作用域_。

静态作用域有时也称为_词法作用域_，这也是_词法环境_这个名称的由来。

从技术上讲，静态作用域是通过捕获函数创建所在的环境来实现的。

> \*\*注：\*\*可以在[本文](https://codeburst.io/js-scope-static-dynamic-and-runtime-augmented-5abfee6223fe)中阅读有关静态和动态作用域知识。

在我们的例子中，`foo`函数捕获的环境是_全局环境_：

[![alt](https://camo.githubusercontent.com/a131aa50850840d37e5813c2e43b9e3a953e01694bfefd4451d78561b0d6d9f7/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f504271465f66654b597363444767703673656e5f2e706e67)](https://camo.githubusercontent.com/a131aa50850840d37e5813c2e43b9e3a953e01694bfefd4451d78561b0d6d9f7/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f504271465f66654b597363444767703673656e5f2e706e67)[![alt](https://camo.githubusercontent.com/a131aa50850840d37e5813c2e43b9e3a953e01694bfefd4451d78561b0d6d9f7/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f504271465f66654b597363444767703673656e5f2e706e67)](https://camo.githubusercontent.com/a131aa50850840d37e5813c2e43b9e3a953e01694bfefd4451d78561b0d6d9f7/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f504271465f66654b597363444767703673656e5f2e706e67)

图 8. 闭包

我们可以看到，一个环境引用一个函数，而这个函数又引用_回_该环境。

\*\*定义. 14：闭包：\*\*\*闭包_是一个函数捕获它被定义时所在的环境。这个环境被用于_标识符解析\*。

> \*\*注：\*\*一个函数是在一个新的激活环境中被调用的，这个环境存储了_本地变量_和_实参_。该激活环境的_父环境_被设置为该函数的_闭合环境_，从而有了_词法作用域_的语义。

Funarg 问题的第二种子类型被称为**向上 funarg 问题**。这里唯一的区别是捕获的环境比创建它的上下文存活得更久。

下面我们看一个例子：

```js
function foo() {
  let x = 10;
  // 闭包，捕获`foo`的环境。
  function bar() {
    return x;
  }
  // 向上funarg。
  return bar;
}
let x = 20;
// 调用`foo`来返回`bar`闭包。
let bar = foo();
bar(); // 10，而不是20!
```

同样，从技术上讲，它与捕获定义环境的确切机制没有什么不同。就在这种情况下，如果没有闭包，`foo`的激活环境将被销毁。但我们捕获了它，所以它_不能被释放_，并保留下来，以支持_静态作用域_语义。

对闭包的理解经常不完整 - 开发者通常认为闭包只是与向上的 funarg 问题有关（实际上它确实更有意义）。不过，正如我们所见，_向下_和_向上 funarg 问题_的技术机制是_完全相同的_，就是_静态作用域的机制_。

正如我们上面所提到的，与原型相似，同一个父环境可以在几个闭包之间共享。这样，就可以访问和修改共享的数据：

```js
function createCounter() {
  letcount = 0;
  return {
    increment() {
      count++;
      returncount;
    },
    decrement() {
      count--;
      returncount;
    },
  };
}
let counter = createCounter();
console.log(
  counter.increment(), // 1
  counter.decrement(), // 0
  counter.increment(), // 1
);
```

因为两个闭包`increment`和`decrement`都是在包含`count`变量的作用域内创建的，所以它们_共享_这个_父作用域_。即，捕获总是_通过引用_发生的，也就是说对_整个父环境_的_引用_被存储下来了。

我们可以在下图看到：

[![alt](https://camo.githubusercontent.com/2288e82e276ff2fa49ef58be222fe3df2683190ecdda3d88634498b858390510/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f6a494d4662503046354f45525a794652785435482e706e67)](https://camo.githubusercontent.com/2288e82e276ff2fa49ef58be222fe3df2683190ecdda3d88634498b858390510/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f6a494d4662503046354f45525a794652785435482e706e67)[![alt](https://camo.githubusercontent.com/2288e82e276ff2fa49ef58be222fe3df2683190ecdda3d88634498b858390510/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f6a494d4662503046354f45525a794652785435482e706e67)](https://camo.githubusercontent.com/2288e82e276ff2fa49ef58be222fe3df2683190ecdda3d88634498b858390510/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f6a494d4662503046354f45525a794652785435482e706e67)

图 9. 一个共享的环境

有些语言会_通过值_捕获，给被捕获的变量做个副本，并且不允许在父作用域中修改它。不过在 JS 中，再说一遍，它总是对父作用域的_引用_。

> \*\*注：\*\*JS 引擎实现可能会优化这个步骤，并且不会捕获整个环境，只捕获要用的自由变量，然后依然在父作用域中维护可变数据的不变量。

有关闭包和 Funarg 问题的详细讨论，可以在[对应的章节](http://dmitrysoshnikov.com/ecmascript/chapter-6-closures/)中找到。

所以所有标识符都是静态作用域的。不过，在 ECMAScript 中有一个值是_动态作用域_的。就是`this`的值。

## This

`this`值是一个_动态_并_隐式_传给一个上下文的代码的特殊对象。我们可以把它当作是一个_隐式的额外形参_，能够访问，但是不能修改。

`this`值的用途是为多个对象执行相同的代码。

**定义 15：this：**`this`是一个隐式的_上下文对象_，可以从一个执行上下文的代码中访问，从而可以为多个对象应用相同的代码。

主要的使用案例是基于类的 OOP。一个实例方法（在原型中定义的）存在于_一个标本_中，但是在该类的_所有实例_中_共享_。

```js
class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  getX() {
    return this._x;
  }
  getY() {
    return this._y;
  }
}
let p1 = new Point(1, 2);
let p2 = new Point(3, 4);
// 这两个实例中都可以访问`getX`和`getY`（两个实例都被作为`this`传递）
console.log(
  p1.getX(), // 1
  p2.getX(), // 3
);
```

当`getX`方法被激活时，就会创建一个新的环境存储本地变量和形参。此外，_函数环境记录_得到了传过来的`[[ThisValue]]`，这个 this 值是根据函数调用的方式_动态_绑定的。当该函数是用`p1`调用时，`this`值就是`p1`，而第二种情况下就是`p2`。

`this`的另一种应用就是_通用的接口函数_，可以用在_mixins_或者_traits_中。

在如下的例子中，`Movable`接口包含通用函数`move`，其中`_x`和`_y`属性留给这个 mixin 的用户实现：

```js
// 通用的Movable接口（mixin）。
let Movable = {
  /**
   * 这个函数是通用的，可以与提供`_x`和`_y`属性的任何对象一起用，
   * 不管该对象的class是什么。
   */
  move(x, y) {
    this._x = x;
    this._y = y;
  },
};
let p1 = newPoint(1, 2);
// 让 `p1` movable.
Object.assign(p1, Movable);
// 可以访问 `move` 方法。
p1.move(100, 200);
console.log(p1.getX()); // 100
```

作为替代方案，mixin 还可以应用在_原型级_，而不是像上例中那样在_每个实例_上。

为展示`this`值的动态性质，考虑下例，我们留给读者作为要解决的一个练习：

```js
function foo() {
  return this;
}
letbar = {
  foo,
  baz() {
    return this;
  },
};
// `foo`
console.log(
  foo(), // 全局或者undefined
  bar.foo(), // bar
  bar.foo(), // bar
  (bar.foo = bar.foo)(), // 全局
);
// `bar.baz`
console.log(bar.baz()); // bar
let savedBaz = bar.baz;
console.log(savedBaz()); // 全局
```

因为当`foo`在一个特定调用中时，只通过查看`foo`函数的源代码，我们不能没法说出`this`的值是什么，所以我们说`this`值是_动态作用域_。

> **注：** 我们可以在[对应的章](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)中，得到关于如何判断`this`值，以及为什么上面的代码会按那样的方式工作的详细解释。

**箭头函数**的`this`值是特殊的：其`this`是_词法（静态_）的，而不是_动态的_。即，它们的函数环境记录不会提供`this`值，而是来自于_父环境_。

```js
var x = 10;
let foo = {
  x: 20,
  // 动态 `this`.
  bar() {
    returnthis.x;
  },
  // 词法 `this`.
  baz: () => this.x,
  qux() {
    // 调用内的词法this。
    let arrow = () => this.x;
    return arrow();
  },
};
console.log(
  foo.bar(), //20, 来自 `foo`
  foo.baz(), //10, 来自 global
  foo.qux(), //20, 来自 `foo` 和箭头函数
);
```

就像我们说过的那样，在_全局上下文_中，`this`是_全局对象_（_全局环境记录_的_绑定对象_）。以前只有一个全局对象，而在当前版本的规范中，可能有_多个全局对象_，这些全局对象都是_代码域_的一部分。下面我们来讨论一下这种结构。

## 域

在求值之前，所有 ECMAScript 代码必须与一个域关联。从技术上讲，域只是为一个上下文提供全局环境。

\*\*定义 16：域（Realm）：\*\*\*代码域_是一个封装了单独的_全局环境\*的对象。

当一个执行上下文被创建时，就与一个特定的代码域关联起来。这个代码域为该上下文提供_全局环境_。而且这种关联保持不变。

> \*\*注：\*\*域在浏览器环境中的一个直接等价物就是`iframe`元素，该元素恰好就是提供一个自定义的全局环境。在 Node.js 中，接近于[VM 模块](https://nodejs.org/api/vm.html)的沙箱。

当前版本的规范并没有提供显式创建域的能力，不过可以通过实现隐式创建。不过已经有一个[提案](https://github.com/tc39/proposal-realms/) 要暴露这个 API 给用户代码。

不过从逻辑上讲，从栈中的每个上下文总是与它的域关联：

[![alt](https://camo.githubusercontent.com/043fbf5cff5bf309f73d91cbdd4afee134362ccb8667964811c44e345a5d1b8d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f787153754557723463696d4b526f5878524d435f2e706e67)](https://camo.githubusercontent.com/043fbf5cff5bf309f73d91cbdd4afee134362ccb8667964811c44e345a5d1b8d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f787153754557723463696d4b526f5878524d435f2e706e67)[![alt](https://camo.githubusercontent.com/043fbf5cff5bf309f73d91cbdd4afee134362ccb8667964811c44e345a5d1b8d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f787153754557723463696d4b526f5878524d435f2e706e67)](https://camo.githubusercontent.com/043fbf5cff5bf309f73d91cbdd4afee134362ccb8667964811c44e345a5d1b8d/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f787153754557723463696d4b526f5878524d435f2e706e67)

图 10. 上下文和域的关联

现在我们正在接近 ECMAScript 运行时的较大的蓝图了。不过，我们依然需要看看代码的_入口点_，以及_初始化过程_。这是由_作业_和_作业队列_的机制管理的。

## 作业

有些操作可以推迟，并在执行上下文栈上有可用点时执行。

\*\*定义 17：作业：\*\*作业（job）是一种抽象操作，它在没有其它 ECMAScript 计算正在进行时启动一个 ECMAScript 计算。

作业在**作业队列**中排队，在当前版本的规范中，有两种作业队列：**ScriptJobs**和**PromiseJobs**。

而_ScriptJobs_队列上的_初始作业_是我们程序的_主入口点_ - 加载和求值的初始脚本：创建域，创建全局上下文并与该域关联在一起，压到栈中，执行全局代码。

注意，ScriptJobs 队列管理_脚本_和_模块_。

而且这个上下文可以执行_其它上下文_，或者排队_其它作业_。一个可以引发和排队的作业的例子就是_promise_。

当没有正在运行的执行上下文，并且执行上下文栈为空时，ECMAScript 实现会从作业队列中移除第一个挂起的作业，创建一个执行上下文，并开始其执行。

> \*\*注：\*\*作业队列通常是由所谓的_事件循环_来处理。ECMAScript 标准并没有指定事件循环，将它留给引擎实现，不过你可以在[这里](https://gist.github.com/DmitrySoshnikov/26e54990e7df8c3ae7e6e149c87883e4)找到一个演示示例。

示例：

```js
// 在PromiseJobs队列上入队一个新的promise。
new Promise(resolve => setTimeout(() => resolve(10), 0)).then(value =>
  console.log(value),
);
// 这个输出执行得早一些，因为它仍然是一个正在执行的上下文，
// 而作业不能先开始执行
console.log(20);
// Output: 20, 10
```

> **注：** 更多有关 promise 的知识请阅读[这个文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

async 函数可以等待 promise，所以它们也可以排队 promise 作业：

```js
async function later() {
  return await Promise.resolve(10);
}
(async () => {
  let data = await later();
  console.log(data); // 10
})();
// 也会发生得早一些，因为async执行是在PromiseJobs队列中排队的。
console.log(20);
// Output: 20, 10
```

**注：** 请在[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)阅读更多有关 async 函数的知识。

现在我们已经很接近当前 JS 领域的最终蓝图了。我们将看到我们所讨论过的所有这些组件的_主要负责人_：_代理_。

## 代理

ECMScript 中_并发_和_并行_是用_代理模式（Agent Pattern）_实现的。代理模式很接近于[参与者模式（Actor Patter）](https://en.wikipedia.org/wiki/Actor_model) — 一个带有_消息传递_风格通讯的_轻量级进程_。

\*\*定义 18：代理（Agent）：\*\*代理是封装了执行上下文栈、一组作业队列，以及代码域的一个概念。

依赖代理的实现可以在同一个线程上运行，也可以在单独的线程上运行。浏览器环境中的`Worker`代理就是_代理_概念的一个例子。

代理之间是状态相互隔离的，而且可以通过发送消息进行通讯。有些数据可以在代理之间共享，比如`SharedArrayBuffer`。代理还可以组合成_代理集群_。

在下例中，`index.html`调用`agent-smith.js` worker，传递共享的内存块：

```js
// 在`index.html`中：
// 这个代理和其它worker之间共享的数据。
let sharedHeap = new SharedArrayBuffer(16);
// 我们角度的数据。
let heapArray = newInt32Array(sharedHeap);
// 创建一个新代理（worker）。
let agentSmith = new Worker('agent-smith.js');
agentSmith.onmessage = message => {
  // 代理发送它修改的数据的索引。
  let modifiedIndex = message.data;
  // 检查被修改的数据
  console.log(heapArray[modifiedIndex]); // 100
};
// 发送共享数据给代理
agentSmith.postMessage(sharedHeap);
```

如下是 worker 的代码：

```js
// agent-smith.js
/**
 * 在这个worker中接受共享的 array buffer。
 */
onmessage = function(message) {
  // worker角度的共享数据。
  let heapArray = newInt32Array(message.data);
  let indexToModify = 1;
  heapArray[indexToModify] = 100;
  // 将索引作为消息发送回来。
  postMessage(indexToModify);
};
```

上例的完整代码可以在[这个 gist](https://gist.github.com/DmitrySoshnikov/b75a2dbcdb60b18fd9f05b595135dc82)中找到。

所以下面是 ECMAScript 运行时的概述图：

[![alt](https://camo.githubusercontent.com/1ebb6c36da96b47ce62493fd72a40784848467dc978dbf74ceb10cee95982266/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70507959426379396d765f4847443250694436552e706e67)](https://camo.githubusercontent.com/1ebb6c36da96b47ce62493fd72a40784848467dc978dbf74ceb10cee95982266/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70507959426379396d765f4847443250694436552e706e67)[![alt](https://camo.githubusercontent.com/1ebb6c36da96b47ce62493fd72a40784848467dc978dbf74ceb10cee95982266/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70507959426379396d765f4847443250694436552e706e67)](https://camo.githubusercontent.com/1ebb6c36da96b47ce62493fd72a40784848467dc978dbf74ceb10cee95982266/687474703a2f2f7777772e7869616f6a696368616f2e636f6d2f7374617469632f75706c6f61642f32303137313231352f70507959426379396d765f4847443250694436552e706e67)

图 11. ECMAScript 运行时

而这就是 ECMAScript 引擎背后发生的事情！

到这里我们就结束了。这是我们可以在一篇综述文章中讲解有关 JS 核心的所有信息了。正如我们所提到的，js 代码可以被分组到_模块_中，对象的属性可以通过`Proxy`对象进行跟踪，等等。- 我们可以在 JavaScript 语言的各种文档中找到很多用户级的信息。

这里我们试着表示一个 ECMAScript 程序本身的_逻辑结构_，希望它澄清了这些细节。如果你有任何疑问、建议或者反馈 - 我很乐意像以前一样在评论中讨论。

感谢 TC-39 的代表和规范的编辑帮助澄清本文。有关讨论可以在[这个推特跟帖](https://twitter.com/DmitrySoshnikov/status/930507793047592960)中找到。

祝学习 ECMAScript 顺利！

**作者：** Dmitry Soshnikov  
**发表于：** 2017 年 11 月 14 日

The text was updated successfully, but these errors were encountered: