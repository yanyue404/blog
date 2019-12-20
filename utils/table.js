const TurndownService = require("turndown");
const turndownPluginGfm = require("turndown-plugin-gfm");

const table = `<table class="table table--bordered">
<thead>
    <tr>
        <th></th>
        <th class="cyxy-trs-source">Number of Votes<font class="cyxy-trs-target"> 投票数</font></th>
        <th class="cyxy-trs-source">Percentage<font class="cyxy-trs-target"> 百分比</font></th>
        <th class="cyxy-trs-source">% Diff (to 2018)<font class="cyxy-trs-target"> % Diff (截至2018年)</font></th>
    </tr>
</thead>
<tbody>
    <tr>
        <th class="cyxy-trs-source">React<font class="cyxy-trs-target"> 做出反应</font></th>
        <td>985</td>
        <td class="cyxy-trs-source">32.78%</td>
        <td class="is-trendUp cyxy-trs-source">+4.31%<font class="cyxy-trs-target"> + 4.31%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">None of them are essential – I feel comfortable just using native JavaScript on my projects<font class="cyxy-trs-target"> 它们都不是必不可少的——我只是在我的项目中使用本地 JavaScript 就感到很舒服</font></th>
        <td>651</td>
        <td class="cyxy-trs-source">21.66%</td>
        <td class="is-trendUp cyxy-trs-source">+0.05%<font class="cyxy-trs-target"> + 0.05%</font></td>
    </tr>
    <tr>
        <th>Vue.js</th>
        <td>404</td>
        <td class="cyxy-trs-source">13.44%</td>
        <td class="is-trendUp cyxy-trs-source">+3.22%<font class="cyxy-trs-target"> + 3.22%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">jQuery<font class="cyxy-trs-target"> 1. jQuery</font></th>
        <td>335</td>
        <td class="cyxy-trs-source">11.15%</td>
        <td class="is-trendDown cyxy-trs-source">-8.59%<font class="cyxy-trs-target"> - 8.59%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Angular (v2+)<font class="cyxy-trs-target"> 角度(v2 +)</font></th>
        <td>255</td>
        <td class="cyxy-trs-source">8.49%</td>
        <td class="is-trendUp cyxy-trs-source">+2.30%<font class="cyxy-trs-target"> + 2.30%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Ember<font class="cyxy-trs-target"> 微光城</font></th>
        <td>167</td>
        <td class="cyxy-trs-source">5.56%</td>
        <td class="is-trendUp cyxy-trs-source">+1.17%<font class="cyxy-trs-target"> + 1.17%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Lodash<font class="cyxy-trs-target"> 胡说八道</font></th>
        <td>73</td>
        <td class="cyxy-trs-source">2.43%</td>
        <td class="is-trendDown cyxy-trs-source">-0.99%<font class="cyxy-trs-target"> - 0.99%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">AngularJS</th>
        <td>22</td>
        <td class="cyxy-trs-source">0.73%</td>
        <td class="is-trendDown cyxy-trs-source">-0.97%<font class="cyxy-trs-target"> - 0.97%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Aurelia<font class="cyxy-trs-target"> 水母属</font></th>
        <td>18</td>
        <td class="cyxy-trs-source">0.60%</td>
        <td class="is-trendEqual cyxy-trs-source">0%</td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Backbone<font class="cyxy-trs-target"> 骨干</font></th>
        <td>11</td>
        <td class="cyxy-trs-source">0.37%</td>
        <td class="is-trendUp cyxy-trs-source">+0.08%<font class="cyxy-trs-target"> + 0.08%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Preact<font class="cyxy-trs-target"> 预演</font></th>
        <td>8</td>
        <td class="cyxy-trs-source">0.27%</td>
        <td class="is-trendEqual cyxy-trs-source">0%</td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Underscore<font class="cyxy-trs-target"> 下划线</font></th>
        <td>7</td>
        <td class="cyxy-trs-source">0.23%</td>
        <td class="is-trendDown cyxy-trs-source">-0.19%<font class="cyxy-trs-target"> - 0.19%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Polymer<font class="cyxy-trs-target"> 聚合物</font></th>
        <td>7</td>
        <td class="cyxy-trs-source">0.23%</td>
        <td class="is-trendDown cyxy-trs-source">-0.28%<font class="cyxy-trs-target"> - 0.28%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">MeteorJS</th>
        <td>4</td>
        <td class="cyxy-trs-source">0.13%</td>
        <td class="is-trendDown cyxy-trs-source">-0.05%<font class="cyxy-trs-target"> - 0.05%</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Knockout<font class="cyxy-trs-target"> 击倒</font></th>
        <td>1</td>
        <td class="cyxy-trs-source">0.03%</td>
        <td class="is-trendDown cyxy-trs-source">-0.13%<font class="cyxy-trs-target"> - 0.13%</font></td>
    </tr>
    <tr>
        <th>D3.js</th>
        <td>1</td>
        <td class="cyxy-trs-source">0.03%</td>
        <td class="cyxy-trs-source">N/A<font class="cyxy-trs-target"> 不适用</font></td>
    </tr>
    <tr>
        <th class="cyxy-trs-source">Other (please specify)<font class="cyxy-trs-target"> 其他(请注明)</font></th>
        <td>56</td>
        <td class="cyxy-trs-source">1.86%</td>
        <td class="is-trendUp cyxy-trs-source">+0.07%<font class="cyxy-trs-target"> + 0.07%</font></td>
    </tr>
</tbody>
</table>`;
const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-"
});
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);
console.log(turndownService.turndown(table));
