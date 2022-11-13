## README

博客所有图片资源托管

1. 图片压缩 https://tinypng.com/

2. 上传后获取图片地址: [github 打开图片预览](https://github.com/yanyue404/blog/tree/master/assets)选择右键复制图片地址

```bash
# 复制后得到
https://github.com/yanyue404/blog/blob/master/assets/git/git%20command.jpg?raw=true

# 重定向后得到

https://raw.githubusercontent.com/yanyue404/blog/master/assets/git/git%20command.jpg
```

```js
// 路径转义前
let str1 = "git command";
let str2 = "表格总结";

// 路径转义后
console.log(encodeURIComponent(str1)); // git%20command
console.log(encodeURIComponent(str2)); // %E8%A1%A8%E6%A0%BC%E6%80%BB%E7%BB%93

// 生成可访问图片链接

const getUrl = (path) => {
  let arr = path.split("/");
  let name = encodeURIComponent(arr.pop());
  let prefix = arr.join("/");
  return `https://raw.githubusercontent.com/yanyue404/blog/master/assets/${prefix}/${name}`;
};

console.log(getUrl("git/git command.jpg")); // https://raw.githubusercontent.com/yanyue404/blog/master/assets/git/git%20command.jpg
```
