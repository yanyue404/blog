## 说明

面试被一连串的 考基础的双等与三等判断问的有点蒙，虽然知道`==` 是抽象相等运算符， `===` 是严格相等运算符，但其中的比较规则并不胜了解，那么为何`[] == []` 为 `true`呢 ？其他规则是如何 ？

在[知乎提问](https://www.zhihu.com/question/42328292)中找到了答案， 感谢，一起来看一下[ECMAScript 6 官方文档](http://www.ecma-international.org/ecma-262/6.0/) 。

## 双等比较

The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:

1.  If Type(x) is the same as Type(y), then Return the result of performing Strict Equality Comparison x === y.

```js
[] == []; // false
```

2.  If x is null and y is undefined, or x is undefined and y is null, return true.

```js
null == undefined; // ture
```

3.  If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y), vice versa (反之亦然).

```js
1 == '1'; // true
0 == ''; // true 
0 == '0'; // true
```

> Number("") => 0

4.  If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y, vice versa.

```js
0 == false; // true
1 == true; // true
```

5.  If Type(x) is either String, Number, or Symbol and Type(y) is Object, then return the result of the comparison x == [ToPrimitive](http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive)(y), vice versa.
    
6.  Return false.
    

## 三等比较

The comparison x === y, where x and y are values, produces true or false. Such a comparison is performed as follows:

1.  If Type(x) is different from Type(y), return false.

```js
1 === "1"; // false
```

2.  If Type(x) is Undefined, return true. (按顺序执行，x 与 y 须类型一致，以下一样除了 第9)
3.  If Type(x) is Null, return true.
4.  If Type(x) is Number, then

```shell
   a. If x is NaN, return false.
   b. If y is NaN, return false.
   c. If x is the same Number value as y, return true.
   d. If x is +0 and y is −0, return true.
   e.If x is −0 and y is +0, return true.
   f. Return false.
```

5.  If Type(x) is String, then

```shell
  a. If x and y are exactly the same sequence of code units (same length and same code unit
      at corresponding indices), return true.
  b. Else, return false.
```

6.  If Type(x) is Boolean, then

```shell
  a. If x and y are both true or both false, return true.
  b. Else, return false.
```

7.  If x and y are the same Symbol value, return true.
8.  If x and y are the same Object value, return true.
9.  Return false.

## 总结

`==` 运算符有可能是在进行必要的类型转换后，才再比较。`===` 运算符不会进行类型转换，所以如果两个值不是相同的类型，会直接返回false。使用`==` 时，可能发生一些特别的事情，例如：

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

建议是从不使用 `==` 运算符，除了方便与 `null` 或undefined比较时，`a == null`如果a为null或undefined将返回true。

```js
var a = null;
console.log(a == null); // true
console.log(a == undefined); // true
```

#### 参考

-   [abstract-equality-comparison](http://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison)
-   [strict-equality-comparison](http://www.ecma-international.org/ecma-262/6.0/#sec-strict-equality-comparison)
-   [\["0"\]==\["0"\]为什么是false？](https://www.zhihu.com/question/42328292)

The text was updated successfully, but these errors were encountered: