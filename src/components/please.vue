<template>
    <div>
        <el-form style="margin: 40px auto;width: 500px;">
            <el-form-item label="电子邮件" :rules="[{ required: true, message: '请输入您的电子邮件', trigger: 'blur' }]">
                <el-input v-model="email" placeholder="请输入您的电子邮件" />
            </el-form-item>
            <el-button type="primary" @click="requestPlease">请求重置密码</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { RequestPlease } from '../network_api/PageRequest';
import { useRouter } from 'vue-router';
const $router = useRouter();
const email = ref('');

const requestPlease = async () => {
    try {
        await RequestPlease(email.value); // 调用请求重置函数
        ElMessage.success('重置链接已发送到您的邮箱'); // 成功提示
        $router.push('/reset-password');
    } catch (error) {
        ElMessage.error('请求失败: ' + error.message); // 错误提示
    }
};
</script>

<style scoped>
/* 这里可以添加样式 */
</style>
