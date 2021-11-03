module.exports = {
  username: "yanyue404", // GitHub 用户名
  repository: "blog", // 记录 issue 的仓库名
  accessToken: "MWM2YmE5NmMwODJhODgyYzBiZmM2ZWExNGVhNzFhYjFkZTM4MzcwYw==", // 经过 base64 加密后的 GitHub Token
  blogName: "Just blog and unjust blog", // 给你的博客取个名字
  /**
   * 定制左侧菜单链接部分
   * 格式：
   * {
   *   title: '',   // 名称
   *   subTile: '', // 描述
   *   icon: '',    // 图标名称，上这里查找你需要的图标名称 https://fontawesome.com ，如果需要自定义图标的参考示例的最后一个配置，并将图标文件放到 /src/statics 目录中
   *   url: '',     // 链接
   * }
   * 示例如下：
   */
  links: [
    {
      title: "Home",
      subTile: "yanyue404",
      icon: "fas fa-home",
      url: "https://xiaoyueyue.org/",
    },
    {
      title: "GitHub",
      subTile: "github.com/yanyue404",
      icon: "fab fa-github",
      url: "https://github.com/yanyue404",
    },
    {
      title: "Twitter",
      subTile: "twitter.com/yanyue404",
      icon: "fab fa-twitter",
      url: "https://twitter.com/yanyue404",
    },
    {
      title: "Email",
      subTile: "xiaoyueyue165@gmail.com",
      icon: "fas fa-envelope",
      url: "mailto:xiaoyueyue165@gmail.com",
    },
  ],
};
