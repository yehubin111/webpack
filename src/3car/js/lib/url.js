// var baseurl = 'https://www.easy-mock.com/mock/5b8aa0396154f45c137d96af/3car'
var baseurl = '';

module.exports = {
    inventorycar: baseurl + '/car/manager/search',
    carpublic: baseurl + '/car/manager/save',
    brandlist: baseurl + '/carbrand/serial?lv=0', // 品牌
    factorylist: baseurl + '/carbrand/serial?lv=1&serialId={serialId}', // 厂商
    typelist: baseurl + '/carbrand/serial?lv=2&serialId={serialId}', // 车系
    serieslist: baseurl + '/carbrand/type?serialId={serialId}', // 车型
    provincelist: baseurl + '/area/list?parentId=-1', // 省份
    citylist: baseurl + '/area/list?parentId={parentId}', //城市
    customlist: baseurl + '/customer/search?', // 客户管理列表

}