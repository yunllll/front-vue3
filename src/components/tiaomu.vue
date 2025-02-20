<template>
    <div>
        <h2 style="text-align: center;">2025现金明细</h2>
        <div style="margin: 20px;">
            <input type="file" @change="handleFileUpload" accept=".xlsx, .xls"
                style="display: block; margin: 10px 0;" />
            <el-button @click="importExcel" type="primary">一键导入Excel</el-button>
        </div>
        <el-table :data="filterTableData" style="width: 100%;" border show-summary sum-text="本月小计" height="450">
            <el-table-column label="序号" prop="id" header-align="center" />
            <el-table-column label="日期" prop="entry_date" header-align="center" />
            <el-table-column label="摘要" prop="description" header-align="center" />
            <el-table-column label="收入金额" prop="income_amount" header-align="center" />
            <el-table-column label="支出金额" header-align="center">
                <el-table-column prop="business_expense" label="业务费" header-align="center" />
                <el-table-column prop="gasoline_expense" label="汽油费" header-align="center" />
                <el-table-column prop="alcohol_tobacco" label="烟酒" header-align="center" />
                <el-table-column prop="material_expense" label="材料费" header-align="center" />
                <el-table-column prop="labor_expense" label="人工" header-align="center" />
                <el-table-column prop="tax_expense" label="税费" header-align="center" />
                <el-table-column prop="advance_expense" label="借支" header-align="center" />
                <el-table-column prop="other_expense" label="其他费" header-align="center" />
                <el-table-column prop="subtotal" label="小计" header-align="center" />
            </el-table-column>
            <el-table-column label="现金余额" prop="cash_balance" header-align="center" />
            <el-table-column label="确认签名" prop="confirm_signature" header-align="center" />
            <el-table-column align="right" width="150">
                <template #default="scope">
                    <el-button v-if="userRole !== 'normal'" size="small" @click="handleEdit(scope.row)">Edit</el-button>
                    <el-button v-if="userRole !== 'normal'" size="small" type="danger"
                        @click="handleDelete(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 金额范围输入框 -->
        <div style="margin-top: 20px;">
            <el-input clearable v-model="incomeMin" placeholder="收入金额最小值" style="width: 200px; margin-right: 10px;" />
            <el-input clearable v-model="incomeMax" placeholder="收入金额最大值" style="width: 200px; margin-right: 10px;" />
            <el-input clearable v-model="subtotalMin" placeholder="小计最小值" style="width: 200px; margin-right: 10px;" />
            <el-input clearable v-model="subtotalMax" placeholder="小计最大值" style="width: 200px; margin-right: 10px;" />
            <el-input clearable v-model="cashMin" placeholder="现金余额最小值" style="width: 200px; margin-right: 10px;" />
            <el-input clearable v-model="cashMax" placeholder="现金余额最大值" style="width: 200px; margin-right: 10px;" />
            <el-tooltip :visible="visible">
                <template #content>
                    <span>输入范围的值之后，就自动筛选，把输入框清空，再点击删选按钮就可以刷新条目列表了！</span>
                </template>
                <el-button @click="fetchEntries" @mouseenter="visible = true"
                    @mouseleave="visible = false">重置条目列表</el-button>
            </el-tooltip>
        </div>
        <el-dialog v-model="dialogFormVisibleUpdate" title="编辑条目" center style="width: 500px;">
            <el-form :model="form" style="padding-left: 100px;" :label-position="right">
                <el-form-item label="日期">
                    <el-input v-model="form.entry_date" autocomplete="off" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input v-model="form.description" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="收入金额">
                    <el-input v-model="form.income_amount" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="业务费">
                    <el-input v-model="form.business_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="汽油费">
                    <el-input v-model="form.gasoline_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="烟酒">
                    <el-input v-model="form.alcohol_tobacco" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="材料费">
                    <el-input v-model="form.material_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="人工">
                    <el-input v-model="form.labor_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="税费">
                    <el-input v-model="form.tax_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="借支">
                    <el-input v-model="form.advance_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="其他费">
                    <el-input v-model="form.other_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="确认签名">
                    <el-input v-model="form.confirm_signature" style="width: 200px;" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisibleUpdate = false">取消</el-button>
                    <el-button type="primary" @click="updateEntry">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogFormVisibleAdd" title="编辑条目" center style="width: 500px;">
            <el-form :model="form" style="padding-left: 100px;" :label-position="right">
                <el-form-item label="日期">
                    <el-input v-model="form.entry_date" autocomplete="off" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input v-model="form.description" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="收入金额">
                    <el-input v-model="form.income_amount" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="业务费">
                    <el-input v-model="form.business_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="汽油费">
                    <el-input v-model="form.gasoline_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="烟酒">
                    <el-input v-model="form.alcohol_tobacco" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="材料费">
                    <el-input v-model="form.material_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="人工">
                    <el-input v-model="form.labor_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="税费">
                    <el-input v-model="form.tax_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="借支">
                    <el-input v-model="form.advance_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="其他费">
                    <el-input v-model="form.other_expense" type="number" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="确认签名">
                    <el-input v-model="form.confirm_signature" style="width: 200px;" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
                    <el-button type="primary" @click="addEntry">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <div style="display: flex;justify-content: left;padding-left: 5px;padding-top: 15px;"><el-button
                v-if="userRole !== 'normal'" @click="handleAdd">增加条目</el-button></div>
        <el-input v-model="search" style="max-width: 600px" placeholder="根据摘要关键字查找" class="input-with-select" clearable>
            <template #prepend>
                <el-button :icon="Search" />
            </template>
        </el-input>
        <div style="display: flex;justify-content: space-between;margin: 20px 300px;">
            <el-input :suffix-icon="Search" clearable v-model="searchKeyword" placeholder="输入关键词进行搜索"
                style="width: 400px; margin-top: 5px;" />
            <el-date-picker v-model="startDate" type="date" placeholder="开始日期" style="margin-top: 5px;" />
            <el-date-picker v-model="endDate" type="date" placeholder="结束日期" style="margin-top: 5px;" />
            <el-tooltip :visible="visible">
                <template #content>
                    <span>搜索完之后，把关键词输入框清空，再点击搜索按钮就可以刷新条目列表了！</span>
                </template>
                <el-button @click="searchEntries" @mouseenter="visible = true"
                    @mouseleave="visible = false">搜索</el-button>
            </el-tooltip>
        </div>
        <div style="display: flex; justify-content: center; padding-top: 15px;">
            <el-button type="success" v-if="userRole !== 'normal'" @click="openDialog">
                点击填写今天修改的内容发给管理员
            </el-button>
        </div>

        <!-- 对话框 -->
        <el-dialog v-model="dialogFormVisiblek" title="编辑条目" center style="width: 500px;">
            <el-input type="textarea" v-model="Message" placeholder="填写今天修改的内容" rows="4"></el-input>
            <el-input v-model="adminName" placeholder="输入管理员的名字" style="margin-top: 10px;"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblek = false">取 消</el-button>
                <el-button type="primary" @click="handleSendMessage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { RequestGetEntries } from '../network_api/PageRequest'; // 导入获取条目表的请求函数
import { RequestUpdateEntry } from '../network_api/PageRequest'; // 导入更新条目表的请求函数
import { RequestDeleteEntry } from '../network_api/PageRequest'; // 导入删除条目表的请求函数
import { RequestAddEntry } from '../network_api/PageRequest'; // 导入增加条目表的请求函数
import { RequestSearchEntries } from '../network_api/PageRequest'; // 导入搜索条目表的请求函数
import { logChange } from '../network_api/PageRequest'; // 导入日志服务
import { sendMessage, fetchUserIdByName } from '../network_api/PageRequest';
import { useStore } from 'vuex';
import { readSheetNames } from 'read-excel-file';
// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 解析Excel文件
  const rows = await readSheetNames(file);
  
  // 数据映射（假设Excel结构如下）
  // 序号 | 日期 | 摘要 | 收入金额 | 业务费 | 汽油费 | 烟酒 | 材料费 | 人工 | 税费 | 借支 | 其他费 | 小计 | 现金余额 | 确认签名
  for (const row of rows.slice(2)) { // 跳过表头和空行
    if (!row[0]) continue; // 跳过空行

    const entry = {
      id: row[0], // A列：序号
      entry_date: formatExcelDate(row[1]), // B列：日期
      description: row[2], // C列：摘要
      income_amount: Number(row[3]) || 0, // D列：收入金额
      business_expense: Number(row[4]) || 0, // E列：业务费
      gasoline_expense: Number(row[5]) || 0, // F列：汽油费
      alcohol_tobacco: Number(row[6]) || 0, // G列：烟酒
      material_expense: Number(row[7]) || 0, // H列：材料费
      labor_expense: Number(row[8]) || 0, // I列：人工
      tax_expense: Number(row[9]) || 0, // J列：税费
      advance_expense: Number(row[10]) || 0, // K列：借支
      other_expense: Number(row[11]) || 0, // L列：其他费
      subtotal: 0, // M列：小计（自动计算）
      cash_balance: 0, // N列：现金余额（自动计算）
      confirm_signature: row[14] || '', // O列：确认签名
    };

    // 计算小计和现金余额
    entry.subtotal = calculateSubtotal(entry);
    entry.cash_balance = entry.income_amount - entry.subtotal;

    // 调用API添加条目
    try {
      await RequestAddEntry(entry);
      ElMessage.success(`成功导入条目 ${entry.id}`);
    } catch (error) {
      ElMessage.error(`导入条目 ${entry.id} 失败: ${error.message}`);
    }
  }

  fetchEntries(); // 刷新表格数据
};

// Excel日期转换（将Excel序列号转为YYYY-MM-DD）
const formatExcelDate = (excelDate) => {
  if (!excelDate) return '';
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
};

// 计算支出小计
const calculateSubtotal = (entry) => {
  return [
    entry.business_expense,
    entry.gasoline_expense,
    entry.alcohol_tobacco,
    entry.material_expense,
    entry.labor_expense,
    entry.tax_expense,
    entry.advance_expense,
    entry.other_expense
  ].reduce((sum, val) => sum + val, 0);
};

const store = useStore();
// 计算属性获取用户信息
const user = computed(() => store.state.user);

// 计算属性获取用户角色
const userRole = computed(() => user.value.role); // 获取用户角色
const name = computed(() => user.value.username);
const search = ref('');
const entries = ref([]); // 存储条目数据

const dialogFormVisibleUpdate = ref(false);
const dialogFormVisibleAdd = ref(false);
const form = ref({}); // 当前编辑的条目

const Message = ref(''); // 用于存储今天修改的内容
const adminName = ref(''); // 用于存储管理员的名字
// 计算属性，拼接最终消息
const modifiedContent = computed(() => {
    // 获取当前时间
    const currentTime = new Date().toLocaleString(); // 格式化为本地时间字符串
    return `${name.value}${currentTime}发的: ${Message.value}`; // 拼接字符串
});
const dialogFormVisiblek = ref(false); // 控制对话框的显示
// 打开对话框
const openDialog = () => {
    Message.value = ''; // 清空内容
    adminName.value = ''; // 清空管理员名字
    dialogFormVisiblek.value = true; // 显示对话框
};

// 处理发送消息的逻辑
const handleSendMessage = async () => {
    if (!Message.value) {
        ElMessage.warning('请先填写今天修改的内容'); // 提示用户填写内容
        return;
    }

    if (!adminName.value) {
        ElMessage.warning('请先输入管理员的名字'); // 提示用户输入管理员名字
        return;
    }

    try {
        // 根据管理员名字查找用户 ID
        const userId = await fetchUserIdByName(adminName.value);
        if (!userId) {
            ElMessage.warning('未找到该管理员'); // 提示用户未找到管理员
            return;
        }

        // 调用发送消息的 API
        await sendMessage(userId, modifiedContent.value); // 传递用户 ID 和消息内容
        ElMessage.success('内容已成功发送给管理员'); // 显示成功消息
        dialogFormVisiblek.value = false; // 关闭对话框
        Message.value = ''; // 清空内容
        adminName.value = ''; // 清空管理员名字
    } catch (error) {
        console.error('发送内容失败:', error);
        ElMessage.error('发送内容失败，请重试'); // 显示错误消息
    }
};
// 在组件挂载时获取数据
onMounted(() => {
    fetchEntries();
});

const filterTableData = computed(() => {
    const filteredData = entries.value.filter(
        (data) =>
            (!search.value || data.description.toLowerCase().includes(search.value.toLowerCase())) &&
            (incomeMin.value === null || (data.income_amount >= incomeMin.value && data.income_amount <= incomeMax.value)) &&
            (subtotalMin.value === null || (data.subtotal >= subtotalMin.value && data.subtotal <= subtotalMax.value)) &&
            (cashMin.value === null || (data.cash_balance >= cashMin.value && data.cash_balance <= cashMax.value))
    );
    return filteredData;
});

const resetFilters = () => {
    incomeMin.value = null;
    incomeMax.value = null;
    subtotalMin.value = null;
    subtotalMax.value = null;
    cashMin.value = null;
    cashMax.value = null;
};
const fetchEntries = async () => {
    try {
        const data = await RequestGetEntries(); // 调用获取条目表的请求函数
        entries.value = calculateSubtotals(data); // 将获取的数据赋值给 entries
        entries.value = calculateValues(entries.value);
        resetFilters(); // 重置输入框
    } catch (error) {
        console.error('获取条目失败:', error.message);
    }
};

// 编辑处理函数
const handleEdit = async (row) => {
    if (userRole.value === 'normal') {
        ElMessage.warning('您没有权限编辑条目');
        return;
    }
    // 记录日志
    const logData = {
        avatar: user.value.icon, // 假设用户信息中有 avatar 字段
        name: `${user.value.username}(编辑，未修改条目)`,
        oldValue: JSON.stringify(row), // 旧值为当前行数据
        newValue: JSON.stringify({ ...row, ...form.value }), // 新值为更新后的数据
        modifiedAt: formatDate(new Date().toISOString()),
        userId: user.value.id // 假设用户信息中有 id 字段
    };
    console.log(logData);
    await logChange(logData); // 记录日志


    form.value = { ...row }; // 复制当前行数据到 form
    dialogFormVisibleUpdate.value = true; // 显示对话框
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    // 获取日期和时间部分
    const datePart = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const timePart = date.toTimeString().split(' ')[0]; // HH:MM:SS
    return `${datePart} ${timePart}`; // 返回 YYYY-MM-DD HH:MM:SS 格式
};

//更新条目
const updateEntry = async () => {
    try {
        // 格式化日期
        form.value.entry_date = formatDate(form.value.entry_date);
        await RequestUpdateEntry(form.value.id, form.value); // 调用更新条目的 API
        const logData = {
            avatar: user.value.icon, // 假设用户信息中有 avatar 字段
            name: `${user.value.username}(已修改条目)`,
            oldValue: '', // 旧值为当前行数据
            newValue: '', // 新值为更新后的数据
            modifiedAt: formatDate(new Date().toISOString()),
            userId: user.value.id // 假设用户信息中有 id 字段
        };
        await logChange(logData); // 记录日志
        dialogFormVisibleUpdate.value = false; // 关闭对话框
        fetchEntries(); // 重新获取条目数据
        ElMessage.success(`更新${form.value.id}成功!！`);
    } catch (error) {
        console.error('更新条目失败:', error.message);
    }
};

const handleDelete = async (row) => {
    try {
        await RequestDeleteEntry(row.id); // 调用删除条目的 API
        fetchEntries(); // 重新获取条目数据
        const logData = {
            avatar: user.value.icon, // 假设用户信息中有 avatar 字段
            name: `${user.value.username}(已删除条目)`,
            oldValue: JSON.stringify(row), // 旧值为当前行数据
            newValue: JSON.stringify({ ...row, ...form.value }), // 新值为更新后的数据
            modifiedAt: formatDate(new Date().toISOString()),
            userId: user.value.id // 假设用户信息中有 id 字段
        };
        await logChange(logData); // 记录日志
        ElMessage.success(`删除${row.id}成功!`);
    } catch (error) {
        console.error('删除条目失败:', error.message);
    }
};

const addEntry = async () => {
    try {
        await RequestAddEntry(form.value); // 调用新增条目的 API
        const logData = {
            avatar: user.value.icon, // 假设用户信息中有 avatar 字段
            name: `${user.value.username}(已新增条目)`,
            oldValue: '', // 旧值为当前行数据
            newValue: '', // 新值为更新后的数据
            modifiedAt: formatDate(new Date().toISOString()),
            userId: user.value.id // 假设用户信息中有 id 字段
        };
        await logChange(logData); // 记录日志
        dialogFormVisibleAdd.value = false; // 关闭对话框
        fetchEntries(); // 重新获取条目数据
    } catch (error) {
        console.error('新增条目失败:', error.message);
    }
};

const searchKeyword = ref(''); // 存储搜索关键词
const startDate = ref(null); // 存储开始日期
const endDate = ref(null); // 存储结束日期
const incomeMin = ref(null);
const incomeMax = ref(null);
const subtotalMin = ref(null);
const subtotalMax = ref(null);
const cashMin = ref(null);
const cashMax = ref(null);

const searchEntries = async () => {
    if (searchKeyword.value.trim() === '' && !startDate.value && !endDate.value) {
        fetchEntries();
        return;
    }
    try {
        const results = await RequestSearchEntries(searchKeyword.value, startDate.value, endDate.value); // 调用搜索条目的 API
        entries.value = results; // 更新表格数据
    } catch (error) {
        console.error('搜索条目失败:', error.message);
    }
};
const visible = ref(false)

// 计算每一行的小计
const calculateSubtotals = (data) => {
    return data.map(item => {
        return {
            ...item,
            subtotal: [
                item.business_expense,
                item.gasoline_expense,
                item.alcohol_tobacco,
                item.material_expense,
                item.labor_expense,
                item.tax_expense,
                item.advance_expense,
                item.other_expense
            ].reduce((sum, expense) => sum + (Number(expense) || 0), 0) // 计算小计
        };
    });
};

const calculateValues = (data) => {
    return data.map(item => {
        const totalExpenses = [
            item.business_expense,
            item.gasoline_expense,
            item.alcohol_tobacco,
            item.material_expense,
            item.labor_expense,
            item.tax_expense,
            item.advance_expense,
            item.other_expense
        ].reduce((sum, expense) => sum + (Number(expense) || 0), 0); // 计算总支出

        return {
            ...item,
            subtotal: totalExpenses, // 计算小计
            cash_balance: Number(item.income_amount) - totalExpenses // 计算现金余额
        };
    });
};


</script>

<style lang="scss" scoped></style>