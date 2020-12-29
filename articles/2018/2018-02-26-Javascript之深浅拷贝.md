## 前言

深拷贝拷贝的是两个完全相同的对象，两个双胞胎长得一摸一样,互不影响。

浅拷贝拷贝的是指向对象的指针,两个指针同样指向同同一对象,一改都改变。

浅拷贝：浅拷贝是拷贝引用，拷贝后的引用都是指向同一个对象的实例，彼此之间的操作会互相影响。

深拷贝：在堆中重新分配内存，并且把源对象所有属性都进行新建拷贝，以保证深拷贝的对象的引用图不包含任何原有对象或对象图上的任何对象，拷贝后的对象与原来的对象是完全隔离，互不影响

只是针对复杂数据类型（Object，Array）的复制问题。浅拷贝与深拷贝都可以实现在已有对象上再生出一份的作用。但是对象的实例是存储在堆内存中然后通过一个引用值去操作对象，由此拷贝的时候就存在两种情况了：拷贝引用和拷贝实例，这也是浅拷贝和深拷贝的区别。

## 数组的浅拷贝

简单的浅拷贝可以使用数组的`concat`和`slice`做到：

```js
var arr = ['old', 1, true, null, undefined];
var new_arr = [].concat(arr);

new_arr[0] = 'new';

console.log(arr); //['old',1 ,true, null, undefined]
console.log(new_arr); //['new',1, true, null, undefined]
```

查看第一个例子后可能以为`concat`是深拷贝了实例，下面接着看复杂一些的数组能不能做到：

```js
var arr = [{ old: 'old' }, ['old']];

var new_arr = arr.concat();

arr[0].old = 'new';
arr[1][0] = 'new';

console.log(arr); // [{old: 'new'}, ['new']]
console.log(new_arr); // [{old: 'new'}, ['new']]
```

在这里看到`concat`对于复杂的例子是无法完成深拷贝的，更改实例 1 后实例 2 也进行了相同的变化，还有`slice`，它们完成的是浅拷贝。

> 源对象拷贝实例，其属性对象拷贝引用。

这种情况，外层源对象是拷贝实例，如果其属性元素为复杂数据类型时，内层元素拷贝引用。  
对源对象直接操作，不影响另外一个对象，但是对其属性操作时候，会改变另外一个对象的属性的值。

```js
var arr = [{ old: 'old' }, ['old']];

var new_arr = arr.concat();

arr[0] = 'new';

console.log(arr); // ['new', ['old']]
console.log(new_arr); // [{old: 'old'}, ['old']]
```

常用方法为：Object.assign(target, sources...),Array.prototype.slice(), Array.prototype.concat(), jQury 的$.extend({},obj)...

## 深拷贝

深拷贝后，两个对象，包括其内部的元素互不干扰。常见方法有 JSON.parse(JSON.stringify(obj));，jQury 的$.extend(true,{},obj)，lodash 的\*.cloneDeep 和\*.clone(value, true)。例：

```js
var arr = ['old', 1, true, ['old1', 'old2'], { old: 1 }];

var new_arr = JSON.parse(JSON.stringify(arr));

console.log(new_arr);
```

## 浅拷贝的实现

```js
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```

## 深拷贝的实现

如何实现一个深拷贝呢？说起来也好简单，我们在拷贝的时候判断一下属性值的类型，如果是对象，我们递归调用深拷贝函数不就好了~

```js
var deepCopy = function(obj) {
  if (typeof obj !== 'object') return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
};
```

#### 补充：数组的原型指向

```js
console.log(Array.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true
console.log(Array.prototype.__proto__ == Object.prototype); // true
```

## 方法记录

```js
// 对象深度克隆，支持[]和{}
Object.prototype.clone = function() {
  var obj = this;
  if (typeof obj !== 'object') return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? obj[key].clone() : obj[key];
    }
  }
  return newObj;
};
```

```js
/**
 * @desc 深拷贝，支持常见类型
 * @param {Any} values
 */
function deepClone(values) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == values || 'object' != typeof values) return values;

  // Handle Date
  if (values instanceof Date) {
    copy = new Date();
    copy.setTime(values.getTime());
    return copy;
  }

  // Handle Array
  if (values instanceof Array) {
    copy = [];
    for (var i = 0, len = values.length; i < len; i++) {
      copy[i] = deepClone(values[i]);
    }
    return copy;
  }

  // Handle Object
  if (values instanceof Object) {
    copy = {};
    for (var attr in values) {
      if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy values! Its type isn't supported.");
}
```

#### 参考

-   [mqyqingfeng/Blog#32](https://github.com/mqyqingfeng/Blog/issues/32)
-   [https://www.jianshu.com/p/a4e1e7b6f4f8](https://www.jianshu.com/p/a4e1e7b6f4f8)

The text was updated successfully, but these errors were encountered: