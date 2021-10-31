const ghpages = require("gh-pages");

// 在GitHub页面上部署, https://github.com/yanyue404/blog/tree/gh-pages
ghpages.publish("dist/spa", (err) => {
  if (!err) {
    console.log("gh-pages 部署成功！");
  } else {
    console.log(err);
  }
});
