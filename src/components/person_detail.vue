<template>
    <el-upload class="avatar-uploader" action="http://175.178.59.198:7980/api/upload-avatar" :show-file-list="false"
        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
    <img v-if="userIcon" :src="userIcon" alt="User Avatar" />
    <el-descriptions title="个人信息" border>
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="身份">{{ user.role }}</el-descriptions-item>
        <el-descriptions-item label="创建日期">{{ formattedCreateDate }}</el-descriptions-item>
        <el-descriptions-item label="头像">
            <el-avatar v-if="user.icon" :src="user.icon" alt="User Icon" style="width: 50px; height: 50px;" />
            <span v-else>无头像</span>
        </el-descriptions-item>
        <el-descriptions-item label="说说">
            <el-tag size="small">暂无</el-tag>
        </el-descriptions-item>
    </el-descriptions>
    <div>
        <h2>我的消息</h2>
        <el-table :default-sort="{ prop: 'createdAt', order: 'descending' }" :data="messages" style="width: 100%" height="250">
            <el-table-column prop="message" label="消息内容" />
            <el-table-column prop="createdAt" label="发送时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.createdAt) }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { updateUserIcon, fetchMessages } from '../network_api/PageRequest'; // 确保正确导入 uploadAvatar 函数
const store = useStore();
const messages = ref([]); // 用于存储消息数据
// 计算属性获取用户信息
const user = computed(() => store.state.user);
// 格式化创建日期
const formattedCreateDate = computed(() => {
    const date = new Date(user.value.createDate);
    return date.toLocaleDateString(); // 可以根据需要自定义格式
});

// 响应式变量，用于存储头像的 URL
const imageUrl = ref('');


// 上传成功的处理函数
const handleAvatarSuccess = async (response, uploadFile) => {
    const userId = store.state.user.id; // 获取当前用户的 ID
    const relativePath = response.filePath.replace(/\\/g, '/'); // 替换反斜杠为正斜杠
    const newIconUrl = `http://175.178.59.198:7980/${relativePath}`; // 构建新的头像 URL

    try {
        // 调用更新用户头像的 API
        await updateUserIcon(userId, newIconUrl); // 更新用户头像 URL

        // 更新 Vuex 中的用户信息
        store.dispatch('updateIcon', newIconUrl); // 调用 action 更新用户头像

        imageUrl.value = newIconUrl; // 更新头像 URL
        ElMessage.success('头像上传成功！'); // 显示成功消息
    } catch (error) {
        ElMessage.error('更新用户头像失败，请重试。');
    }
};


// 上传失败的处理函数
const handleAvatarError = (error) => {
    ElMessage.error('Failed to upload avatar: ' + (error.message || 'Unknown error'));
};

// 上传前的检查函数
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!');
        return false;
    }
    return true;
};
// 格式化日期
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleString('zh-CN', options);
};

// 组件挂载时获取数据
onMounted(async () => {
    try {
        console.log(user.value.id);
        messages.value = await fetchMessages(user.value.id); // 调用封装的获取消息函数并传递用户 ID
    } catch (error) {
        console.error('获取消息失败:', error.message);
    }
});
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>