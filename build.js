const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { accessToken, username, repository } = require("./blog.config");

global.Buffer = global.Buffer || require("buffer").Buffer;

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3.html",
    Authorization: `token ${Buffer.from(accessToken, "base64").toString()}`,
  },
});

function getBuildParams() {
  let p = process.argv[2] || "";
  let bp = {
    _bp: p,
  };
  p.split("@").forEach((item) => {
    let [k, v = ""] = item.split("=");
    k && (bp[k] = v);
  });
  if (bp.LOCAL) {
    // 设置开发时的默认参数
    bp.RUNTIME = "local";
  } else {
    bp.RUNTIME = Date.now();
  }
  return bp;
}

const BP = getBuildParams();

// 判断目录是否存在
const isExistDist = function (dir) {
  try {
    var stat = fs.statSync(dir);
    stat.isDirectory();
  } catch (err) {
    fs.mkdirSync(dir);
  }
};

const getGithubIssuesApi = (page = 1, number = 15) => {
  let url = `/search/issues?q=+repo:${username}/${repository}+state:open&page=${page}&per_page=${number}`;

  console.log("request url:" + url);

  axiosInstance.get(url).then((res) => {

    if (res.data && res.data.items && res.data.items.length > 0) {
      let IssuesDataFileName = `IssuesData_${BP.RUNTIME}.json`;
      let config = {
        total_count: "",
        pageList: [],
      };
      const jsonRoot = path.join(__dirname, "src/statics/", "json");
      isExistDist(jsonRoot);

      fs.writeFileSync(
        path.resolve(jsonRoot, "IssuesDataConfig.json"),
        JSON.stringify(config),
        "utf-8"
      );
      fs.writeFileSync(
        path.resolve(jsonRoot, IssuesDataFileName),
        JSON.stringify(res.data.items),
        "utf-8"
      );
      console.log("数据已写入 json 文件中。");
    } else {
      console.log("没有数据了或获取失败！");
    }
  });
};

getGithubIssuesApi();
