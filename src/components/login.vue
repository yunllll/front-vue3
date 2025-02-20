<template>
    <div
        style="height: 100vh; overflow: hidden;display: flex;justify-content: center;align-items: center;background-color: #cecece;">
        <div style="display: flex;background-color: white;width: 50%;border-radius: 5px;overflow: hidden;">
            <div style="flex: 1;">
                <img src="@/assets/images/logo.png" alt="" style="width: 100%;">
            </div>
            <div style="flex: 1;display: flex;align-items: center;justify-content: center;">
                <el-form :model="user" style="width: 80%;position: relative;">
                    <div style="font-size: 20px; font-weight: bold;margin-bottom: 20px;">欢迎登录</div>
                    <div style="margin: 5px auto;"><el-avatar v-if="userIcon" :src="userIcon" alt="User Avatar" /></div>
                    <el-form-item prop="username">
                        <el-input size="medium" clearable placeholder="请输入账号" v-model="user.username">
                            <template #prefix>
                                <el-icon>
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="medium" clearable placeholder="请输入密码" v-model="user.password" show-password
                            type="password">
                            <template #prefix>
                                <el-icon>
                                    <Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 100%;" @click="login">登录</el-button>
                        <Vcode :show="isShow" @success="handleSuccess" @close="close" @fail="fail" :imgs="[Img]">
                        </Vcode>
                    </el-form-item>
                    <el-form-item>
                        <div style="display: flex;justify-content: space-between;width: 100%;">
                            <div>还没有账号？请 <router-link to="/sign"
                                    style="color: #0f9876; cursor: pointer;">注册</router-link></div>
                            <div><span style="color: #0f9876;cursor: pointer;" @click="forget">忘记密码</span></div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted,computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

import { RequestLogin } from '../network_api/PageRequest';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
// 自定义背景图
import Img from '@/assets/avatar_img/pikaqiu.png';
import Vcode from 'vue3-puzzle-vcode';

const store = useStore();

// 计算属性获取用户头像
const userIcon = computed(() => store.state.user.icon);
// 获取路由参数
const route = useRoute();
onMounted(() => {
    // 如果路由中有用户名和密码，填充到表单中
    if (route.query.username) {
        user.username = route.query.username;
    }
    if (route.query.password) {
        user.password = route.query.password;
    }
});

const user = reactive({
    username: '',
    password: ''
});
const isShow = ref(false);
const $router = useRouter();

//登录
const login = () => {
    const { username, password } = user; // 从表单中获取用户名和密码

    // 输入验证
    if (!username || !password) {
        ElMessage.warning('请先输入账号和密码');
        return; // 终止函数执行
    }
    isShow.value = true; // 显示验证码
    RequestLogin(username, password)
        .then(data => {
            localStorage.setItem('user', JSON.stringify(data.user)); // 存储用户信息
            // 登录成功，更新 Vuex 状态
            store.dispatch('login', data.user); // 提交用户信息
            console.log(data.user);
            // 登录成功，显示消息
            ElMessage.success(data.message);
        })
        .catch(error => {
            // 处理登录失败的逻辑
            if (error.response) {
                console.error('登录失败:', error.data.message);
            } else {
                console.error('请求错误:', error.message);
            }
        });
};


// 用户通过了验证
const handleSuccess = (msg) => {
    isShow.value = false; // 隐藏验证码模态框
    console.log('验证通过: ' + msg);
    // 跳转到首页
    $router.push('/index');
};

// 用户点击遮罩层，关闭模态框
const close = () => {
    isShow.value = false;
};

// 用户验证失败
const fail = () => {
    console.log('验证失败');
};

const forget = () => {
    ElMessage.info('联系管理员获取！');
}

</script>

<style lang="scss" scoped></style>
