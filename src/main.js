import Vue from 'vue';
import App from './App.vue';
import router from './router/public';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import {
	messages
} from './components/common/i18n';
//import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/theme-green/index.css'
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import VueUeditorWrap from 'vue-ueditor-wrap'
import constant from './const/const.js'
import './assets/icons/index'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(constant);
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
	size: 'small'
});

const i18n = new VueI18n({
	locale: 'zh',
	messages
});
Vue.component('vue-ueditor-wrap', VueUeditorWrap);
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
	document.title = `${to.meta.title} | NFT MINT`;
	// const token = localStorage.getItem('changfei-admin-token');
	// if (!token && to.path !== '/login') {
	// 	next('/login');
	// } else if (to.meta.permission) {
	// 	//console.log("验证token");
	// 	(token == "" || token == null) ? next('/login'): next();
	// } else {
	// 	next();
	// }
	next();
});

new Vue({
	router,
	i18n,
	render: h => h(App)
}).$mount('#app');
