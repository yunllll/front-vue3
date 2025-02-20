import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: {
            id:'',
            icon: '',
            username: '',
            role: ''
        },
    },
    mutations: {
        setUser(state, user) {
            state.user = user; // 更新用户信息
        },
        clearUser(state) {
            state.user = { id:'', icon: '', username: '', role: '' }; // 清空用户信息
        },
        updateUserIcon(state, newIconUrl) {
            state.user.icon = newIconUrl; // 更新用户的 icon 属性
        },
    },
    actions: {
        login({ commit }, user) {
            commit('setUser', user); // 提交用户信息
        },
        logout({ commit }) {
            commit('clearUser'); // 清空用户信息
        },
        updateIcon({ commit }, newIconUrl) {
            commit('updateUserIcon', newIconUrl); // 更新用户头像
        },
    },
});

export default store;
