<template>
  <div id="app">
    <div>访问URL: {{url}}</div>
    <div>请求query参数: {{query}}</div>
    <div>请求params参数: {{params}}</div>
  </div>
</template>

<script>
export default {
  data: {
    url: "test",
    query: "test",
    param: "test"
  }
};
</script>

<style>
</style>