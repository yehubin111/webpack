/**
 * Created by viruser on 2017/11/14.
 */
import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex);

const moduleA = {
    state: {
        todos: [
            {id: '000001', text: '华夏成长混合', type: '混合型'},
            {id: '161725', text: '招商中证白酒', type: '股票型'},
            {id: '001233', text: '嘉合货币B', type: '货币型'},
            {id: '000010', text: '易方达天天理财货币B', type: '货币型'},
            {id: '200002', text: '长城久泰沪深300指数', type: '指数型'}
        ]
    },
    getters: {
        doneTodos: state => (type) => {
            return state.todos.filter(todo => todo.type == type);
        }
    },
    mutations: {
        increment (state, obj) {
            // setTimeout(function () {
            state.todos.push(obj.fund);
            // }, 1000);
        }
    },
    actions: {
        increment ({commit}) {
            commit('increment', {
                fund: {id: '000090', text: '民生加银家盈理财月度债券Ba', type: '货币型'}
            });
        }
    }
};

const moduleB = {
    state: {
        name: 'yehubin'
    },
    getters: {},
    mutations: {
        addAge (state, obj) {
            state.name += obj
        }
    },
    actions: {
        addAge ({state, commit, rootState}) {
            commit('addAge', rootState.age);
        }
    }
};

export default new Vuex.Store({
    state: {
        age: '180'
    },
    modules: {
        a: moduleA,
        b: moduleB
    }
});