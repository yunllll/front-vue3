<template>
    <div style="height: 100vh; overflow: hidden;display: flex;justify-content: center;align-items: center;background-color: #1A5599
;">
        <div style="display: flex;background-color: white;width: 50%;border-radius: 5px;overflow: hidden;">
            <div style="flex: 1;">
                <img src="@/assets/images/logo.png" alt="" style="width: 100%;">
            </div>
            <div style="flex: 1;display: flex;align-items: center;justify-content: center;">
                <el-form :model="user" style="width: 80%;position: relative;">
                    <div style="font-size: 20px; font-weight: bold;margin-bottom: 20px;">欢迎注册</div>
                    <el-form-item prop="username">
                        <el-input size="medium" placeholder="账号名" v-model="user.username">
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
                    <el-form-item prop="confirmPassword">
                        <el-input size="medium" clearable placeholder="再次输入密码" v-model="user.confirmPassword"
                            type="password" show-password>
                            <template #prefix>
                                <el-icon>
                                    <Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker size="medium" style="width: 100%;" v-model="user.createDate" type="datetime"
                            placeholder="注册时间" :shortcuts="shortcuts" />
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '请输入您的电子邮件！', trigger: 'blur' }]">
                        <el-input size="medium" style="width: 100%;" v-model="user.email" placeholder="请输入您的电子邮件地址"
                            clearable />
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-radio-group v-model="user.role">
                            <el-radio label="管理员" value="admin" />
                            <el-radio label="会计" value="accountant" />
                            <el-radio label="普通用户" value="normal" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="inviteCode">
                        <el-input size="medium" placeholder="请输入邀请码" v-model="user.inviteCode">
                            <template #prefix>
                                <el-icon>
                                    <Key />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 100%;" @click="register">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { RequestRegister, checkInviteCode, markInviteCodeAsUsed } from '../network_api/PageRequest';
const $router = useRouter();

// 创建响应式用户对象
const user = reactive({
    icon: 'http://localhost:7980/uploads/default.jpg',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    email: '',
    resetToken: 'zero',
    inviteCode: '',
    createDate: new Date().toISOString().split('T')[0] // 设置为当前日期
});

const register = async () => {
    // 检查用户名和密码是否为空
    if (!user.username || !user.password || !user.confirmPassword) {
        ElMessage.warning('请先输入账号和密码');
        return; // 终止函数执行
    }

    // 检查密码是否一致
    if (user.password !== user.confirmPassword) {
        ElMessage.warning('两次输入的密码不一致');
        return;
    }

    // 检查密码复杂性
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordPattern.test(user.password)) {
        ElMessage.warning('密码必须包含大小写字母、数字，并且至少6位');
        return;
    }

    // 检查邀请码是否为空
    if (!user.inviteCode) {
        ElMessage.warning('注册需要提供邀请码');
        return;
    }

    // 验证邀请码
    try {
        console.log('用户输入的邀请码:', user.inviteCode);
        await checkInviteCode(user.inviteCode); // 调用检查邀请码的 API
    } catch (error) {
        ElMessage.error(error.response ? error.response.data.message : '邀请码验证失败');
        return;
    }

    try {
        const response = await RequestRegister(user);
        // 注册成功，显示消息
        ElMessage.success(response.message);
        
        // 更新邀请码状态
        await markInviteCodeAsUsed(user.inviteCode);

        // 重定向到登录页面
        $router.push({ path: '/', query: { username: user.username, password: user.password } });
    } catch (error) {
        console.error('注册失败:', error.response ? error.response.data.message : error.message);
    }
};

</script>

<style lang="scss" scoped></style>
