## 常见 warning

**1\. 组件注册不正确**

> \[Vue-warn\]:Unknown custom element: - did you register the component correctiy?\`

**2\. 子组件试图直接更改父组件**

> \[Vue warn\]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "value"\`

注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身将会影响到父组件的状态。

这里有两种常见的试图变更一个 prop 的情形：

-   **这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用**。在这种情况下，最好定义一个本地的 data property 并将这个 prop 用作其初始值：

```js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```

-   **这个 prop 以一种原始的值传入且需要进行转换**。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

**3\. 引用一个不存在的变量**

> \[Vue warn\]: Property or method "name" is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property. See: [https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties](https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties). (found in )

**4\. 取多级数据值**

例如： movie\_data.subject\_collection.name

> \[Vue warn\]: Error in render function: “TypeError: Cannot read property ‘name’ of undefined”

    <h2 v-text="module_title || movie_data.subject_collection.name"></h2>
    
    // 判断上一级数据是否存在即可
    <h2 v-text="module_title || (movie_data.subject_collection && movie_data.subject_collection.name)"></h2>
    

**5.无法在'Node'上执行'insertBefore'：要在其之前插入新节点的节点不是该节点的子节点**

> \[Vue warn\]: Error in nextTick: "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."

```html
<!-- Throw Error  -->
<el-table-column fixed="right" label="操作" align="center" width="100">
  <template scope="scope">
    <el-button
      v-show="scope.row.status === '1'"
      v-permission="['/prtOrder/Abolition']"
      size="small"
      type="warning"
    >
      废除
    </el-button>
  </template>
</el-table-column>
```

Fix: `v-show="scope.row.status === '1' && checkPermission(['/prtOrder/Abolition'])"`

## 处理异常

-   [Vue.config.warnHandler](https://cn.vuejs.org/v2/api/#warnHandler)
-   [Vue.config.errorHandler](https://cn.vuejs.org/v2/api/#errorHandler)

## 参考

-   [https://cn.vuejs.org/v2/guide/components-props.html](https://cn.vuejs.org/v2/guide/components-props.html)
-   [https://www.cnblogs.com/fundebug/p/handling-errors-in-vuejs.html](https://www.cnblogs.com/fundebug/p/handling-errors-in-vuejs.html)
-   [https://www.axihe.com/anbang/blog/vue/judge-if-the-higher-level-data-exists.html](https://www.axihe.com/anbang/blog/vue/judge-if-the-higher-level-data-exists.html)
-   [https://medium.com/javascript-in-plain-english/avoid-mutating-a-prop-directly-7b127b9bca5b](https://medium.com/javascript-in-plain-english/avoid-mutating-a-prop-directly-7b127b9bca5b)

The text was updated successfully, but these errors were encountered: