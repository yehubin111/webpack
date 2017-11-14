/**
 * Created by viruser on 2017/10/31.
 */
const sh = require('./greeter.js');
import Vue from 'vue'
import store from './vuex.js'

new sh({
    type: 'ijjfund,ijjfifund,master,company,stock',
    searchId: '#root',
    successCallback: ''
});

// store.commit('increment');

function successCallback(data) {
    console.log(data);
}

const SetCounter = {
    template: `<div>{{ count }}</div>`,
    computed: {
        count () {
            return this.$store.state.count
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
