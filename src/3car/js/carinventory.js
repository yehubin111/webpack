import '../css/carinventory.less'

import inventorySort from './lib/carinventory-sort'

$(function(){
    $('#topNav li').eq(1).addClass('on');
    // 筛选排序
    new inventorySort();
})