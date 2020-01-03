<template>
  <div id="q-app" class="markdown-body">
    <router-view />
  </div>
</template>

<script>
import "github-markdown-css/github-markdown.css";
import "./css/global.css";

export default {
  name: "App"
};
</script>

<style scoped lang="stylus">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
