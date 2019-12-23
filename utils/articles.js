const TurndownService = require("turndown");
const turndownPluginGfm = require("turndown-plugin-gfm");
const axios = require("axios");
const cheerio = require("cheerio");
const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-"
});

const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

// 博客主页地址
const blog_url = "https://github.com/yanyue404/blog";

function getAPI(url) {
  return axios
    .get(url + "/issues")
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let obj = {};
      const totalPage = $(".pagination")
        .find("a")
        .eq(-2)
        .text();
      obj.totalPage = Number(totalPage);
      const numbers = $(".states a")
        .eq(0)
        .text()
        .trimStart()
        .trimEnd()
        .split(" ")[0];
      obj.numbers = Number(numbers);
      let urlList = [];
      for (i = totalPage; i > 0; i--) {
        urlList[totalPage - i] =
          url + "/issues?page=" + i + " is:issue is:open";
      }
      obj.fetchList = urlList;
      // 获取所有  Issues 数据,再返回
      return new Promise(resolve => {
        getAllPageIssues(urlList, issues => {
          obj.blogs = issues;
          resolve(obj);
        });
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}
function getAllPageIssues(fetchUrlsArray, callback) {
  let result = [];
  Promise.all(fetchUrlsArray.map(url => getSimglePageIssuesMessage(url)))
    .then(res => {
      for (var i = 0; i < res.length; i++) {
        result = result.concat(res[i]);
      }
      result.sort((x, y) => {
        return Number(y.id) - Number(x.id);
      });
      callback(result);
    })
    .catch(err => {
      console.log(err);
    });
}

function getSimglePageIssuesMessage(fetchUrl) {
  return axios
    .get(fetchUrl)
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      let list_array = [];
      $(".Box .Box-row").each(function(dom) {
        // 像jQuery一样获取对应节点值
        let obj = {};
        obj.id = $(this)
          .attr("id")
          .slice(6);
        obj.title = $("#issue_" + obj.id + "_link")
          .text()
          .trimStart()
          .trimEnd();
        let labelText = [];
        $(this)
          .find(".IssueLabel")
          .each(function(i, elem) {
            labelText[i] = $(this).text();
          });
        obj.labels = labelText;
        obj.time = $(this)
          .find(".opened-by relative-time")
          .attr("datetime")
          .slice(0, 10);

        list_array.push(obj);
      });
      return list_array;
    })
    .catch(error => {
      console.log(error);
    });
}

getAPI(blog_url).then(html => {
  console.log(html);
});
