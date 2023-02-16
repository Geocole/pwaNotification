import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Service worker registered with scope: ', registration.scope);
      }, function(err) {
        console.log('Service worker registration failed: ', err);
      });
  });
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
