## 前言

在自己使用 github issues 写 blog 的过程中，遇到了以下的一些想要自动化解决的需求：

-   生成 Toc 文章目录树
-   导出所有文章以 `markdown` 的形式

实现方案为: `axios` + `cheerio` + `turndown`，以 npm 作为平台发布了 `github-to-md` 命令行工具，最终的代码实现 [在这里](https://github.com/rainbow-design/github-to-md/)。

## Usage

Install with [npm](https://www.npmjs.com/):

```shell
$ npm install github-to-md -g
```

Create a folder to store the export results `docs`, Locate to `docs`:

```shell
mkdir docs && cd docs
```

Export simgle issue as Markdown:

```shell
github-to-md issue [issue_URL]
```

Export Github Blog issues list as Markdown:

```shell
github-to-md toc [blog_URL]
```

Export Github Blog issues as Markdown:

```shell
github-to-md articles [blog_URL]
```

The text was updated successfully, but these errors were encountered: