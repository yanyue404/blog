## 小贴士

- `ctrl+p` chrome 查找当前网站已加载的资源文件

## CLI

### create-react-app

- Vscode 调试

首先安装 `Debugger for Chrome` 插件，配置好`launch.json`

```
// launch.json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "启动程序",
      "url": "http://localhost:9009",
      "webRoot": "${workspaceRoot}/src"
    }
  ]
}

```

然后启动项目, `yarn dev`, 等待项目成功启动提示：

```bash
<s> [webpack.Progress] 100%

  App running at:
  - Local:   http://localhost:9009/
  - Network: http://10.64.101.37:9009/
```

按 `F5` 开启调试模式，打断点，继续 debug。如果出现 `Breakpoint set but not yet bound`说明 设置断点但尚未绑定, 可以强制使用 `debugger` 确保准确断点定位。

## 代理调试

大部分接口使用线上服务，部分接口代理至本地代理调试（前后端联调场景）

原先全部使用线上：

```js
// http.js
axios.defaults.baseURL = '/prod-api';

// vue.config.js
module.exports = {
  proxy: {
    [process.env.VUE_APP_BASE_API]: {
      target: `http://h5.baishi360.cn/`,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
};
```

部分接口代理到本地：

```js
// http.js
axios.defaults.baseURL = '';

// vue.config.js
module.exports = {
  proxy: {
    // 本地代理 1
    '/api/cms/cmsActivity': {
      target: `http://10.64.101.55:18011/`,
      changeOrigin: true,
    },
    // 本地代理 2
    '/api/cms/searchA': {
      target: `http://10.64.101.55:18011/`,
      changeOrigin: true,
    },
    // 线上代理
    '': {
      target: `http://h5.baishi360.cn/prod-api/`,
      changeOrigin: true,
    },
  },
};
```

## Node.js

Inspector 原理

- WebSockets 服务（监听命令）
- Inspector 协议
- Http 服务（获取元信息）

### Chrome DevTools

- 访问 `chrome://inspect`,点击`配置`按钮，确保 Host Port 正确，然后点击 下方`inspect`按钮进入调试页面，打上断点后，在浏览器窗口打开监听的原始端口即可调试
- 借助 vscode 打印的端口号 （`node --inspect app.js`）访问端口 `localhost:9229/json`获取元信息,在浏览器中访问 `devtoolsFrontendUrl`
- 在 chrome `http://localhost:3000/`打开开发者页面，选择 `Elements`元素按钮左侧的 `Node.js`图标，可进入调试页面

  - `Profiler`面板可以录制项目运行时间，优化项目

### Vscode

- 单文件启动方式： F5
- 项目式，配置 launch.json，点击播放按钮
- vscode `ctrl+shift+p`打开`自动附加`，然后终端输入 `node --inspect app.js` 即打开调试模式

```bash
node --inspect app.js

# 在设置的断点处必须暂停执行
node --inspect-brk app.js
```

## 线上调试

### fiddler 代理本地前端资源

使用`fiddler` 将线上资源代理到本地调试,如：`css`, `js` , `image` 文件等等，步骤可[参考](https://blog.csdn.net/hahavslinb/article/details/78791219)

![](http://ww1.sinaimg.cn/large/df551ea5ly1g2kp8yr5mnj21ha0s3jxf.jpg)

> 注意
> fiddler 无法抓取 chrome 解决方法,代理插件选择“使用系统代理设置”选项
> 。fiddler 会自动给浏览器设置一个代理 127.0.0.1 端口 8888，并且记忆浏览器的代理设置，所有的请求先走 fiddler 代理，再走浏览器代理。
> 如果使用插件，可能会直接屏蔽了 fiddler 的代理，因此无法监听到请求了。

### [spy-debugger](https://github.com/wuchangming/spy-debugger)

微信调试，各种 WebView 样式调试、手机浏览器的页面真机调试。便捷的远程调试手机页面、抓包工具，支持：HTTP/HTTPS，无需 USB 连接设备。

### [eruda](https://github.com/liriliri/eruda)

> Console for mobile browsers

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      id="densityDpi"
    />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title>Console for mobile browsers</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.bootcss.com/eruda/1.4.3/eruda.min.js"></script>
    <script>
      eruda.init();
    </script>
  </body>
</html>
```

### sourcemap

TODO...

#### 参考资料

- [imooc - node.js 调试入门](https://www.imooc.com/learn/1093)
- [node-in-debugging](https://github.com/nswbmw/node-in-debugging)
- [断点调试](https://www.zhihu.com/question/43687153/answer/149944688)
- [stackoverflow - vscode-debugging-with-create-react-app](https://stackoverflow.com/questions/42714449/vscode-debugging-with-create-react-app)
- [细说 js 压缩、sourcemap、通过 sourcemap 查找原始报错信息](https://github.com/senntyou/blogs/blob/master/web-extend/8.md)
