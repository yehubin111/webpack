/**
 * Created by viruser on 2017/10/31.
 */
const sh = require('./greeter.js');
import Vue from 'vue'
import store from './vuex'
console.log(store);

new sh({
    type: 'ijjfund,ijjfifund,master,company,stock',
    searchId: '#root',
    successCallback: ''
});

function successCallback(data) {
    console.log(data);
}

console.log(store.state.b.name);
store.dispatch('addAge');
console.log(store.state.b.name);
store.dispatch('increment');
// store.commit('increment', {
//     fund: { id: '000090', text: '民生加银家盈理财月度债券Ba', type: '货币型' }
// });

const SetCounter = {
    template: `<a v-html="count"></a>`,
    computed: {
        count () {
            var ar = this.$store.getters.doneTodos('货币型');
            var str = '';
            ar.forEach(v => {
                str += v.text + '(' + v.id + ')<br/>';
            });
            return str;
        }
    }
};

const app = new Vue({
    el: '#app',
    store,
    components: { SetCounter },
    template: `<div class="app">
    <set-counter></set-counter>
    </div>`
});
