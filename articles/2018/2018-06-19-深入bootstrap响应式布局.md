## 前言

bootstrap响应式布局用的不熟，在网上找了现成的bootstrap响应单页很多，在这里通过分析一个`bootstrap中文网主页`的响应来分析响应式布局的原理，从此畅通，以后专注写media...

前往：[Bootstrap中文网](http://www.bootcss.com/)

## 视口

获取viewport的大小(布局视口)

**获取layout viewport**

```js
document.documentElement.clientWidth;
document.documentElement.clientHeight;
```

**ideal viewport（理想视口）设备屏幕区域**

```js
// 获取ideal viewport有两种情形

// 新设备
window.screen.width;
window.screen.height;

// 老设备
window.screen.width / window.devicePixelRatio;
window.screen.height / window.devicePixelRatio;
```

移动设备厂商认为将网页完整显示给用户才最合理，而不该出现滚动条，所以就将layout viewport进行了缩放，使其恰好完整显示在ideal viewport（屏幕）里，其缩放比例为ideal viewport / layout viewport。

### 屏幕适配

> 移动页面最理想的状态是，避免滚动条且不被默认缩放处理

> viewport 是由苹果公司为了解决移动设备浏览器渲染页面而提出的解决方案

-   控制缩放

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 媒体查询

引入方法

1.  link方法

```html
<link href="index.css" media="only screen and (max-width: 320px)">
```

2.  media(css样式)

```css
@media screen and (min-width: 768px) and (max-width: 979px) {}
```

-   关键字

关键字将媒体类型或多个媒体特性连接到一起做为媒体查询的条件。

| 关键字 | 含义 |
| --- | --- |
| and | 将多个媒体特性连接起来，相当于"且" |
| not | 排除某个媒体类型，相当于"非"，可以省略 |
| only | 指定某个特定的媒体类型，可以省略 |

-   常用特性

| 属性 | 含义 |
| --- | --- |
| width / height | 完全等于layout viewport |
| max-width / max-height | 小于等于layout viewport |
| min-width / min-height | 大于等于layout viewport |
| device-width / device-height | 完全等于ideal viewport |

## Bootstrap的响应源码

### container

每个布局的大容器都在使用了`.container`这个class类名，保证所有设备padding和margin的同时候，保证响应设备的宽度控制。

```css
 /*最小设备以及公共padding与margin的控制*/
.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto
}

@media (min-width: 768px) {
  .container {
      width:750px
  }
}

@media (min-width: 992px) {
  .container {
      width:970px
  }
}

@media (min-width: 1200px) {
  .container {
      width:1170px;
  }
}
```

### display

```css
@media (max-width: 767px) {
  .hidden-xs {
    display: none !important;
  }
}
/*当尺寸大于等于768px和小于等于991px时*/
@media (min-width: 768px) and (max-width: 991px) {
  .hidden-sm {
    display: none !important;
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .hidden-md {
    display: none !important;
  }
}
@media (min-width: 1200px) {
  .hidden-lg {
    display: none !important;
  }
}
```

## Response分析

以Bootstrap中文网为例子，进一步完善媒体查询对响应式布局的功用。

我的PC设备是 1366x768,在这里选择`@media (min-width: 1200px)`的情况进行兼容，匹配PC设备

### header

1.  使用`hidden-sm hidden-md`两个class类控制，当屏幕尺寸大于768px和小于等于1119时候,隐藏**Bootstrap2中文文档**。

```css
@media (min-width: 992px) and (max-width: 1199px) {
  .hidden-md {
    display: none !important;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .hidden-sm {
    display: none !important;
  }
}
```

```html
<li class="hidden-sm hidden-md">
<a href="https://v2.bootcss.com/"target="_blank">Bootstrap2中文文档</a>
</li>
```

2.  当屏幕尺寸大于768px和小于等于991px的时，使用`.hidden-sm`控制header左侧的**Bootstrap中文网**隐藏，控制右侧的**关于**隐藏。

```html
<a class="navbar-brand hidden-sm" >Bootstrap中文网</a>
...
<ul class="nav navbar-nav navbar-right hidden-sm">
  <li><a>关于</a></li>
</ul>
```

3.  当屏幕尺寸小于768px时,`nav-toggle`不再控制菜单的隐藏状态，显示出来，header的各个子菜单，由`collapse`控制隐藏，同时改变了nav里面的li标签的布局方式(不设浮动)，变成树状态。

```css
@media (min-width: 768px) {
  .navbar-toggle {
      display:none
  }
}
@media (min-width: 768px) {
  .navbar-collapse.collapse {
    display: block !important;
    height: auto !important;
    padding-bottom: 0;
    overflow: visible !important;
  }
}

@media (min-width: 768px) {
.navbar-nav {
    float: left;
    margin: 0;
    }
}
```

```html
 <div class="navbar-collapse collapse" role="navigation">
    <ul class="nav navbar-nav">
      <li class="hidden-sm hidden-md">
        <a href="https://v2.bootcss.com/">Bootstrap2中文文档</a>
      </li>
      <li>
        <a href="https://v3.bootcss.com/">Bootstrap3中文文档</a>
      </li>
    ...
    </ul>
    <ul class="nav navbar-nav navbar-right hidden-sm">
      <li>
        <a href="/about/">关于</a>
      </li>
    </ul>
  </div>
```

### masthead 报头

masthead模块的响应主要是包含块container和居中`text-align：center`的结果,当然需要下面的css控制h1和h2的大小响应。

```css
@media screen and (min-width: 768px) {
    .masthead {
        padding:90px 0 110px
    }
}

.masthead h1 {
    font-size: 60px;
    line-height: 1;
    letter-spacing: -2px;
    font-weight: 700
}

@media screen and (min-width: 768px) {
    .masthead h1 {
        font-size:90px;
    }
}

@media screen and (min-width: 992px) {
    .masthead h1 {
        font-size:100px;
    }
}

.masthead h2 {
    font-size: 18px;
    font-weight: 200;
    line-height: 1.25
}

@media screen and (min-width: 768px) {
    .masthead h2 {
        font-size:24px
    }
}

@media screen and (min-width: 992px) {
    .masthead h2 {
        font-size:30px
    }
}
```

### social 社交

下面是布局的简化版本，主要利用了`text-algn:center`与`container`:

css样式

```css
* {
      box-sizing: border-box;
    }

    .text-align {
      text-align: center;
    }

    .container {
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }

    .social-forum,
    .social-weibo {
      display: inline-block;
    }
```

html布局

```html
<div class="container text-align">
    <ul class="bc-social-buttons">
      <li class="social-forum">
        Bootstrap问答社区
      </li>
      <li class="social-weibo">
        新浪微博：@Bootstrap中文网
      </li>
    </ul>
  </div>
```

### projects

#### header

首先是包裹header的容器`projects-header`，使用百分比布局居中适应，保证容器内部的响应.

```css
.projects-header {
    width: 60%;
    text-align: center;
    margin: 60px 0 10px;
    font-weight: 200;
    margin-bottom: 40px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
```

header内部使用h2标签包裹的标题`Bootstrap相关优质项目推荐`,设置了响应，当在大于768px的时候字体大小为42px，小于768px的时候更改为30px；

```css
.projects-header h2 {
    font-size: 30px;
    letter-spacing: -1px
}

@media screen and (min-width: 768px) {
    .projects-header h2 {
        font-size:42px;
    }
}
```

#### projects区域

先说著名的12栅格布局，当屏幕大于`1200px`像素的时候使用`col-lg-3`将宽分为每份25%，这里的3指的是12份取其中的3份，就是1/4；当屏幕尺寸介于`992px-1200px`之间，使用`col-md-4`将宽度分成3份，每份占1/3；当屏幕尺寸介于`768px-992px`之间时，使用`col-sm-6`,将屏幕分成2份（都是在只使用单一的分法时），当屏幕尺寸小于768px的时候不再栅格，使用默认的样式控制左右padding向中间挤压.

由于采用`border-box`布局，上述栅格系统通过默认加入的左右padding 15px像素可以控制间隔。

    * {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
    *:before,
    *:after {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
    

```css
@media (min-width: 1200px) {
.col-lg-3 {
    width: 25%;
    }
}
@media (min-width: 1200px)
.col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9 {
    float: left;
@media (min-width: 992px) {
.col-md-4 {
    width: 33.33333333%;
    }
}
@media (min-width: 992px) {
.col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9 {
    float: left;
    }
}
@media (min-width: 768px) {
.col-sm-6 {
    width: 50%;
    }
}
/*左右距离控制*/
@media (min-width: 768px) {
.col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9 {
    float: left;
    }
.col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
   }
}
```

### footer

按照footer结构的布局，没有css样式的时候是上下结构布局，移动端响应比较好，在大设备上需要左右布局，这时候的栅格布局结构大致如下面的情况。

在大于768px设备上面，将右侧的公司结构目录再次分成12份的布局结构，小于768px像素的时候这些拆分栅格失效，还保留了公共的padding来控制间隔距离，设计不可谓不妙。

下面的`footer-bottom`结构基本与上面的social模块一样，不再赘述了...

```html
 <footer class="footer ">
    <div class="container">
      <div class="row footer-top">
        <div class="col-md-6 col-lg-6">
          <h4>
            <img src="https://assets.bootcss.com/www/assets/img/logo.png?1528519874373">
          </h4>
          <p>我们一直致力于为广大开发者提供更多的优质技术文档和辅助开发工具！</p>
        </div>
        <div class="col-md-6  col-lg-5 col-lg-offset-1">
          <div class="row about">
            <div class="col-sm-3">
              <h4>关于</h4>
              <ul class="list-unstyled">
                li*4 ...
              </ul>
            </div>
            <div class="col-sm-3">
              <h4>联系方式</h4>
              <ul class="list-unstyled">
                li*2 ...
              </ul>
            </div>
            <div class="col-sm-4">
              <h4>旗下网站</h4>
              <ul class="list-unstyled">
                li*5 ...
              </ul>
            </div>
            <div class="col-sm-2">
              <h4>赞助商</h4>
              <ul class="list-unstyled">

                li ...
              </ul>
            </div>
          </div>

        </div>
      </div>
      <hr>
      <div class="row footer-bottom">
        <ul class="list-inline text-center">
          <li>
            <a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备11008151号</a>
          </li>
          <li>京公网安备11010802014853</li>
        </ul>
      </div>
    </div>
  </footer>
```

The text was updated successfully, but these errors were encountered: