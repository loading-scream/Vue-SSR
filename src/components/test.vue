<template>
  <div>
    <div>test123, route val:{{item && item.title}}</div>
    <div class="test">count: {{count}}</div>
  </div>
</template>

<script>
import testStore from "../factory/store/modules/test";

export default {
  asyncData({ store, route }) {
    store.registerModule("test", testStore);
    return Promise.all([
      store.dispatch("test/inc"),
      store.dispatch("fetchItem", { id: route.query.id || 123 })
    ]);
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    this.$store.unregisterModule("test");
  },
  computed: {
    item() {
      return this.$store.state.items[this.$route.query.id || "123"];
    },
    count() {
      return this.$store.state.test.count;
    }
  }
};
</script>

<style scoped>
.test {
  color: red;
  font-size: 14px;
}
</style>