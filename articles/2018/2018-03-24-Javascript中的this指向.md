## this 的各个使用场景

### 1\. 在全局环境中使用时候

在全局中使用，this 就代表全局对象 Global（在浏览器中为 window）

```js
document.write(this); //[object Window]
```

当您在全局上下文中定义的函数中使用这个函数时，它仍然绑定到全局对象，因为函数实际上是一种全局上下文的方法。

```js
function f1() {
  return this;
}
document.write(f1()); //[object Window]
```

上面的 f1 是一个全局对象的方法。因此，我们也可以在 window 上调用它，如下所示：

```js
function f() {
  return this;
}

document.write(window.f()); //[object Window]
```

### 2.在对象方法中使用时

在对象方法中使用此关键字时，它将绑定到“立即”封闭对象。

```js
var obj = {
  name: 'obj',
  f: function() {
    return this + ':' + this.name;
  }
};
document.write(obj.f()); //[object Object]:obj
```

上面经把这个词直接放在双引号中。要指出的是，如果将对象嵌套在另一个对象内，则该对象将绑定到直接父对象。

```js
var obj = {
  name: 'obj1',
  nestedobj: {
    name: 'nestedobj',
    f: function() {
      return this + ':' + this.name;
    }
  }
};

document.write(obj.nestedobj.f()); //[object Object]:nestedobj
```

即使你将函数显式添加到对象作为方法，它仍然遵循上述规则，这仍然指向直接父对象。

```js
var obj1 = {
  name: 'obj1'
};

function returnName() {
  return this + ':' + this.name;
}

obj1.f = returnName; //add method to object
document.write(obj1.f()); //[object Object]:obj1
```

### 3.调用无上下文的函数时

当你使用这个在没有任何上下文的情况下调用的函数（即不在任何对象上）时，它被绑定到全局对象（浏览器中的窗口）（即使函数是在对象内部定义的）。

```js
var context = 'global';

var obj = {
  context: 'object',
  method: function() {
    function f() {
      var context = 'function';
      return this + ':' + this.context;
    }
    return f(); //invoked without context
  }
};

document.write(obj.method()); //[object Window]:global
```

### 4.在构造函数内部使用时

当函数被用作构造函数时（即使用 new 关键字调用它时），此内部函数体指向正在构建的新对象。

```js
var myname = 'global context';
function SimpleFun() {
  this.myname = 'simple function';
}

var obj1 = new SimpleFun(); //adds myname to obj1
document.write(obj1.myname); //simple function
```

### 5.当在原型链上定义的函数内部使用时

如果该方法位于对象的原型链上，则此方法内部引用方法被调用的对象，就好像方法在对象上定义一样。

```js
var ProtoObj = {
  fun: function() {
    return this.a;
  }
};
//Object.create() 使用ProtoObj创建对象
//原型并将其分配给obj3，从而使fun()成为其原型链上的方法

var obj3 = Object.create(ProtoObj);
obj3.a = 999;
document.write(obj3.fun()); //999

//注意fun（）是在obj3的原型上定义的，但是fun()中的``this.a`获取obj3.a
```

### 6.在 call(),apply(),和 bind()函数调用时

这里的 this 替换为对应方法传入的第一个参数.

```js
function add(inc1, inc2) {
  return this.a + inc1 + inc2;
}

var o = { a: 4 };
document.write(add.call(o, 5, 6) + '<br />'); //15

document.write(add.apply(o, [5, 6]) + '<br />'); //15

var g = add.bind(o, 5, 6);
document.write(g() + '<br />'); //15

var h = add.bind(o, 5); //h: `o.a` i.e. 4 + 5 + ?
document.write(h(6) + '<br />'); //15
// 4 + 5 + 6 = 15
document.write(h() + '<br />'); //NaN
//no parameter is passed to h()
//4 + 5 + undefined = NaN</code>
```

### 7.在事件处理中

-   将函数直接分配给元素的事件处理函数时，直接在事件处理函数内使用该函数会引用相应的元素。这种直接的函数分配可以使用 addeventListener 方法或通过传统的事件注册方法（如 onclick）来完成。
-   同样，当你直接在事件属性中使用这个元素（比如<button onclick =“... this ...”>）时，它指向元素。
-   但是，通过在事件处理函数或事件属性内部调用的其他函数间接使用这个函数，会解析为全局对象窗口。
-   当我们使用 Microsoft 的事件注册模型方法 attachEvent 将该函数附加到事件处理函数时，可以实现上述相同的行为。它不是将该函数分配给事件处理程序（并因此使该元素的函数方法），而是调用该事件上的函数（在全局上下文中有效地调用它）。

```html
<h3>在事件处理程序或事件属性中直接使用this</h3>

<button id="button1">click() 使用addEventListner注册</button><br />

<button id="button2">click() 使用onclick注册</button><br />

<button
  id="button3"
  onclick="alert(this+ ' : ' + this.tagName + ' : ' + this.id);"
>
  使用点击事件的原型
</button>

<h3>在事件处理程序或事件属性中间接使用this</h3>

<button
  onclick="alert((function(that){return that + ' : ' +this + ' : ' + this.tagName + ' : ' + this.id;})(this));"
>
  在函数内部间接使用 <br />
  定义自执行函数
</button>
<br />

<button id="button4" onclick="clickedMe()">
  在函数内部间接使用 <br />
  手动绑定事件名
</button>
<br />
```

```js
function clickedMe() {
  alert(this + ' : ' + this.tagName + ' : ' + this.id);
}
document.getElementById('button1').addEventListener('click', clickedMe, false);
document.getElementById('button2').onclick = clickedMe;
```

-   [在线 jsfiddle](http://jsfiddle.net/Mahesha999/xKtzC/8/embedded/html%2Cjs%2Cresult/)

### 8.箭头函数的 this

箭头函数转成 ES5 的代码如下。

下面代码中，转换后的 ES5 版本清楚地说明了，箭头函数里面根本没有自己的this，而是引用外层的this。

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```

箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this

```js
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b();
// undefined Window
obj.c();
// 10, Object {...}
```

## 结论

1.  在全局环境中使用时候，`this`代表全局对象
2.  在对象方法中使用时，`this` 代表此对象
3.  调用无上下文的函数时，`this`代表全局对象
4.  在构造函数内部使用时，`this` 代表正在构建的新对象
5.  当在原型链上定义的函数内部使用时， `this` 代表此对象
6.  在 call(),apply(),和 bind()函数调用时，`this` 代表对应方法传入的第一个参数
7.  在事件处理中于 js 中绑定或注册，或在 html 中注册并直接使用 this 关键字（非丢失 this 指向），this 代表 `html 元素`，在事件处理与元素上直接绑定事件方法名会使得 this 指向 `window`
8.  箭头函数中，`this`代表其位置外层的this对象

## 小测验

### demo1

```js
if (true) {
  // What is `this` here?
}
```

### demo2

```js
var obj = {
  someData: 'a string'
};

function myFun() {
  return this; // What is `this` here?
}

obj.staticFunction = myFun;

console.log('this is window:', obj.staticFunction() == window);
console.log('this is obj:', obj.staticFunction() == obj);
```

### demo3

```js
var obj = {
  myMethod: function() {
    return this; // What is `this` here?
  }
};
var myFun = obj.myMethod;
console.log('this is window:', myFun() == window);
console.log('this is obj:', myFun() == obj);
```

### demo4

```js
function myFun() {
  return this; // What is `this` here?
}
var obj = {
  myMethod: function() {
    eval('myFun()');
  }
};
```

### demo5

```js
function myFun() {
  return this; // What is `this` here?
}
var obj = {
  someData: 'a string'
};
console.log('this is window:', myFun.call(obj) == window);
console.log('this is obj:', myFun.call(obj) == obj);
```

### 公布答案

-   demo1: window
-   demo2: obj
-   demo3: window
-   demo4: window
-   demo5: obj

###### 参考

-   [阮一峰 - Javascript 的 this 用法](http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html)
-   [https://codeburst.io/the-simple-rules-to-this-in-javascript-35d97f31bde3](https://codeburst.io/the-simple-rules-to-this-in-javascript-35d97f31bde3)
-   [stackoverflow - How does the “this” keyword work?](https://stackoverflow.com/a/3127440/1751946)
-   箭头函数
    -   [阮一峰 es6](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)
    -   [mqyqingfeng ES6 系列之箭头函数](https://github.com/mqyqingfeng/Blog/issues/85)
-   [方应杭 - this 的值到底是什么？一次说清楚](https://zhuanlan.zhihu.com/p/23804247)

The text was updated successfully, but these errors were encountered: