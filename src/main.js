import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import router from "@/router";
import store from "@/store";
import request from "@/util/request";

Vue.config.productionTip = false
Vue.use(ElementUI,{size:"mini"})
Vue.prototype.request=request

new Vue({
  render: h => h(App),
  router:router,
  store:store,
}).$mount('#app')
