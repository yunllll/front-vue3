import requests from "./request"; // 确保导入 requests 函数
import { ElMessage } from 'element-plus';

// 生成随机邀请码的函数
const generateInviteCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$^*()';
    let inviteCode = '';
    for (let i = 0; i < 6; i++) {
        inviteCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return inviteCode;
};

// 存储邀请码的 API 调用
export const addInviteCode = async () => {
    const inviteCode = generateInviteCode(); // 生成邀请码
    try {
        await requests.post('/invite-codes', { code: inviteCode }); // 调用 API 存储邀请码
        ElMessage.success(`邀请码 ${inviteCode} 已成功生成并存储!`);
        return inviteCode; // 返回生成的邀请码
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 获取所有邀请码的 API 调用
export const fetchInviteCodes = async () => {
    try {
        const response = await requests.get('/invite-codes'); // 调用 API 获取邀请码
        return response; // 返回获取的数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 注册接口
export const RequestRegister = (user) => {
    return requests({
        url: `/register`, // 确保 URL 是正确的
        method: "post", // 使用 POST 方法
        data: { // 将用户对象作为请求体发送
            icon: user.icon,
            username: user.username,
            password: user.password,
            confirmPassword: user.confirmPassword,
            role: user.role,
            inviteCode:user.inviteCode,
            createDate: user.createDate // 这里可以设置为当前日期
        }
    });
};

// 登录接口
export const RequestLogin = (username, password) => {
    return requests({
        url: `/login`, // 确保 URL 是正确的
        method: "post", // 使用 POST 方法
        data: { // 将用户名和密码作为请求体发送
            username,
            password
        }
    });
};

// 请求重置密码链接接口
export const RequestPlease = async (email) => {
    try {
        const response = await requests({
            url: `/request-reset`, // 确保 URL 是正确的
            method: "post", // 使用 POST 方法
            data: { email } // 将电子邮件作为请求体发送
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 重置密码接口
export const RequestResetPassword = async (token, newPassword) => {
    try {
        const response = await requests({
            url: `/reset-password`, // 确保 URL 是正确的
            method: "post", // 使用 POST 方法
            data: { token, newPassword } // 将令牌和新密码作为请求体发送
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 获取条目表接口
export const RequestGetEntries = async () => {
    try {
        const response = await requests({
            url: `/entries`, // 确保 URL 是正确的
            method: "get", // 使用 GET 方法
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};
// 更新条目接口
export const RequestUpdateEntry = async (id, entryData) => {
    try {
        const response = await requests({
            url: `/entries/${id}`, // 使用条目的 ID 作为 URL 的一部分
            method: "put", // 使用 PUT 方法
            data: entryData, // 将更新的数据作为请求体发送
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 删除条目接口
export const RequestDeleteEntry = async (id) => {
    try {
        const response = await requests({
            url: `/entries/${id}`, // 使用条目的 ID 作为 URL 的一部分
            method: "delete", // 使用 DELETE 方法
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 增加条目接口
export const RequestAddEntry = async (entryData) => {
    try {
        const response = await requests({
            url: `/entries`, // 使用 POST 方法
            method: "post", // 使用 POST 方法
            data: entryData, // 将新增的数据作为请求体发送
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 搜索条目接口
export const RequestSearchEntries = async (keyword, startDate, endDate) => {
    try {
        // 构建查询参数
        const params = new URLSearchParams();
        if (keyword) {
            params.append('keyword', keyword); // 添加关键词
        }
        if (startDate) {
            params.append('startDate', startDate); // 添加开始日期
        }
        if (endDate) {
            params.append('endDate', endDate); // 添加结束日期
        }

        const response = await requests({
            url: `/entries/search?${params.toString()}`, // 使用查询参数传递关键词和日期
            method: "get", // 使用 GET 方法
        });
        return response; // 返回响应
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 获取用户列表的 API
export const getUsers = async () => {
    try {
        const response = await requests.get('/users'); // 使用 GET 方法调用获取用户列表的 API
        return response; // 返回响应数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};
// 更新用户角色的 API
export const updateUserRole = async (userId, role) => {
    try {
        const data = { role }; // 创建一个包含角色的对象
        const response = await requests.put(`/users/${userId}/role`, data); // 调用更新用户角色的 API
        return response; // 返回更新后的用户数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

// 上传头像的 API
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 将文件添加到 FormData

    try {
        const response = await requests.post('/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response; // 返回上传成功后的数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

//更新用户的头像URL
export const updateUserIcon = async (userId, newIconUrl) => {
    try {
        await requests.put(`/users/${userId}`, { icon: newIconUrl });
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message); // 抛出错误
    }
};

//删除用户
export const deleteUser = async (userId) => {
    try {
        await requests.delete(`/users/${userId}`); // 调用删除用户的 API
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const getDeletedUsers = async () => {
    try {
        const response = await requests.get('/deleted_users'); // 调用获取已删除用户的 API
        return response; // 返回已删除用户数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

//撤回删除用户
export const recoverUserApi = async (userId, inviteCode) => {
    try {
        await requests.put(`/users/recover/${userId}`, { inviteCode }); // 传递邀请码作为请求体
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 检查邀请码的 API 调用
export const checkInviteCode = async (inviteCode) => {
    try {
        const response = await requests.post('/check-invite-code', { inviteCode });
        return response; // 返回 API 响应数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 更新邀请码状态的 API 调用
export const markInviteCodeAsUsed = async (inviteCode) => {
    try {
        const response = await requests.put(`/invite-code/${inviteCode}`);
        return response; // 返回 API 响应数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 删除邀请码的 API 调用
export const deleteInviteCode = async (inviteCode) => {
    try {
        const response = await requests.delete(`/invite-code/${inviteCode}`); // 调用删除邀请码的 API
        return response; // 返回 API 响应数据
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 记录日志的函数
export const logChange = async (logData) => {
    try {
        const response = await requests.post('/change-logs', logData); // 调用记录日志的 API
        return response; // 返回 API 响应数据
    } catch (error) {
        console.error('记录日志失败:', error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 获取更改日志的函数
export const fetchChangeLogs = async () => {
    try {
        const response = await requests.get('/change-logs'); // 调用 API 获取更改日志
        return response; // 返回获取到的数据
    } catch (error) {
        console.error('获取更改日志失败:', error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 发送消息的函数
export const sendMessage = async (userId, message) => {
    try {
        const response = await requests.post('/user-messages', {
            userId,
            message,
        });
        return response; // 返回 API 响应数据
    } catch (error) {
        console.error('发送消息失败:', error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// 获取当前用户消息的函数
export const fetchMessages = async (userId) => {
    try {
        const response = await requests.get(`/messages?userId=${userId}`); // 使用查询参数传递用户 ID
        return response; // 返回获取到的数据
    } catch (error) {
        console.error('获取消息失败:', error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const fetchUserIdByName = async (name) => {
    try {
        const response = await requests.get(`/users?name=${name}`); // 假设你的 API 支持根据名字查询用户
        if (response && response.length > 0) {
            return response[0].id; // 返回找到的第一个用户的 ID
        }
        return null; // 如果未找到用户，返回 null
    } catch (error) {
        console.error('查找用户 ID 失败:', error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

