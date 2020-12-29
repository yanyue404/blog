## 目录

-   [类型](#%E7%B1%BB%E5%9E%8B)
-   [对象](#%E5%AF%B9%E8%B1%A1)
-   [函数](#%E5%87%BD%E6%95%B0)
-   [比较运算符](#%E6%AF%94%E8%BE%83%E8%BF%90%E7%AE%97%E7%AC%A6)
-   [注释](#%E6%B3%A8%E9%87%8A)

## 类型

1.1 `var` vs `let`&`const`

所有的变量赋值尽量使用 const 而不是 var，如果一定要对变量重新赋值，那就使用 let。

## 对象

2.1 浅拷贝

```js
// very bad
const original = { a: 1, b: 2 };
const copy = Object.assign(original, { c: 3 }); // this mutates `original` ಠ_ಠ
delete copy.a; // so does this

// bad
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

// good es6扩展运算符 ...
const original = { a: 1, b: 2 };
// 浅拷贝
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

// rest 赋值运算符
const { a, ...noA } = copy; // noA => { b: 2, c: 3 }
```

2.2 检测对象有效值

```js
const obj = { name: 'yue', age: '18', friend: 'heizi' };

// bad

const { name, age, friend } = obj;
if (!name || !age || !friend) {
}

// good

Object.values(obj).every((v) => v);
```

2.3 多个返回值用对象的解构

```js
// bad
function processInput(input) {
  // 然后就是见证奇迹的时刻
  return [left, right, top, bottom];
}

// 调用者需要想一想返回值的顺序
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // oops， 奇迹又发生了
  return { left, right, top, bottom };
}

// 调用者只需要选择他想用的值就好了
const { left, top } = processInput(input);
```

## 函数

3.1 用默认参数语法而不是在函数里对参数重新赋值。

```js
// really bad
function handleThings(opts) {
  // 不， 我们不该改arguments
  // 第二： 如果 opts 的值为 false, 它会被赋值为 {}
  // 虽然你想这么写， 但是这个会带来一些细微的bug
  opts = opts || {};
  // ...
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```

3.2 切勿重新分配参数。

```js
// bad
function f1(a) {
  a = 1;
  // ...
}

function f2(a) {
  if (!a) {
    a = 1;
  }
  // ...
}

// good
function f3(a) {
  const b = a || 1;
  // ...
}

function f4(a = 1) {
  // ...
}
```

## 比较运算符

4.1 严格相等

Javascript 有两个表示"相等"的运算符："相等"（==）和"严格相等"（===），使用`==`有可能促使类型转换，建议主加`===`。

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

你有什么理由不用我？

```js
console.log('' === ''); // true
```

4.2 布尔值用缩写，而字符串和数字要明确比较对象

```js
// bad
if (isValid === true) {
  // ...
}

// good
if (isValid) {
  // ...
}

// bad
if (name) {
  // ...
}

// good
if (name !== '') {
  // ...
}

// bad
if (collection.length) {
  // ...
}

// good
if (collection.length > 0) {
  // ...
}
```

## 注释

5.1 `/** ... */`用于多行注释。

```js
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {
  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {
  // ...

  return element;
}
```

5.2 `//`用于单行注释。 将单行注释放在注释主题上方的换行符上。 除非注释所在的第一行，否则在注释之前放置一个空行。

```js
// bad
const active = true; // is current tab

// good
// is current tab
const active = true;

// bad
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}

// good
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}

// also good
function getType() {
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}
```

5.2 在所有注释的开头加一个空格，以使其易于阅读。

```js
// bad
//is current tab
const active = true;

// good
// is current tab
const active = true;

// bad
/**
 *make() returns a new element
 *based on the passed-in tag name
 */
function make(tag) {
  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {
  // ...

  return element;
}
```

5.3 在注释前使用 FIXME 或 TODO 前缀，这些不同于常规注释，因为它们是可操作的。 动作是 `FIXME： - 需要计算出来`或 `TODO： - 需要实现`。

用`// FIXME:`给问题做注释

```js
class Calculator extends Abacus {
  constructor() {
    super();

    // FIXME: shouldn't use a global here
    total = 0;
  }
}
```

用`// TODO:`去注释问题的解决方案

```js
class Calculator extends Abacus {
  constructor() {
    super();

    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

## 参考

-   [http://www.ruanyifeng.com/blog/2012/04/javascript\_programming\_style.html](http://www.ruanyifeng.com/blog/2012/04/javascript_programming_style.html)
-   [https://zhuanlan.zhihu.com/p/38066626](https://zhuanlan.zhihu.com/p/38066626)
-   [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript)

The text was updated successfully, but these errors were encountered: