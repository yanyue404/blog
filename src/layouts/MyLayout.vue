<template>
  <q-layout view="hHh Lpr fFf">
    <q-header
      elevated
      style="background: linear-gradient(145deg, #027be3 11%, #014a88 75%)"
    >
      <q-toolbar>
        <q-btn
          flat
          round
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <!-- <div class="q-btn__wrapper col row no-wrap q-anchor--skipr"> -->
        <!-- <q-btn round style="padding: 4px 16px" @click="toOutLink">
          <q-avatar class="doc-layout-avatar" size="38px">
            <img src="https://cdn.quasar.dev/app-icons/icon-128x128.png" />
          </q-avatar>
        </q-btn> -->
        <q-toolbar-title>{{ $store.getters.blogName }}</q-toolbar-title>
        <q-input
          v-if="showSearchInput"
          dark
          dense
          standout
          placeholder="Search"
          v-model="text"
          class="q-ml-md input-search"
        >
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="text = ''"
            />
          </template>
        </q-input>
        <!-- <iframe
          src="https://ghbtns.com/github-btn.html?user=ttop5&repo=issue-blog&type=star&count=true"
          frameborder="0"
          scrolling="0"
          width="100px"
          height="20px"
        ></iframe>-->
        <!-- </div> -->
      </q-toolbar>
    </q-header>
    <!-- 抽屉菜单 -->
    <q-drawer
      v-if="user.id"
      v-model="leftDrawerOpen"
      show-if-above
      class="rainbow"
      style="height: 100%"
      side="left"
    >
      <q-scroll-area
        style="
          height: calc(100% - 250px);
          margin-top: 250px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list class="q-pa-md q-mb-lg">
          <q-item-label header>Links</q-item-label>
          <q-item
            v-for="item in links"
            clickable
            v-ripple
            tag="a"
            target="_blank"
            :key="item.index"
            :href="item.url"
          >
            <q-item-section avatar class="text-grey-10">
              <q-icon size="30px" class="rainbow" :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="rainbow">{{ item.title }}</q-item-label>
              <q-item-label caption style="text-decoration: underline">{{
                item.subTile
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 250px"
      >
        <div
          class="absolute-center bg-transparent text-center"
          style="width: 100%"
        >
          <q-avatar size="80px" class>
            <img alt="ttop5-avatar" :src="user.avatar_url" />
          </q-avatar>
          <div class="q-pt-md text-h5">{{ user.name }}</div>
          <div class="text-h5">{{ user.login }}</div>
          <div class="q-pt-sm">{{ user.bio }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container class="q-mb-xl">
      <!-- 中间实际 -->
      <router-view />
      <br />
      <br />
      <div class="absolute-bottom text-center text-grey-6">
        © {{ year }}
        <a class="text-grey-6" href="https://github.com/ttop5/issue-blog"
          >issue-blog</a
        >
      </div>
    </q-page-container>

    <q-page-sticky
      style="color: #027be3"
      elevated
      reveal
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-fab icon="unfold_more" class="rainbow" direction="up">
        <q-fab-action icon="home" class="rainbow" @click="$router.push('/')" />
        <q-fab-action
          icon="keyboard_arrow_up"
          class="rainbow"
          @click="backToTop"
        />
      </q-fab>
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { date } from "quasar";
import { axiosInstance } from "../boot/axios";

export default {
  name: "MyLayout",
  data() {
    return {
      showSearchInput: true,
      text: "",
      leftDrawerOpen: false,
      user: {},
      links: this.$store.getters.links,
      year: date.formatDate(new Date(), "YYYY"),
    };
  },
  methods: {
    getUserInfo() {
      axiosInstance
        .get(`https://api.github.com/users/${this.$store.getters.username}`)
        .then((res) => {
          this.$set(this, "user", res.data);
        });
    },
    backToTop() {
      let timer;
      const gotoTop = () => {
        let currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= 100;
        if (currentPosition > 0) {
          window.scrollTo(0, currentPosition);
        } else {
          window.scrollTo(0, 0);
          clearInterval(timer);
          timer = null;
        }
      };
      timer = setInterval(gotoTop, 1);
    },
    toOutLink() {
      window.open("https://quasar.dev/", "_blank");
    },
  },

  created() {
    this.getUserInfo();
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  watch: {
    text(val) {
      this.$store.commit("search/keyWordChange", val);
    },
    $route() {
      // 标签分类
      if (this.$route.fullPath.indexOf("/posts") !== -1) {
        this.showSearchInput = false;
      } else {
        this.showSearchInput = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.q-item__label + .q-item__label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.markdown-body a:hover {
  text-decoration: none;
}

.q-btn__wrapper {
  padding: 4px 16px;
  align-items: center;
}
.input-search {
  padding: 0.375;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  min-width: 268px;
}
@media (max-width: 768px) {
  .input-search {
    display: none;
  }
  .q-toolbar__title {
    font-size: 18px;
    padding: 0 3px;
  }
}
</style>
