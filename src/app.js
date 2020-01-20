// 通用 entry(universal entry)
import Vue from 'vue'
import App from './App.vue'
module.exports = function createApp(context) {
    return new Vue({
        data: {
            url: context.url,
            query: context.query,
            params: context.params
        },
        template: `<div>
            <div>访问URL: {{url}}</div>
            <div>请求query参数: {{query}}</div>
            <div>请求params参数: {{params}}</div>
        </div>`
    })
}