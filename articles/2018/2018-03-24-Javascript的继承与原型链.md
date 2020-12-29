# 继承与原型链

什么是原型？

原型（prototype）的定义：给其它对象提供共享属性的**对象**

哪些数据类型有原型？

只有函数才有 prototype 属性。

## 基本概念

#### 1\. 获取属性的查找规则

如果访问一个对象的属性,首先检查对象是否含有对应的属性,如果含有即得结果;

如果不含有该属性, 则去其原型中查找, 如果原型中含有该属性, 既得结果;

如果原型中依旧没有属性, 就到其原型中的原型去查找, 直到 `Object.prototype`。最后还没有则返回 undefined

```js
Object.prototype.rain = true;
function Person() {}
console.dir(Person.rain); // true
```

#### 2.修改对象属性

如果修改一个对象的属性, 那么会检查当前对象是否存在该属性, 如果存在即修改, 如果不存在则会给其添加属性.

#### 3.值类型和引用类型的区别

在使用数组赋值的时候,数组是引用类型,存的是一个指针指向,在实例操作后会改变原型中的引用类型。从而影响所有的实例成员

如果实例对象"修改了"原型中的值类型, 那么其实并没有影响到其他的对象

## 构造函数 new 一个对象

```js
function Person() {}
Person.prototype.name = 'Rainbow';
var person1 = new Person();
console.log(person1.name);
```

new 命令简化的内部流程，可以用下面的代码表示。

```js
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return typeof result === 'object' && result != null ? result : context;
}

// 实例
var actor = _new(Person, '张三', 28);
```

### 从构造函数到原型对象

构造函数与其原型对象使用 `prototype` 属性连接，而原型对象中的 constructor 属性指向构造函数。

```js
console.log(Person === Person.prototype.constructor); // true
```

### 实例对象与两者的连接

实例对象的 `__proto__`指向其该对象的原型，这是每一个 JavaScript 对象(除了 null )都具有的一个属性。

```js
console.log(person1.__proto__ === Person.prototype); // true
```

[![Snipaste_2019-11-21_18-55-12.png](https://camo.githubusercontent.com/d683dadd9ca25102184f77a8ded3fe726a02f0c100aff08c22f48c0a987c7829/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c7931673935776b646e696c716a323068743061776a726a2e6a7067)](https://camo.githubusercontent.com/d683dadd9ca25102184f77a8ded3fe726a02f0c100aff08c22f48c0a987c7829/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c7931673935776b646e696c716a323068743061776a726a2e6a7067)

## 原型链

对象的`__proto__`指向自己构造函数的 `prototype`。`obj.__proto__.__proto__`...的原型链由此产生，包括我们的操作符 instanceof 正是通过探测 `obj.__proto__.__proto__` === `constructor.prototype` 来验证 obj 是否是 `constructor` 的实例。

```js
console.log(Object.prototype.__proto__ === null); // true
console.dir(Object.__proto__.__proto__.__proto__); // null
```

[![Snipaste_2019-11-21_19-45-28.png](https://camo.githubusercontent.com/bb9cc13b9859be66a1cdf358912e04c14b5c22400c74b0ab38d58b746a1c2736/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c7931673935776b73383469756a32307170306666676d302e6a7067)](https://camo.githubusercontent.com/bb9cc13b9859be66a1cdf358912e04c14b5c22400c74b0ab38d58b746a1c2736/687474703a2f2f7777312e73696e61696d672e636e2f6c617267652f64663535316561356c7931673935776b73383469756a32307170306666676d302e6a7067)

**透过一个例子查看**

```js
// 顶级原型链
Object.prototype.foo = 'rainbow';
function doSomething() {}
// 构造函数的原型
doSomething.prototype.hello = 'bar';
// 实例
var doSomeInstancing = new doSomething();
doSomeInstancing.prop = 'some value';
console.log('doSomeInstancing.foo:       ' + doSomeInstancing.foo); // 'rainbow'
console.log('doSomeInstancing.global:       ' + doSomeInstancing.global); // undefined
// 属性查找步骤
// 1. 自身具备 foo属性 ？ X
// 2. doSomeInstancing.__proto__: doSomething.prototype 有 foo 属性 X (这里指向构造函数的原型)
// 3. doSomeInstancing.__proto__.__proto__: Object.prototype 自身具备 foo 属性 √
```

**完整的原型链结构上溯**

相互关联的原型组成的链状结构就是原型链，也就是`__proto__`的这条线。

在下面的结构中，`__proto__`将实例对象，实例对象的原型，实例对象的原型的原型向上连接，直至 \`Object.prototype'的上一级**null**，原型链上溯结束。

```js
var o = { a: 1 };

// o 这个对象继承了 Object.prototype 上面的所有属性
// o 自身没有名为 hasOwnProperty 的属性
// hasOwnProperty 是 Object.prototype 的属性
// 因此 o 继承了 Object.prototype 的 hasOwnProperty
// Object.prototype 的原型为 null
// 原型链如下:
// o ---> Object.prototype ---> null

var a = ['yo', 'whadup', '?'];

// 数组都继承于 Array.prototype
// (Array.prototype 中包含 indexOf, forEach 等方法)
// 原型链如下:
// a ---> Array.prototype ---> Object.prototype ---> null

function f() {
  return 2;
}

// 函数都继承于 Function.prototype
// (Function.prototype 中包含 call, bind等方法)
// 原型链如下:
// f ---> Function.prototype ---> Object.prototype ---> null
```

## 原型链

##### 【很少单独来使用】

#### 缺点

1.引用类型值的原型属性会被实例共享

2.在创建子类型的实例时,不能向超类型的构造函数中传递参数【很少单独来使用】

```js
function Father() {
  this.name = 'father';
  this.firend = ['aaa,bbb'];
}
function Son() {}

//原型绑定
Son.prototype = new Father();
Son.prototype.constructor = Son;

var s1 = new Son();
var s2 = new Son();

console.log(s1.name); //father
console.log(s2.name); //father

s1.name = 'son'; //实际上已经在构造函数上定义了这个name属性
console.log(s1.name); //son
console.log(s2.name); //father

console.log(s1.firend); //['aaa,bbb']
console.log(s2.firend); //['aaa,bbb']
s1.firend.push('ccc,ddd');
console.log(s1.firend); //['aaa,bbb,ccc,ddd']
console.log(s2.firend); //['aaa,bbb,ccc,ddd'] 引用类型的原型属性会被实例共享
```

## 借用构造函数

##### 【很少单独来使用】

#### 实现方法

在子类型构造函数的内部调用超类型构造函数(使用 apply 和 call 方法)

#### 优点

解决了原型中引用类型属性的问题,并且子类可以向超类中传参

#### 缺点

子类实例无法访问父类(超类)原型中定义的方法,所以函数的复用就无从谈起了

```js
function Father(name, friends) {
  this.name = name;
  this.friends = friends;
}
Father.prototype.getName = function() {
  return this.name;
};

function Son(name) {
  // 注意： 为了确保 Father 构造函数不会重写 Son 构造函数的属性，请将调用 Father 构造函数的代码放在 Son 中定义的属性的前面。
  Father.call(this, name, ['aaa', 'bbb']);

  this.age = 22;
}

var s1 = new Son('son1');
var s2 = new Son('son2');

console.log(s1.name); // son1
console.log(s2.name); // son2

s1.friends.push('ccc', 'ddd');
console.log(s1.friends); // ["aaa", "bbb", "ccc", "ddd"]
console.log(s2.friends); // ["aaa", "bbb"]

// 子类实例无法访问父类原型中的方法
s1.getName(); // TypeError: s1.getName is not a function
s2.getName(); // TypeError: s2.getName is not a function
```

## 组合继承

##### 【最常用的继承模式】

又叫伪经典继承，结合原型链继承和构造函数式继承，使用原型链实现对原型属性和方法的继承（函数的复用），又使用构造函数实现对实例属性的继承（每个实例拥有自己的属性）。

#### 优点

避免了原型链继承和构造函数继承的缺点，融合了他们的优点

#### 缺点

无论在什么情况下，都会调用两次超类型构造函数，一次是构造子类型原型，一次是在子类型构造函数内部，解决方法查看`寄生组合式继承`

```js
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function() {
  console.log(this.name);
};

function SubType(name, age) {
  //继承属性
  SuperType.call(this, name); // 第二次调用 SuperType()
  this.age = age;
}
//继承方法
SubType.prototype = new SuperType(); // 第一次调用 SuperType()
SubType.prototype.sayAge = function() {
  console.log(this.age);
};

var instancel1 = new SubType('Nicholas', 29);
var instancel2 = new SubType('yue', 25);
instancel1.colors.push('black');
console.log(instancel1.colors); // ["red", "blue", "green", "black"]
console.log(instancel2.colors); // ["red", "blue", "green"] 实例独立

instancel1.sayName(); //Nicholas
instancel2.sayName(); //yue 传参
```

## 原型式继承

想要保证一个对象与另一个对象`保持类似`的工作可以胜任

#### 缺点

包含引用类型值的属性始终会共享相应的属性，无法保证单个实例拥有自己的引用类型属性，这点与原型链模式存在的问题一样

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};
var anotherPerson = Object.create(person);
var anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');

var yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barbie');

alert(person.friends); //"Shelby,Court,Van,Rob,Barbie"
```

##### Object.create API

第一个参数是用作新对象的原型对象（可选的），第二个参数是用来扩展新对象属相的另外的对象，在一个参数的情况下，与`object()`方法相同

```js
var anotherPerson1 = Object.create(person);
anotherPerson1.name = 'Greg';

var anotherPerson2 = Object.create(person, {
  name: {
    value: 'Greg',
  },
});
```

## 寄生式继承

##### 【有用的模式】

#### 缺点

使用寄生继承为对象添加函数，由于不能做到函数的复用性而降低效率。这一点与构造函数类似

```js
function createAnother(original) {
  var clone = Object(original); //调用函数创建一个新对象
  clone.sayHi = function() {
    // 方法
    alert('hi');
  };
  return clone;
}

var person = {
  //属性
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};

var anotherPerson = createAnother(person);
anotherPerson.sayHi();
alert(anotherPerson.name);
```

## 寄生组合式继承

##### 【最理想的继承模式】

#### 优点

1.  高效率调用一次 SuperType 构造函数，因此避免了在 SuperType.prototype 上面创建不必要，多余的属性
2.  原型链保持不变，可以正常使用`istanceof`和`isPrototypeOf()`

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype); //创建对象
  prototype.constructor = subType; //增强对象
  subType.prototype = prototype; //指定对象
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function() {
  alert(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);

  this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function() {
  alert(this.age);
};

var instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29

var instance2 = new SubType('Greg', 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27
```

### 参考文章

-   [MDN - 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
-   [原型继承 - 廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312/1023021997355072)
-   [JavaScript 深入之从原型到原型链 —— 冴羽](https://github.com/mqyqingfeng/Blog/issues/2)
-   [从**proto**和 prototype 来深入理解 JS 对象和原型链](https://github.com/creeperyang/blog/issues/9)

The text was updated successfully, but these errors were encountered: