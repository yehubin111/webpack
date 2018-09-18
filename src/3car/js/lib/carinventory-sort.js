import URL from './url'
import PG from '../../../common/js/pageSwitch';

function inventoryCar() {
    this._data = {
        keyword: '',
        startyear: '',
        endyear: '',
        minprice: '',
        maxprice: '',
        mileage: '',
        color: '',
        brand: '',
        series: '',
        cartype: '',
        pageindex: 1
    };
    this.allBrand = [];
    this.pageswitch = null;
    this.url = URL.inventorycar;
    this.init();
}

inventoryCar.prototype = {
    init: function () {
        this.toSort();
        // 关键字搜索
        this.keyWordSearch();
        // 日期选择
        this.dateSelect();
        // 价格
        this.priceInput();
        // 里程
        this.mileageInput();
        // 颜色
        this.colorSelect();
        // 品牌
        this.brandSelect();
        // 车系
        this.seriesSelect();
        // 车型
        this.cartypeSelect();
        // 条件删除
        this.delCondition();
    },
    packCondition: function () {
        var data = this._data;
        var option = {
            spsjStartDt: '',
            spsjEndDt: '',
            ztPriceMin: '',
            ztPriceMax: '',
            mileage: '',
            color: '',
            keyword: '',
            // brand: '',
            // cartype: '',
            size: 20,
            brandId: '',
            typeId: '',
            seriesId: '',
            current: ''
        };

        console.log(data);
        // 上牌日期
        if (data['startyear'] && data['endyear']) {
            option.spsjStartDt = parseInt(data['startyear']) < parseInt(data['endyear']) ? data['startyear'] : data['endyear'];
            option.spsjEndDt = parseInt(data['startyear']) > parseInt(data['endyear']) ? data['startyear'] : data['endyear'];
        } else {
            option.spsjStartDt = data['startyear'];
            option.spsjEndDt = data['endyear'];
        }

        // 价格
        if (data['minprice'] && data['maxprice']) {
            option.ztPriceMin = parseInt(data['minprice']) < parseInt(data['maxprice']) ? data['minprice'] : data['maxprice'];
            option.ztPriceMax = parseInt(data['minprice']) > parseInt(data['maxprice']) ? data['minprice'] : data['maxprice'];
        } else {
            option.ztPriceMin = data['minprice'];
            option.ztPriceMax = data['maxprice'];
        }

        // 里程
        option.mileage = data['mileage'];

        // 颜色
        option.color = data['color'];

        // 关键字
        option.keyword = data['keyword'];

        // 品牌
        option.brandId = data['brand'];

        // 车系
        option.typeId = data['series'];

        // 车型
        option.seriesId = data['cartype'];

        // 页码
        option.current = data['pageindex'];

        return option;
    },
    delCondition: function () {
        var self = this;
        var timeout;
        $('#selectCondition').on('click', '.close', function () {
            var key = $(this).attr('closekey');

            switch (key) {
                case 'brand':
                case 'series':
                case 'cartype':
                    $('[closetype=' + key + '] li').removeClass('on').eq(0).addClass('on');
                    self._data[key] = '';
                    break;
                case 'date':
                case 'color':
                    $('[closetype=' + key + '] .info').html('不限').css('color', '#333');
                    self._data['startyear'] = '';
                    self._data['endyear'] = '';
                    break;
                case 'price':
                case 'mileage':
                    $('[closetype=' + key + '] input').val('');
                    self._data['minprice'] = '';
                    self._data['maxprice'] = '';
                    break;
            }

            if ($('#selectCondition').html() == '') {
                $('#resetCondition').hide()
            } else {
                $('#resetCondition').show()
            }

            clearTimeout(timeout);

            timeout = setTimeout(function () {
                self._data['pageindex'] = 1;
                self.toSort();
            }, 100);
            // if(!ifclear) {
            //     self.toSort();
            // }
        });
        $('#resetCondition').on('click', function () {
            $('#selectCondition .close').click();
        });
    },
    setConditionList: function (option) {
        var self = this;
        var str = '';
        for (var i in this._data) {
            if ((i == 'color' || i == 'brand' || i == 'series' || i == 'cartype') && self._data[i]) {
                str += '<li>' +
                    '<span class="cond">' + self._data[i] + '</span>' +
                    '<span class="close" closekey="' + i + '"></span></li>';
            }
        }

        if (option['spsjStartDt'] && option['spsjEndDt']) {
            str += '<li>' +
                '<span class="cond">' + option['spsjStartDt'] + '年-' + option['spsjEndDt'] + '年</span>' +
                '<span class="close" closekey="date"></span></li>';
        } else if (option['spsjStartDt']) {
            str += '<li>' +
                '<span class="cond">' + option['spsjStartDt'] + '年至今</span>' +
                '<span class="close" closekey="date"></span></li>';
        } else if (option['spsjEndDt']) {
            str += '<li>' +
                '<span class="cond">' + option['spsjEndDt'] + '年以前</span>' +
                '<span class="close" closekey="date"></span></li>';
        }

        if (option['ztPriceMin'] && option['ztPriceMax']) {
            str += '<li>' +
                '<span class="cond">' + option['ztPriceMin'] + '万-' + option['ztPriceMax'] + '万</span>' +
                '<span class="close" closekey="price"></span></li>';
        } else if (option['ztPriceMin']) {
            str += '<li>' +
                '<span class="cond">大于' + option['ztPriceMin'] + '万</span>' +
                '<span class="close" closekey="price"></span></li>';
        } else if (option['ztPriceMax']) {
            str += '<li>' +
                '<span class="cond">小于' + option['ztPriceMax'] + '万</span>' +
                '<span class="close" closekey="price"></span></li>';
        }

        if (option['mileage']) {
            str += '<li>' +
                '<span class="cond">' + option['mileage'] + '万公里</span>' +
                '<span class="close" closekey="mileage"></span></li>';
        }

        $('#selectCondition').html(str);
        if (str == '') {
            $('#resetCondition').hide()
        } else {
            $('#resetCondition').show()
        }
    },
    setPageswitch: function (total) {
        var self = this;
        if (this.pageswitch) {
            this.pageswitch.setPageTotal(Math.ceil(total / 20), total);
        } else {
            this.pageswitch = new PG.pageSwitch('#carSwitch', {
                ifInput: true,
                dataTotal: total,
                pageTotal: Math.ceil(total / 20),
                prevCallback: function (page) {
                    self._data['pageindex'] = page;
                    self.toSort();
                },
                nextCallback: function (page) {
                    self._data['pageindex'] = page;
                    self.toSort();
                },
                clickCallback: function (page) {
                    self._data['pageindex'] = page;
                    self.toSort();
                }
            });
        }
    },
    toSort: function () {
        // 条件组合
        var self = this;
        var option = this.packCondition();

        // 设置已选条件
        this.setConditionList(option);
        console.log(option);

        var str = '';
        for (var i in option) {
            str += '&' + i + '=' + option[i]
        }

        var url = this.url + '?' + str.substr(1);

        $.getJSON(url, function (res) {
            console.log(res);
            if (res.code == 0) {
                self.groupHTML.call(self, res.data);

                self.setPageswitch.call(self, res.total);
            }
        })
    },
    groupHTML(r) {
        // console.log(r);
        var dtar = {
            list: r
        }

        var html = Mustache.render(carHTML, dtar);
        // console.log(html);
        $('#carAll').html(html);
    },
    cartypeSelect: function () {
        var self = this;
        $('#cartypeSelect').on('click', 'li', function () {
            $('#cartypeSelect li').removeClass('on');

            $(this).addClass('on');

            var cartype = $(this).text();
            self._data['cartype'] = cartype == '不限' ? '' : cartype;

            self._data['pageindex'] = 1;
            self.toSort();
        });
    },
    getBrand: function () {
        var self = this;
        $.getJSON(URL.brandlist, function (res) {
            var r = res.data;

            self.allBrand = r;

            var str = '<li class="brand on">不限</li>';
            $.each(r, function (i, v) {
                str += '<li class="brand" data-key="' + v.id + '">' + v.title + '</li>';

                if (i == 49)
                    return false;
            })
            if (self.allBrand.length > 50)
                str += '<li class="more">展开其他</li>'

            $('#brandSelect').html(str);
        })
    },
    getType: function (id) {
        var url = URL.factorylist.replace('{serialId}', id);
        $('#seriesSelect').html('');

        var str = '<li class="on">不限</li>';
        $('#seriesSelect').append(str);

        if (!id) {
            return;
        }
        $.getJSON(url, function (res) {
            var r = res.data;
            $.each(r, function (i, v) {
                var id = v.id;
                var typeurl = URL.typelist.replace('{serialId}', id);
                $.getJSON(typeurl, function (data) {
                    var tsstr = '';
                    var g = data.data;
                    $.each(g, function (n, m) {
                        tsstr += '<li data-key="' + m.id + '">' + m.title + '</li>';
                    })

                    $('#seriesSelect').append(tsstr);
                })
            })
        })
    },
    brandSelect: function () {
        var self = this;
        // 获取品牌列表
        this.getBrand();

        $('#brandSelect').on('click', 'li.brand', function () {
            $('#brandSelect li').removeClass('on');
            var id = $(this).data('key');
            // 获取车系
            self.getType.call(self, id);

            $(this).addClass('on');

            var brand = $(this).text();
            self._data['brand'] = brand == '不限' ? '' : brand;
            self._data['series'] = '';

            self._data['pageindex'] = 1;
            self.toSort();
        });
        $('#brandSelect').on('click', 'li.more', function () {
            if ($(this).text() == '展开其他') {
                var onindex = $('#brandSelect .on').index();
                var str = '<li class="brand">不限</li>';
                $.each(self.allBrand, function (i, v) {
                    str += '<li class="brand" data-key="' + v.id + '">' + v.title + '</li>';
                })
                str += '<li class="more">收起其他</li>'

                $('#brandSelect').html(str).find('li').eq(onindex).addClass('on');
            } else {
                var onindex = $('#brandSelect .on').index();
                var str = '<li class="brand">不限</li>';
                $.each(self.allBrand, function (i, v) {
                    str += '<li class="brand" data-key="' + v.id + '">' + v.title + '</li>';
                    if (i == 49)
                        return false;
                })
                str += '<li class="more">展开其他</li>'

                $('#brandSelect').html(str).find('li').eq(onindex > 49 ? 0 : onindex).addClass('on');
                if (onindex > 49) {
                    self._data['brand'] = '';
                    self._data['series'] = '';
                    $('#seriesSelect').html('<li class="on">不限</li>');
                    self.toSort();
                }
            }
        });
    },
    seriesSelect: function () {
        var self = this;
        $('#seriesSelect').on('click', 'li', function () {
            $('#seriesSelect li').removeClass('on');

            $(this).addClass('on');

            var series = $(this).text();
            self._data['series'] = series == '不限' ? '' : series;

            self._data['pageindex'] = 1;
            self.toSort();
        });
    },
    colorSelect: function () {
        let self = this;
        $('.colorselect').each(function () {
            var that = this;
            $(this).find('.info').click(function () {
                $(that).find('.colordown').toggle();
            })

            $(document).click(function (e) {
                if (!$(that).find('.info').is(e.target) && !$(that).find('.colordown').is(e.target) && $(that).find('.yeardown').has(e.target).length == 0) {
                    $(that).find('.colordown').hide();
                }
            });
        })

        $('.colorselect').find('.colordown p').click(function () {
            var str = $(this).text();

            $(this).parents('.colorselect').find('.info').text(str).css('color', '#333');
            $(this).parent().hide();
            var key = 'color';

            self._data[key] = str == '不限' ? '' : str;

            self._data['pageindex'] = 1;
            self.toSort();
        })
    },
    mileageInput: function () {
        var self = this;
        $('#mileageSort').click(function () {
            self._data['mileage'] = isNaN(parseInt($('#mileageInput').val())) ? '' : parseInt($('#mileageInput').val());

            self._data['pageindex'] = 1;
            self.toSort();
        });
    },
    priceInput: function () {
        var self = this;
        $('#priceSort').click(function () {
            self._data['minprice'] = isNaN(parseInt($('#minPrice').val())) ? '' : parseInt($('#minPrice').val());
            self._data['maxprice'] = isNaN(parseInt($('#maxPrice').val())) ? '' : parseInt($('#maxPrice').val());

            self._data['pageindex'] = 1;
            self.toSort();
        });
    },
    dateSelect: function () {
        let self = this;
        $('.dateselect').each(function () {
            var that = this;
            $(this).find('.info').click(function () {
                $(that).find('.yeardown').toggle();
            })

            $(document).click(function (e) {
                if (!$(that).find('.info').is(e.target) && !$(that).find('.yeardown').is(e.target) && $(that).find('.yeardown').has(e.target).length == 0) {
                    $(that).find('.yeardown').hide();
                }
            });
        })

        $('.dateselect').find('.yeardown p').click(function () {
            var str = $(this).text();

            $(this).parents('.dateselect').find('.info').text(str).css('color', '#333');
            $(this).parent().hide();
            var key = $(this).parents('.dateselect').data('key');

            self._data[key] = str == '不限' ? '' : str;

            self._data['pageindex'] = 1;
            self.toSort();
        })
    },
    keyWordSearch: function () {
        var self = this;
        $('#keyWordSearch').click(function () {
            self._data['keyword'] = $('#keyWord').val();

            self._data['pageindex'] = 1;
            self.toSort();
        });
    }
}

module.exports = inventoryCar;