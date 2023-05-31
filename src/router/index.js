import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        mame: 'Manage',
        component: () => import('../views/Manage.vue'),
        redirect: '/home',
        children: [
            {path: 'home', mame: '首页', component: () => import('../views/Home.vue'),},
            {path: 'user', mame: '用户管理', component: () => import('../views/User.vue')},
            {path: 'person', mame: '个人信息', component: () => import('../views/Person.vue')},
            {path: 'file', mame: '文件管理', component: () => import('../views/File')},
            {path: 'role', mame: '角色管理', component: () => import('../views/Role')},
            {path: 'menu', mame: '菜单管理', component: () => import('../views/Menu')}
        ]
    },
    {
        path: '/login',
        mame: 'Login',
        component: () => import('../views/Login')
    },
    {
        path: '/register',
        mame: 'Register',
        component: () => import('../views/Register')
    }

]
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    localStorage.setItem("currentPathName", to.name)   //设置当前路由名称,为了在heade组件中去使用
    store.commit("setPath")   //触发store的数据更新
    next()   //放行路由
})

export default router