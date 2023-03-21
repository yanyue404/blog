## 前言

此文章是笔者在 github 使用中的一些经验性总结，学习的新姿势会同步更新，记录。

## 目录

- [一、可访问性](#可访问性)
- [二、展示自己的项目](#展示自己的项目)
- [三、专业指引](#专业指引)
- [四、其他物料](#其他物料)
- [五、参与开源贡献](#参与开源贡献)

## 可访问性

你可以正常访问 `github.com` 网页并且正常提交代码吗？

1、关于正常访问网页版

下面是通过修改本地 hosts 文件的方式增强访问，推荐采用网络代理方案。

- [GitHub520](https://github.com/521xueweihan/GitHub520) - 😘 让你“爱”上 GitHub，解决访问时图裂、加载慢的问题。（无需安装）raw.hellogithub.com/
- [SwitchHosts](https://github.com/oldj/SwitchHosts) - Switch hosts quickly!
  2、关于正常提交代码

```bash
git.exe push --progress "origin" master:master
fatal: unable to access 'https://github.com/yanyue404/...': OpenSSL SSL_read: Connection was reset, errno 10054
```

git push 的时候一直报错 443TimeOut, 这是网络的问题，需要配置一个可以访问外网的 git 代理，就可以提交了。

## 展示自己的项目

借助 Github 平台展示项目

（1）gh-pages 分支托管

在自己的 github 项目上添加`gh-pages`分支，并保证里面有需要展示的代码，以`index.html`作为入口就可以展示项目了， 展示地址就是 **Github 用户名.github.io/创建的仓库名**。

将本项目下的 dist 文件夹内容发布到远端的  `gh-pages`  分支

```
git subtree push --prefix=dist origin gh-pages
```

或者使用 shell 脚本上传：

**deploy.sh**

```
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy: vuepress docs'

# 如果发布到 https://<USERNAME>.github.io
git push -f https://github.com/yanyue404/mingdao.git master:gh-pages

cd -
```

例子：

- [mingdao](https://github.com/yanyue404/mingdao "https://github.com/yanyue404/mingdao") [在线访问](https://yanyue404.github.io/mingdao/ "https://yanyue404.github.io/mingdao/")

（2）角落的`Fork me on GitHub`标签 —— [github-corners](https://github.com/tholman/github-corners "https://github.com/tholman/github-corners")

![](https://camo.githubusercontent.com/ff082c6371137f34e8adb518af6a5e892d7dfc37/68747470733a2f2f692e696d6775722e636f6d2f373033694c69532e706e67 "https://camo.githubusercontent.com/ff082c6371137f34e8adb518af6a5e892d7dfc37/68747470733a2f2f692e696d6775722e636f6d2f373033694c69532e706e67")

（3）Logo

为自己的项目添加一个漂亮的 Logo。

- [brandmark](https://brandmark.io/ "https://brandmark.io/")
- [looka](https://looka.com/ "https://looka.com/")

（4）README

为自己的项目写一个 `README.md` 的 markdown 说明文件

- [#171 我的 markdown 写作风格改进 ：以《中文技术文档的写作规范》为标准](https://github.com/yanyue404/blog/issues/171)
- [中文技术文档的写作规范 by ruanyifeng](https://github.com/ruanyf/document-style-guide)
- [guodongxiaren/README README 文件语法解读](https://github.com/guodongxiaren/README)
- [emoji-list/ github 支持的 emojj 表情](https://github.com/caiyongji/emoji-list)
- [GitHub 上 README 中的漂亮徽章](https://shields.io/)

## 专业指引

- [Github 官网 help](https://help.github.com/) / [基础中文翻译](https://github.com/waylau/github-help)
- [Git 飞行规则(Flight Rules)](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)
- [GitHub 秘籍](https://github.com/tiimgreen/github-cheat-sheet/blob/master/README.zh-cn.md#%E8%B4%A1%E7%8C%AE%E8%80%85%E6%8C%87%E5%8D%97)
- [GotGitHub: an open source E-book about GitHub in Chinese](https://github.com/gotgit/gotgithub)
- [GitHub 漫游指南](https://github.com/phodal/github)，by phodal

## 其他物料

1、开源团队

（1）国内：

- [国内 github 团队的开源地址](https://github.com/niezhiyang/open_source_team)

（2）国外：

- [google](https://github.com/google)
- [facebook](https://github.com/facebook)
- [apache](https://github.com/apache)
- [microsoft](https://github.com/microsoft)
- [mozilla](https://github.com/mozilla)
- [codrops](https://github.com/codrops)
- [twitter](https://github.com/twitter)
- [square](https://github.com/square)
- [googlesamples](https://github.com/googlesamples)
- [Netflix](https://github.com/Netflix)
- [github](https://github.com/github)
- [airbnb](https://github.com/airbnb)

2. Github 平台的开源 API

- [Github API v3](https://docs.github.com/cn/rest)

## 参与开源贡献

- [#48 同步你的 Github fork ](https://github.com/yanyue404/blog/issues/48)
- [#109 如何学习开源项目甚至发起 PR ？](https://github.com/yanyue404/blog/issues/109)
