<template>
    <div style="width: 400px;margin: 40px auto;">
        <el-form>
            <el-form-item label="新密码" :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
                <el-input size="medium" clearable v-model="newPassword" type="password" placeholder="输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" :rules="[{ required: true, message: '请确认新密码', trigger: 'blur' }]">
                <el-input size="medium" clearable v-model="confirmPassword" type="password" placeholder="确认新密码" />
            </el-form-item>
            <el-button type="primary" @click="resetPassword">重置密码</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { RequestResetPassword } from '../network_api/PageRequest';
const newPassword = ref('');
const confirmPassword = ref('');
const route = useRoute(); // 获取路由信息
const router = useRouter(); // 获取路由信息

const resetPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        ElMessage.error('两次输入的密码不一致');
        return;
    }

    const token = route.query.token; // 从 URL 中获取重置令牌
    try {
        await RequestResetPassword(token, newPassword.value); // 调用重置密码请求函数
        ElMessage.success('密码重置成功！');
        router.push('/')
    } catch (error) {
        ElMessage.error('重置失败: ' + error.message); // 错误提示
    }
};
</script>

<style scoped>
/* 这里可以添加样式 */
</style>
