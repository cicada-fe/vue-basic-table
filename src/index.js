import BasicTable from './main.vue';

BasicTable.install = function (Vue, opts = {}) {
    Vue.component(BasicTable.name, BasicTable);

    if (!opts.net) {
        opts.net = require('./util/net.js').Net;
        opts.net.init();
    }
    Vue.prototype.$net = opts.net;
};

export default BasicTable;
