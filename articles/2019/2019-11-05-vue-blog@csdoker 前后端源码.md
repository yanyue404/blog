## 前言

透过读源码快速回顾 Vue 技术栈的实践，感谢作者 [csdoker](https://github.com/csdoker) 开源 ~

-   [vue-blog](https://github.com/csdoker/vue-blog)
-   [vue-blog-server](https://github.com/csdoker/vue-blog-server)
-   [hexo-theme-yilia](https://github.com/litten/hexo-theme-yilia)

[![123.gif](https://camo.githubusercontent.com/0f5eaebb0d789affb4dd2c87fdbe30b0ad11d52443b8cfbd736eff89c1d186ff/687474703a2f2f7777312e73696e61696d672e636e2f6d773639302f64663535316561356c793167386e6c316e35316638673231683030726d316c302e676966)](https://camo.githubusercontent.com/0f5eaebb0d789affb4dd2c87fdbe30b0ad11d52443b8cfbd736eff89c1d186ff/687474703a2f2f7777312e73696e61696d672e636e2f6d773639302f64663535316561356c793167386e6c316e35316638673231683030726d316c302e676966)

## vue-blog

先行启动后端服务

```shell
cd vue-blog-server
yarn start
yarn run v1.12.3
$ node ./bin/www
```

### 项目简介

-   路由

```shell
# 主页

/  Home
/page/:page  Home     # 分页
/detail/:id  Detail   # 详情


/archive  Archive            # 归档
/archive/page/:page Archive  # 分页

/album Album        # 相册
/reading Reading    # 读书

/about About    # 关于

/test Test      # 测试

```

路由组件暴露位置 `router-view`,统一入口

```html
<App>
  <AppCanvas></AppCanvas>
  <AppSidebar></AppSidebar>
  <AppToolbar></AppToolbar>
  <AppMain>
    <router-view />
  </AppMain>
  <AppScroll></AppScroll>
</App>
```

```html
<MainMobileNav></MainMobileNav> <!-- 移动端响应式使用 -->
<slot></slot>  <!-- 暴露路由插槽 -->
<MainFooter></MainFooter>
```

-   数据流

```shell
# state

export default {
  toolbarKeyword: '',   // 工具栏搜索关键字
  isShowToolbar: false, // 显示工具栏(默认不显示)
  isShowToolbarSection: [false, false] // 工具栏展示类型
}

# mutations

export default {
  openToolBar (state, menuIndex) {
    state.isShowToolbar = true
    state.isShowToolbarSection.forEach((item, index) => {
      if (index === menuIndex) {
        state.isShowToolbarSection.splice(index, 1, true)
      } else {
        state.isShowToolbarSection.splice(index, 1, false)
      }
    })
  },
  closeToolBar (state) {
    state.isShowToolbar = false
  },
  setToolbarKeyword (state, keyword) {
    state.toolbarKeyword = keyword
  }
}

```

`isShowToolbar`默认情况 为 false 时:

1.  组件隐藏
2.  组件添加 hide 类名,增加 `leftOut` 动画效果
3.  组件添加 hide 类名，增加 `smallleftOut` 动画效果
4.  组件无 show 类名
5.  组件为白色背景色 `#fff`

`isShowToolbar`默认情况 为 true 时:

1.  组件显示，气泡 cavas 动效
2.  组件添加 show 类名 背景颜色随之切换 background: linear-gradient(200deg, #a0cfe4, #e8c37e)，增加 `smallLeftIn` 动画效果
3.  组件添加 show 类名，增加 `smallleftOut` 动画效果
4.  组件添加 show 类名，阴影边框
5.  组件为 白色加透明 `rgba(255,255,255,0.3)`

-   项目依赖
    -   fastclick
    -   vue-loading-template
    -   vue-preview
    -   vue-markdown
    -   vue-prism md 语法高亮
    -   vue-wheels 自制分页组件

### 动画效果

待研究...

```css
.hide {
  -webkit-animation-duration: 0.8s;
  animation-duration: 0.8s;
  -webkit-animation-name: leftOut;
  animation-name: leftOut;
}

@keyframes leftOut {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    -webkit-transform: translate3d(330px, 0, 0);
    transform: translate3d(330px, 0, 0);
  }
  60% {
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }
  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
```

```css
.show {
     background: none
      opacity: .9
      -webkit-animation-duration: .8s;
      animation-duration: .8s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      -webkit-animation-name: leftIn;
      animation-name: leftIn
}

      @keyframes leftIn {
  0%, 60%, 75%, 90%, to {
    -webkit-animation-timing-function: cubic-bezier(.215, .61, .355, 1);
    animation-timing-function: cubic-bezier(.215, .61, .355, 1)
  }
  0% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0)
  }
  60% {
    -webkit-transform: translate3d(358px, 0, 0);
    transform: translate3d(358px, 0, 0)
  }
  75% {
    -webkit-transform: translate3d(323px, 0, 0);
    transform: translate3d(323px, 0, 0)
  }
  90% {
    -webkit-transform: translate3d(338px, 0, 0);
    transform: translate3d(338px, 0, 0)
  }
  to {
    -webkit-transform: translate3d(330px, 0, 0);
    transform: translate3d(330px, 0, 0)
  }
}
```

### ArticleDirectory

`ArticleDirectory` 为 详情页 markdown 文档目录组件

```html
<template lang="html">
  <div class="article-directory" v-if="isShowDirectory">
    <div class="directory-head">目录</div>
    <div class="directory-body">
      <article-directory-body @setDirectory="setDirectory" :directories="directories"></article-directory-body>
    </div>
  </div>
</template>

<script>
import ArticleDirectoryBody from './ArticleDirectoryBody'

export default {
  name: 'ArticleDirectory',
  components: {
    ArticleDirectoryBody
  },
  data () {
    return {
      isShowDirectory: false,
      directories: [],
      lastDirectoryIndex: 0,
      clickDirectoryIndex: 0,
      appElem: document.querySelector('#app')
    }
  },
  methods: {
    // 获取文件标题目录
    getDirectories () {
      let directoryElems = document.querySelector('.article-data').querySelectorAll('h1,h2,h3,h4,h5,h6')
      if (directoryElems.length !== 0) {
        this.isShowDirectory = true
      } else {
        this.isShowDirectory = false
        return
      }
      directoryElems.forEach((element, elemIndex) => {
        element.id = `articleHeader${elemIndex}`
        this.directories.push({
          index: elemIndex,
          title: element.innerText || element.textContent,
          offsetTop: element.offsetTop,
          isActive: false,
          tagName: element.tagName,
          children: []
        })
      })
    },
    // 格式化标题目录结构
    formatDirectories (arr, i, parent) {
      if (i >= arr.length) {
        return i
      }
      let current = arr[i]
      // 外层插入
      if (current.tagName > parent.tagName) {
        parent.children.push(current)
      } else {
        return i
      }
      i++
      let next = arr[i]
      if (!next) {
        return i
      }
       // 内层继续插入
      if (next.tagName > current.tagName) {
        current.children = []
        i = this.formatDirectories(arr, i, current)
      }
      // 递归
      return this.formatDirectories(arr, i, parent)
    },
    // 重置 取消所有高亮标记
    resetDirectories (node) {
      node.forEach(item => {
        if (item.isActive) {
          item.isActive = false
          return true
        }
        item.children && this.resetDirectories(item.children)
      })
    },
    // 选中高亮标记 isActive
    findDirectories (node) {
      if (this.clickDirectoryIndex !== this.lastDirectoryIndex) {
        node.forEach((item, index) => {
          if (this.appElem.scrollTop >= document.querySelector(`#articleHeader${item.index}`).offsetTop) {
            // 清除所有高亮单独添加
            this.resetDirectories(this.directories)
            item.isActive = true
          } else {
            item.isActive = false
          }
          // 有子数据的先遍历子数据
          item.children && this.findDirectories(item.children)
        })
      } else {
        this.clickDirectoryIndex = 0
      }
    },
    setDirectory (item) {
      this.clickDirectoryIndex = item.index
      if (item.index === this.lastDirectoryIndex) {
        this.resetDirectories(this.directories)
        item.isActive = true
      }
    },
    handleScroll (e) {
      this.findDirectories(this.directories)
    }
  },
  mounted () {
    let root = {
      index: -1,
      title: '',
      offsetTop: 0,
      isActive: false,
      tagName: 'H0',
      children: []
    }
    this.$nextTick(() => {
      this.getDirectories()
      console.log(this.directories)
      this.lastDirectoryIndex = this.directories[this.directories.length - 1].index
      this.formatDirectories(this.directories, 0, root)
      this.directories = root.children
      this.appElem.addEventListener('scroll', this.handleScroll)
    })
  },
  destroyed () {
    this.appElem.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
```

```html
<template lang="html">
  <ul>
    <li :class="{'active': item.isActive, 'normal': !item.isActive}" v-for="(item, index) of directories" :key="index">
      <a href="javascript:;" @click="goAnchor(item)">{{item.title}}</a>
      <article-directory-body @setDirectory="setDirectory" v-if="item.children" :directories="item.children"></article-directory-body>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ArticleDirectoryBody',
  props: {
    directories: Array
  },
  data () {
    return {}
  },
  methods: {
    goAnchor (item) {
      this.$emit('setDirectory', item)
      document.querySelector('#app').scrollTop = document.querySelector(`#articleHeader${item.index}`).offsetTop
    },
    setDirectory (item) {
      this.$emit('setDirectory', item)
    }
  }
}
</script>
```

## vue-blog-server

**路由信息**

```shell
app.get('/articlelist', api.articlelist);
app.get('/article', api.article);
app.get('/archivelist', api.archivelist);
app.get('/about', api.about);
app.get('/searchlist', api.searchlist);
app.get('/articletag', api.articletag);
app.get('/postcategory', api.postcategory);
app.get('/booklist', api.booklist);
app.get('/album', api.album);
```

**调试设置**

`.vscode` 文件夹及 `launch.json`

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "vue-blog-server",
      "program": "${workspaceFolder}\\bin\\www",
      // skipFiles 就是忽略我们不关心的文件 <node_internals> 用来忽略 Node.js 核心模块
      // 这样在单步调试时就不会进入到 node_modules和node核心模块里
      "skipFiles": [
        "${workspaceFolder}/node_modules/**/*.js",
        "<node_internals>/**/*.js"
      ]
    }
  ]
}

```

> 参考 [node-in-debugging](https://github.com/nswbmw/node-in-debugging/blob/master/4.3%20Visual%20Studio%20Code.md)

**主页**

-   `/articlelist?page=1` 文章列表

根据页码参数 `page`与 `data/articles.json`（含有 "articleId"，"articleTitle"，"articleDate"，articleTags","articleCategories" 等关键文章信息） 确定分页展示条数`id`，再与 `articles` 文件夹里的 `md`文档 组合（新增 articleContent 参数）返回文章分页数据。

-   `/article?id=24` 文章详情

根据传入的 `id`参数与 读取 `articles`文件夹下的相应 `md`数据，再与 `data/articles.json` 同 `文章 id`的原有数据合并，返回单个文章详情。

-   `searchlist?keyword=1` 搜索列表

根据传入的搜索参数，在 `data/articles.json`中进行匹配，支持 `articleTitle` 标题与 `articleTags` 标签匹配。

-   `/articletag` 文章标签列表

根据 `data/articles.json` 文章数据中 `articleTags`数组参数合并而来。

**归档列表页**

-   `/archivelist?page=1`

根据传入的分页参数，以及 `data/articles.json` 文章 数据中的时间参数 `articleDate`，将每页展示的 10 个数据进行构建为新的按时间年限分布的数据：

```json
{
  "count": 29,
  "data": [
    { "archiveArticles": [], "archiveDate": 2018 },
    { "archiveArticles": [], "archiveDate": 2017 }
  ],
  "ret": true
}
```

**读书与相册页**

-   `/booklist` & `/album`

分别使用 `data/books.json`与`data/album.json`做为源数据返回。

**关于页**

-   `/about` 关于页

关于页读取 `about/about.md` 文档的使用 json 格式返回。

The text was updated successfully, but these errors were encountered: