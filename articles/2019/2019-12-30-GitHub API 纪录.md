## 前言

纪录GitHub API 的使用方式，便于改造 blog。

## 获取 GitHub Token

点击 [这里](https://github.com/settings/tokens/new)，勾选以下两项：

    read: user        Read all user profile data
    user: email       Access user email addresses (read-only)
    

⚠️警告️：别的不要勾选，以免造成账号安全问题。

如果你的项目是属于一个组织的，还需要勾选一个权限：

    read: org         Read org and team membership
    

#### GitHub Token 进行 Base64 加密

打开 Chrome 的 Console，运行：

    window.btoa('{你的 GitHub Token}')
    

如果你把 Token 直接明文推到 GitHub 仓库中，此 Token 就会立马失效，所以需要加密混淆。

**在 node.js 环境中，借助 Buffer**

```js
console.log(Buffer.from("Hello World!").toString("base64"));
console.log(Buffer.from("Hello World!", "base64").toString());
```

#### axios 请求 utils

```js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    Authorization: `token ${window.atob(accessToken)}`,
  },
});
```

## API

-   用户信息 `https://api.github.com/users/yanyue404`
-   Issues 文件 `https://api.github.com/repos/yanyue404/blog/issues/114`
-   stars 列表 `https://api.github.com/users/yanyue404/starred`

#### 参考链接

-   [https://developer.github.com/v3](https://developer.github.com/v3)
-   [https://github.com/ttop5/issue-blog](https://github.com/ttop5/issue-blog)
-   [https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error](https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error)

The text was updated successfully, but these errors were encountered: