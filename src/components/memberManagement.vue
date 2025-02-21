<template>
    <div>
        <h1 style="margin-bottom: 10px;">用户管理</h1>
        <el-table :data="users" style="width: 100%" center>
            <el-table-column label="头像">
                <template #default="{ row }">
                    <el-avatar :src="row.icon"></el-avatar> <!-- 使用每个用户的头像 -->
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="username" />
            <el-table-column label="角色" prop="role" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-select v-model="row.role" @change="updateRole(row)">
                        <el-option label="admin" value="admin" />
                        <el-option label="accountant" value="accountant" />
                        <el-option label="normal" value="normal" />
                    </el-select>
                    <el-button type="danger" @click="deleteUser(row)">删除</el-button> <!-- 删除按钮 -->
                </template>
            </el-table-column>
        </el-table>

        <h2 style="margin-top: 20px;">已删除用户</h2>
        <el-table :data="deletedUsers" style="width: 100%" center>
            <el-table-column label="头像">
                <template #default="{ row }">
                    <el-avatar :src="row.icon"></el-avatar> <!-- 使用每个用户的头像 -->
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="username" />
            <el-table-column label="角色" prop="role" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" @click="recoverUser(row.id)">撤回删除</el-button> <!-- 撤回删除按钮 -->
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div>
        <h1 style="margin-bottom: 10px;margin-top: 10px;">邀请码管理</h1>
        <el-button type="primary" @click="handleAddInviteCode" style="margin-bottom: 10px;">生成邀请码,1为已经使用。</el-button>
        <el-table :data="inviteCodes" style="width: 100%" center>
            <el-table-column label="邀请码" prop="code" />
            <el-table-column label="状态" prop="is_used" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" @click="handleMarkAsUsed(row.code)">标记为已使用</el-button>
                    <el-button type="danger" @click="handleDeleteInviteCode(row.code)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUsers, updateUserRole, deleteUser as deleteUserApi, getDeletedUsers, recoverUserApi, addInviteCode, fetchInviteCodes, markInviteCodeAsUsed, deleteInviteCode } from '../network_api/PageRequest'; // 导入 API 函数
import { ElMessage } from 'element-plus';

const users = ref([]); // 当前用户列表
const deletedUsers = ref([]); // 已删除用户列表

const fetchUsers = async () => {
    try {
        const usersData = await getUsers(); // 调用获取用户列表的 API
        console.log('获取的用户数据:', usersData); // 打印获取的用户数据
        users.value = Array.isArray(usersData) ? usersData : []; // 确保赋值为数组
    } catch (error) {
        console.error('获取用户列表失败:', error); // 打印错误信息
    }
};

const fetchDeletedUsers = async () => {
    try {
        const deletedUsersData = await getDeletedUsers(); // 调用获取已删除用户列表的 API
        console.log('获取的已删除用户数据:', deletedUsersData); // 打印获取的已删除用户数据
        deletedUsers.value = Array.isArray(deletedUsersData) ? deletedUsersData : []; // 确保赋值为数组
    } catch (error) {
        console.error('获取已删除用户列表失败:', error); // 打印错误信息
    }
};

// 更新用户角色
const updateRole = async (user) => {
    try {
        await updateUserRole(user.id, user.role); // 调用更新用户角色的 API
        ElMessage.success(`用户 ${user.username} 的角色已更新为 ${user.role}`); // 显示成功消息
    } catch (error) {
        console.error('更新用户角色失败:', error); // 打印错误信息
    }
};

// 删除用户
const deleteUser = async (user) => {
    try {
        await deleteUserApi(user.id); // 调用删除用户的 API
        users.value = users.value.filter(u => u.id !== user.id); // 从用户列表中移除已删除的用户
        fetchDeletedUsers();
        ElMessage.success('用户已成功删除'); // 显示成功消息
    } catch (error) {
        console.error('删除用户失败:', error); // 打印错误信息
        ElMessage.error('删除用户失败，请重试'); // 显示错误消息
    }
};

// 撤回删除用户
const recoverUser = async (user) => {
    try {
        const newInviteCode = await addInviteCode(); // 调用生成邀请码的 API
        await recoverUserApi(user, newInviteCode); // 调用恢复用户的 API，并传递邀请码
        ElMessage.success(`用户已成功恢复，生成的邀请码: ${newInviteCode}`); // 显示成功消息
        await fetchUsers(); // 重新获取用户列表
        await fetchDeletedUsers(); // 重新获取已删除用户列表
        await loadInviteCodes(); // 重新加载邀请码列表
    } catch (error) {
        console.error('恢复用户失败:', error); // 打印错误信息
        ElMessage.error('恢复用户失败，请重试'); // 显示错误消息
    }
};

const inviteCodes = ref([]); // 存储邀请码数据
// 获取邀请码
const loadInviteCodes = async () => {
    try {
        inviteCodes.value = await fetchInviteCodes(); // 调用获取邀请码的 API
    } catch (error) {
        console.error('加载邀请码失败:', error.message);
    }
};

// 生成并存储邀请码
const handleAddInviteCode = async () => {
    try {
        const newInviteCode = await addInviteCode(); // 调用生成邀请码的 API
        ElMessage.success(`新生成的邀请码: ${newInviteCode}`); // 显示生成的邀请码
        loadInviteCodes(); // 重新加载邀请码列表
    } catch (error) {
        console.error('添加邀请码失败:', error.message);
    }
};

const handleMarkAsUsed = async (inviteCode) => {
    try {
        await markInviteCodeAsUsed(inviteCode); // 调用标记为已使用的函数
        await loadInviteCodes(); // 重新加载邀请码列表
    } catch (error) {
        console.error('标记邀请码失败:', error.message);
    }
};

// 删除邀请码的处理函数
const handleDeleteInviteCode = async (inviteCode) => {
    try {
        await deleteInviteCode(inviteCode); // 调用删除邀请码的函数
        ElMessage.success(`邀请码 ${inviteCode} 已成功删除!`); // 显示成功消息
        await loadInviteCodes(); // 重新加载邀请码列表
    } catch (error) {
        console.error('删除邀请码失败:', error.message);
    }
};
// 在组件挂载时获取数据
onMounted(() => {
    fetchUsers();
    fetchDeletedUsers(); // 获取已删除用户列表
    loadInviteCodes();
});
</script>

<style scoped></style>
