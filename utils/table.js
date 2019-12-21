const TurndownService = require("turndown");
const turndownPluginGfm = require("turndown-plugin-gfm");

const table = ``;
const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-"
});
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);
console.log(turndownService.turndown(table));
