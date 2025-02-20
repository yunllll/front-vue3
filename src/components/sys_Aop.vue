<template>
    <div>
        <h2>条目更改日志和审核</h2>
        <el-table :data="changeLogs" style="width: 100%" height="800">
            <el-table-column prop="avatar" label="头像" width="100">
                <template #default="{ row }">
                    <img :src="row.avatar" alt="头像" style="width: 40px; height: 40px; border-radius: 50%;" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="150" />
            <el-table-column prop="oldValue" label="以前的条目值">
            </el-table-column>
            <el-table-column prop="modifiedAt" label="修改时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.modifiedAt) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button type="success" @click="approveChange(row)">通过</el-button>
                    <el-button type="danger" @click="rejectChange(row)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="Visible" title="通过">
            <el-input v-model="approveMessage" placeholder="通过和改进建议"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendapproveMessage">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog v-model="dialogVisible" title="拒绝修改">
            <el-input v-model="rejectionMessage" placeholder="请输入拒绝理由"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendRejectionMessage">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchChangeLogs, sendMessage } from '../network_api/PageRequest';
const changeLogs = ref([]); // 假设这是从 API 获取的更改日志
const Visible = ref(false);
const dialogVisible = ref(false);
const approveMessage = ref('');
// 计算属性，拼接最终消息
const AMessage = computed(() => {
    return `通过: ${approveMessage.value}`; // 拼接字符串
});
const BMessage = computed(() => {
    return `拒绝: ${rejectionMessage.value}`; // 拼接字符串
});
const rejectionMessage = ref('');
import { ElMessage } from 'element-plus';
let currentRow = null; // 用于存储当前拒绝的行

// 格式化日期
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleString('zh-CN', options);
};

// 通过审核
const approveChange = (row) => {
    // 处理通过逻辑
    console.log('通过:', row);
    currentRow = row; // 保存当前行
    Visible.value = true; // 显示拒绝理由输入框
};

// 发送通过消息
const sendapproveMessage = async () => {
    if (!approveMessage.value) {
        ElMessage.success('通过!'); // 显示成功消息
        return;
    }

    // 发送通过消息到后端
    try {
        const res = await sendMessage(currentRow.userId, AMessage.value); // 调用封装的发送消息函数
        ElMessage.success(res.message); // 显示成功消息
    } catch (error) {
        console.error('发送消息失败:', error.message);
    } finally {
        Visible.value = false; // 关闭对话框
        approveMessage.value = ''; // 清空输入框
    }
};
// 拒绝审核
const rejectChange = (row) => {
    console.log('拒绝审核的行:', row); // 调试输出
    currentRow = row; // 保存当前行
    dialogVisible.value = true; // 显示拒绝理由输入框
};

// 发送拒绝消息
const sendRejectionMessage = async () => {
    if (!rejectionMessage.value) {
        ElMessage.warn('请填写拒绝理由!'); // 显示成功消息
        return;
    }

    // 发送拒绝消息到后端
    try {
        const res = await sendMessage(currentRow.userId, BMessage.value); // 调用封装的发送消息函数
        ElMessage.success(res.message); // 显示成功消息
    } catch (error) {
        console.error('发送消息失败:', error.message);
    } finally {
        dialogVisible.value = false; // 关闭对话框
        rejectionMessage.value = ''; // 清空输入框
    }
};
// // 转换为中文文本
// const convertToChineseText = (data) => {
//     return `
// 序号: ${data.id}
// 录入日期: ${new Date(data.entry_date).toLocaleString('zh-CN')}
// 摘要: ${data.description}
// 收入金额: ${data.income_amount}
// 业务费: ${data.business_expense}
// 汽油费: ${data.gasoline_expense}
// 烟酒费: ${data.alcohol_tobacco}
// 材料费: ${data.material_expense}
// 人工: ${data.labor_expense}
// 税费: ${data.tax_expense}
// 借支: ${data.advance_expense}
// 其他费用: ${data.other_expense}
// 确认签名: ${data.confirm_signature === 'y' ? '是' : '否'}
// 小计: ${data.subtotal}
// 现金余额: ${data.cash_balance}
//     `;
// };
// const oldValue = ref([])
// 组件挂载时获取数据
onMounted(async () => {
    try {
        changeLogs.value = await fetchChangeLogs(); // 调用获取更改日志的函数
        // oldValue.value = changeLogs.value.map(log => {
        //     return convertToChineseText(JSON.parse(log.oldValue)); // 解析 JSON 字符串并转换
        // })
        // oldValue = oldValue.map(item => item.replace(/\\n/g, '').trim());
        // console.log(changeLogs.value);
    } catch (error) {
        console.error('获取更改日志失败:', error.message);
    }
});
</script>

<style lang="scss" scoped>
h2 {
    margin-bottom: 20px;
}

.el-table {
    margin-top: 20px;
}
</style>
