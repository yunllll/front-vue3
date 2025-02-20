<template>
    <div class="common-layout">
        <el-container>
            <el-aside style="min-height: 100vh;" :width="asideWidth">
                <div class="aside">
                    <el-avatar :size="60" :src="userIcon" @error="errorHandler"
                        style="width: 40px; height: 40px; border-radius: 50%;">
                        <img src="@/assets/avatar_img/logo.jpg" />
                    </el-avatar>
                    <transition name="el-fade-in">
                        <span class="logo-title" v-show="!isCollapse">财务明细</span>
                    </transition>
                </div>
                <el-menu active-text-color="#d3e0e2" background-color="#545c64" class="el-menu-vertical-demo" router
                    :default-active="$route.path" text-color="#cecece" @open="handleOpen" @close="handleClose"
                    style="border: none;" :collapse="isCollapse" :collapse-transition="false">
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <message />
                            </el-icon>
                            <span>首页</span>
                        </template>
                        <el-menu-item-group title="功能">
                            <el-menu-item index="/index" @click="addBreadcrumb('详情', '/index')">详情</el-menu-item>
                            <el-menu-item index="/index/sys_Aop"
                                @click="addBreadcrumb('条目更改日志', '/index/sys_Aop')">条目更改日志</el-menu-item>
                            <el-menu-item index="/index/person_detail"
                                @click="addBreadcrumb('个人信息', '/index/person_detail')">个人信息</el-menu-item>
                            <el-menu-item index="/index/manage"
                                @click="addBreadcrumb('成员管理', '/index/manage')">成员管理</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="padding-left: 40px;padding-right: 40px;">
                    <el-breadcrumb :separator-icon="ArrowRight">
                        <el-breadcrumb-item :to="{ path: '/index' }"><el-icon @click="handleCollapse">
                                <Fold v-if="!isCollapse" />
                                <Expand v-else />
                            </el-icon><span style="margin-left: 10px;">首页</span></el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="{ path: item.path }">
                            {{ item.label }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-dropdown placement="bottom-start" style="margin-left: auto;">
                        <el-button style="display: flex; align-items: center; justify-content: center;"><img
                                :src="userIcon" alt="" style="width: 30px; height: 30px; border-radius: 50%;">{{
                            getRoleLabel(user.role) }} </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <router-link to="/index/person_detail">
                                    <el-dropdown-item>个人信息</el-dropdown-item>
                                </router-link>
                                <el-dropdown-item @click="Logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-header>
                <el-main>
                    <router-view></router-view> <!-- 显示当前路由对应的子组件 -->
                </el-main>
                <el-footer>Foot</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import axios from "axios"
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    Message
} from '@element-plus/icons-vue';

const errorHandler = () => true


// 使用 ref 创建响应式数据
const users = ref([]);

let isCollapse = ref(true);
let asideWidth = ref('64px'); // 也将 asideWidth 转换为响应式变量
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath);
};
// 切换折叠状态的处理函数
const handleCollapse = () => {
    isCollapse.value = !isCollapse.value; // 使用 .value 来访问和修改
    asideWidth.value = isCollapse.value ? '64px' : '200px'; // 同样使用 .value
};
const handleClose = (key, keyPath) => {
    console.log(key, keyPath);
};

const breadcrumbs = ref([]); // 创建响应式数组来存储面包屑项

const addBreadcrumb = (label, path) => {
    // 清空面包屑数组，确保只有当前项
    breadcrumbs.value = [];
    breadcrumbs.value.push({ label, path }); // 添加新的面包屑项
};

import { useStore } from 'vuex';
const store = useStore();
// 计算属性获取用户信息
const user = computed(() => store.state.user);
// console.log(user.icon)
const $router = useRouter();

// 计算属性获取用户的头像 URL
const userIcon = computed(() => store.state.user.icon);
const Logout = () => {
    store.dispatch('logout'); // 清空用户信息
    $router.push('/');
};
// 在组件挂载时获取数据
onMounted(() => {
});

// 获取角色名称
const getRoleLabel = (role) => {
    const roleLabels = {
        admin: '管理员',
        accountant: '会计',
        normal: '普通用户'
    };
    return roleLabels[role] || '未知角色'; // 如果角色不在定义中，返回 '未知角色'
};
</script>

<style lang="scss" scoped>
.el-radio-group {
    margin-right: 12px;
}

.aside {
    height: 60px;
    line-height: 60px;
    background-color: #8c939d;
    color: #d3e0e2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}

item:hover,
el-submenu__title:hover {
    color: #fff !important;
}

.el-submenu__title:hover i {
    color: #fff !important;
}

.el-menu-item.is-active {
    background-color: #5ab9f0 !important;
    border-radius: 5px !important;
}

.el-aside {
    transition: width 0.4s;
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
}

.logo-title {
    margin-left: 5px;
    font-size: 14px;
    transition: all 0.4s;
}

.el-header {
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    display: flex;
    align-items: center;
}

.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.margin-top {
    margin-top: 20px;
}

.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>