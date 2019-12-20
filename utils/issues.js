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

const issues_url = "https://github.com/yanyue404/blog/issues/110";

function getSimglePageIssuesMessage(fetchUrl) {
  return axios
    .get(fetchUrl)
    .then(function(response) {
      let html_string = response.data.toString(); // 获取网页内容
      const $ = cheerio.load(html_string); // 传入页面内容
      const content = turndownService.turndown($("table").html());
      return content;
    })
    .catch(error => {
      console.log(error);
    });
}

getSimglePageIssuesMessage(issues_url)
  .then(markdown => {
    console.log(markdown);
  })
  .catch(err => {
    console.log(err);
  });
