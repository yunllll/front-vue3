<template>
    <div>
        <h1>上传头像</h1>
        <input type="file" @change="onFileChange" accept="image/*" />
        <button @click="handleUploadAvatar">上传头像</button>
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Avatar" style="width: 100px; height: 100px;" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { uploadAvatar as uploadAvatarAPI } from '../network_api/PageRequest'; // 导入上传头像的 API 函数

const selectedFile = ref(null); // 存储选中的文件
const imageUrl = ref(''); // 存储头像的 URL

// 处理文件选择
const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file; // 保存选中的文件
    }
};

// 上传头像
const handleUploadAvatar = async () => {
    if (!selectedFile.value) {
        ElMessage.error('请先选择一个文件。');
        return;
    }

    try {
        const response = await uploadAvatarAPI(selectedFile.value); // 调用上传头像的 API
        const relativePath = response.filePath.replace(/\\/g, '/'); // 替换反斜杠为正斜杠
        imageUrl.value = `http://localhost:7980/${relativePath}`; // 更新头像 URL
        console.log(imageUrl.value );
        ElMessage.success(response.message);
    } catch (error) {
        ElMessage.error('上传头像失败，请重试。');
    }
};
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
