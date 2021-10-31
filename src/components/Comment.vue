<template>
  <div>
    <q-list
      v-for="comment in comments"
      bordered
      class="rounded-borders q-mt-lg"
      :key="comment.index"
    >
      <q-item class="q-pa-md">
        <q-item-section avatar>
          <q-avatar rounded>
            <img alt="avatar" :src="comment.user.avatar_url" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            <span class="text-weight-bold">{{ comment.user.login }}</span>
            <span class="text-gray-light">
              {{ comment.updated_at | timeAgo }}</span
            >
          </q-item-label>
          <q-item-label
            v-html="comment.body_html"
            class="q-pt-sm"
          ></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="flex flex-center q-mt-xl">
      <q-btn outline no-caps class="rainbow" @click.native="goAddComment">
        <q-icon left size="2rem" name="add_comment" />
        <div>Add Comment</div>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { format } from "timeago.js";
import { axiosInstance } from "boot/axios";

export default {
  name: "Comment",
  data() {
    return {
      comments: [],
      addCommentUrl: `https://github.com/${this.$store.getters.repository}/issues/${this.$route.params.id}/#new_comment_field`,
    };
  },
  filters: {
    timeAgo(d) {
      return format(d);
    },
  },
  methods: {
    getComments() {
      axiosInstance
        .get(
          `/repos/${this.$store.getters.repository}/issues/${this.$route.params.id}/comments`
        )
        .then((res) => {
          this.$set(this, "comments", res.data);
        });
    },
    goAddComment() {
      openURL(this.addCommentUrl);
    },
  },
  created() {
    this.getComments();
  },
};
</script>

<style scoped lang="scss">
.q-item__section--side > .q-avatar {
  font-size: 48px;
}

@media (max-width: 767px) {
  .q-item__section--side > .q-avatar {
    font-size: 36px;
  }
}
</style>
