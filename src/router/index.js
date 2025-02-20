import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/store'; // 根据你的项目结构调整路径

import TiaoMu from '../components/tiaomu.vue'; // 子组件
import ChangeLog from '../components/sys_Aop.vue'; // 子组件
import PersonalInfo from '../components/person_detail.vue'; // 子组件
import MemberManagement from '../components/memberManagement.vue'; // 子组件
const routes = [
  {
    path: '/index',
    name: 'index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    meta: { title: '首页' },
    children: [
      {
          path: '',
          name: 'TiaoMu',
          component: TiaoMu, // 默认子组件
      },
      {
          path: 'sys_Aop',
          name: 'ChangeLog',
          component: ChangeLog,
          beforeEnter: (to, from, next) => {
            const userRole = store.state.user.role; // 获取用户角色
            if (userRole === 'admin') {
                next(); // 允许访问
            } else {
                next({ path: '/unauthorized' }); // 重定向到未授权页面
            }
        }
        },
      {
          path: 'person_detail',
          name: 'PersonalInfo',
          component: PersonalInfo,
      },
      {
        path: 'manage',
        name: 'MemberManagementnalInfo',
        component: MemberManagement,
        beforeEnter: (to, from, next) => {
          const userRole = store.state.user.role; // 获取用户角色
          console.log(userRole);
          if (userRole === 'admin') {
              next(); // 允许访问
          } else {
              next({ path: '/unauthorized' }); // 重定向到未授权页面
          }
      }
      },
  ],
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../components/unauthorized.vue'),
    meta: { title: '无权访问' }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../components/reset.vue'),
    meta: { title: '重置密码' }
  },
  {
    path: '/please',
    name: 'please',
    component: () => import('../components/please.vue'),
    meta: { title: '请求重置' }
  },
  {
    path: '/',
    name: 'login',
    component: () => import('../components/login.vue'),
    meta: { title: '登录页' }
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('../components/sign.vue'),
    meta: { title: '注册页' }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../components/test.vue'),
    meta: { title: '测试页' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
