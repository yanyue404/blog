<template>
  <div>
    <div v-for="post in postList" :key="post.index">
      <q-item clickable v-ripple class="q-mt-lg">
        <q-item-section @click="toPostDetail(post.number)">
          <q-item-label>
            <div class="text-h6 rainbow">{{ post.title }}</div>
            <q-item-label
              class="text-gray-light text-weight-thin q-mt-sm q-mb-sm"
            >
              {{ post.created_at | dateFormate }}
            </q-item-label>
          </q-item-label>
          <!-- 展示 4 行内容 -->
          <q-item-label
            lines="4"
            class="text-body1 text-gray-light text-justify"
          >
            {{ post.body_html | htmlToText }}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-chip
            v-for="label in post.labels"
            outline
            square
            clickable
            class="label"
            :key="label.index"
            :style="`border-color: 1px solid rgba(27,31,35,.2); color: #fff;background: #${label.color}!important`"
            @click="chipClickHandler(label.name)"
          >
            {{ label.name }}
          </q-chip>
        </q-item-section>
      </q-item>
      <q-separator spaced inset />
    </div>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "Item",
  props: {
    postList: {
      type: Array,
      required: true,
    },
  },
  filters: {
    dateFormate(d) {
      return date.formatDate(d, "YYYY-MM-DD HH:mm:ss");
    },
    htmlToText(h) {
      return h.replace(/<\/?.+?>/g, "");
    },
  },
  methods: {
    toPostDetail(id) {
      this.$router.push(`/posts/${id}`);
    },
    chipClickHandler(labelName) {
      this.$router.push(`/?label=${labelName}`);
    },
  },
};
</script>

<style scoped lang="scss">
.label:hover {
  box-shadow: 4px 4px 2px #888;
}
.markdown-body hr {
  height: unset;
}
@media (max-width: 767px) {
  .label,
  .created-at {
    display: none;
  }
}
</style>
