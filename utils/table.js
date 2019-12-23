const TurndownService = require("turndown");
const turndownPluginGfm = require("turndown-plugin-gfm");

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-"
});
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

// table 格式的 html
const table = ``;
const logTableHtmlMarkdownStyle = table => turndownService.turndown(table);
console.log(logTableHtmlMarkdownStyle(table));
