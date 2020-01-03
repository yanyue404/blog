<template>
  <q-page v-if="postList.length !== 0" padding>
    <q-list padding class="rounded-borders" style="margin-top: -24px;">
      <Item :postList="postList" />
    </q-list>
  </q-page>
</template>

<script>
import { axiosInstance } from "boot/axios";
import { mapState } from "vuex";
import Item from "../components/Item";

export default {
  name: "List",
  components: { Item },
  data() {
    return {
      postList: [],
      loaded: false,
      page: 1,
      number: 30,
      total_count: ""
    };
  },
  computed: {
    ...mapState({
      searchKeyWords: state => state.search.searchKeyWords
    })
  },
  watch: {
    $route() {
      // 标签分类
      if (this.$route.query.label) {
        this.getIssueList(1, 50);
      } else {
        // 普通分页
        this.getIssueList(this.page, this.number);
      }
    },
    searchKeyWords(val) {
      this.getIssueList(1, 50, false, val);
    }
  },
  methods: {
    getIssueList(page, number, pagination = false, keyWorld = "") {
      this.$set(this, "loaded", false);
      if (!this.$route.query.label) {
        this.$set(this, "page", page);
      }
      if (this.postList.length === 0) {
        this.$q.loading.show({ delay: 250 });
      }
      let url = `/search/issues?q=+repo:${this.$store.getters.repository}+state:open&page=${page}&per_page=${number}`;
      // 标签搜索 label:
      if (this.$route.query.label) {
        const that = this;
        url = url.replace(
          /\+state/g,
          m => `+label:${that.$route.query.label}${m}`
        );
      }
      // 关键词搜索 q=
      if (keyWorld) {
        const that = this;
        url = url.replace(/\+repo/g, m => `${that.searchKeyWords}${m}`);
      }
      axiosInstance.get(url).then((res) => {
        // 分页模式 拼接数据
        if (pagination === true) {
          this.$set(this, "postList", this.postList.concat(res.data.items));
        } else {
          this.$set(this, "postList", res.data.items);
          // 恢复第一页
          this.$set(this, "page", 1);
        }
        this.$set(this, "total_count", res.data.total_count);
        this.$set(this, "loaded", true);
        this.$q.loading.hide();
      });
    },
    handleScroll() {
      const that = this;
      window.onscroll = () => {
        // 距离底部200px时加载一次
        const bottomOfWindow = document.documentElement.offsetHeight
            - document.documentElement.scrollTop
            - window.innerHeight
          <= 200;
        if (
          bottomOfWindow
          && that.loaded
          && that.total_count > that.postList.length
        ) {
          that.getIssueList(that.page + 1, that.number, true);
        }
      };
    }
  },
  created() {
    this.getIssueList(this.page, this.number);
  },
  mounted() {
    this.handleScroll();
  }
};
</script>

<style>
</style>
