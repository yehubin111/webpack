import '../css/customer.less'
import URL from './lib/url'


$(function () {
    $('#topNav li').eq(2).addClass('on');

    function customerList() {
        this._data = {
            province: '',
            city: '',
            brandId: '',
            typeId: '',
            phone: '',
            startDate: '',
            endDate: '',
            followStartDate: '',
            followEndDate: '',
            from: '',
            level: ''
        }
        this.init();
    }
    customerList.prototype = {
        init: function () {
            // 获取列表
            this.getCustomer();
            // 省份城市
            this.getProvince();
            // 下拉
            this.downSelect();
            // 品牌
            this.getBrand();
            // 查找
            this.toSearch();
        },
        toSearch: function () {
            var self = this;
            $('#toPublic').click(function () {
                var postdata = decodeURIComponent($('#allInfo').serialize());
                console.log(postdata);

                // var arr = postdata.split('&');
                // var datalist = {};

            });
        },
        downSelect: function () {
            var self = this;
            // 城市
            $('.cityselect').each(function () {
                var self = this;
                $(this).off().click(function () {
                    $(this).find('.citylist').toggle();
                });
                $(document).click(function (e) {
                    if (!$(self).is(e.target) && $(self).has(e.target).length == 0) {
                        $(self).find('.citylist').hide();
                    }
                });
            });
            $('.cityselect .citylist').on('click', 'dd', function (e) {
                e.stopPropagation();

                var str = $(this).text();
                var id = $(this).data('key');
                var areacode = $(this).data('areacode');
                $(this).parents('.citylist').hide().prevAll('.info').text(str).css('color', '#333');
                $(this).parents('.citylist').prevAll('.subinfo').val(areacode);
            })
            // 省份
            $('.provinceselect').each(function () {
                var self = this;
                $(this).off().click(function () {
                    $(this).find('.provincelist').toggle();
                });
                $(document).click(function (e) {
                    if (!$(self).is(e.target) && $(self).has(e.target).length == 0) {
                        $(self).find('.provincelist').hide();
                    }
                });
            });
            $('.provinceselect .provincelist').on('click', 'dd', function (e) {
                e.stopPropagation();

                var str = $(this).text();
                var id = $(this).data('key');
                var areacode = $(this).data('key');
                var lang = $(this).parents('.provinceselect').data('lang');
                $(this).parents('.provincelist').hide().prevAll('.info').text(str).css('color', '#333');
                $(this).parents('.provincelist').prevAll('.subinfo').val(areacode);

                self.getCity.call(this, id, lang);
            })
            // 品牌型号选择
            $('.brandselect').each(function () {
                var self = this;
                $(this).off().click(function () {
                    $(this).find('.brandlist').toggle();
                });
                $(document).click(function (e) {
                    if (!$(self).is(e.target) && $(self).has(e.target).length == 0) {
                        $(self).find('.brandlist').hide();
                    }
                });
            });
            $('.brandselect .brandlist').on('click', 'dd', function (e) {
                e.stopPropagation();

                var str = $(this).text();
                var id = $(this).data('key');
                $(this).parents('.brandlist').hide().prevAll('.info').text(str).css('color', '#333');
                $(this).parents('.brandlist').prevAll('.subinfo').val(id);

                self.getType.call(self, id);
            });
            // 车系
            $('.typeselect').each(function () {
                var self = this;
                $(this).off().click(function () {
                    $(this).find('.typelist').toggle();
                });
                $(document).click(function (e) {
                    if (!$(self).is(e.target) && $(self).has(e.target).length == 0) {
                        $(self).find('.typelist').hide();
                    }
                });
            });
            $('.typeselect .typelist').on('click', 'dd', function (e) {
                e.stopPropagation();

                var str = $(this).text();
                var id = $(this).data('key');
                $(this).parents('.typelist').hide().prevAll('.info').text(str).css('color', '#333');
                $(this).parents('.typelist').prevAll('.subinfo').val(id);
            });
        },
        getBrand: function getBrand() {
            $.getJSON(URL.brandlist, function (res) {
                var r = res.data;
                var str = '';
                var ostr = '';
                var letter = '';
                $.each(r, function (i, v) {
                    if (v.letter == 'A' || v.letter == 'B' || v.letter == 'C' || v.letter == 'D' || v.letter == 'F' || v.letter == 'G' || v.letter == 'H' || v.letter == 'J' || v.letter == 'K' || v.letter == 'L') {
                        if (letter != v.letter) {
                            str += '</dl><dl><dt>' + v.letter + '</dt><dd data-key="' + v.id + '">' + v.title + '</dd>';
                            letter = v.letter;
                        } else {
                            str += '<dd data-key="' + v.id + '">' + v.title + '</dd>';
                        }
                    } else {
                        if (letter != v.letter) {
                            ostr += '</dl><dl><dt>' + v.letter + '</dt><dd data-key="' + v.id + '">' + v.title + '</dd>';
                            letter = v.letter;
                        } else {
                            ostr += '<dd data-key="' + v.id + '">' + v.title + '</dd>';
                        }
                    }
                });
                str += '</dl>';
                ostr += '</dl>';
                $('#brandList .listleft').eq(0).html(str.replace('</dl>', ''));
                $('#brandList .listleft').eq(1).html(ostr.replace('</dl>', ''));
            });
        },
        getType: function getType(id) {
            $('#typeList').html('');
            $('.typeselect .choice').text('请选择').css('color', '#999');
            $('.typeselect .subinfo').val('');

            var url = URL.factorylist.replace('{serialId}', id);
            $.getJSON(url, function (res) {
                var r = res.data;
                $.each(r, function (i, v) {
                    var id = v.id;
                    var typeurl = URL.typelist.replace('{serialId}', id);
                    $.getJSON(typeurl, function (data) {
                        var str = '<dl><dt>' + v.title + '</dt>';
                        var g = data.data;
                        $.each(g, function (n, m) {
                            str += '<dd data-key="' + m.id + '">' + m.title + '</dd>';
                        });
                        str += '</dl>';

                        $('#typeList').show().append(str);
                    });
                });
            });
        },
        getProvince: function () {
            $.getJSON(URL.provincelist, function (res) {
                var r = res.data;
                var title = '';
                var str = '<dl><dt>省份</dt>';
                $.each(r, function (i, v) {
                    str += '<dd data-key="' + v.id + '" data-areacode="' + v.areaCode + '">' + v.areaName + '</dd>'
                })
                str += '</dl>';
                $('.provincelist').html(str);
            })
        },
        getCity: function (id, lang) {
            $(this).parents('.selectline').next().find('.info').text('请选择').css('color', '#999');
            $(this).parents('.selectline').next().find('.subinfo').val('');

            var url = URL.citylist.replace('{parentId}', id);
            $.getJSON(url, function (res) {
                var r = res.data;
                var title = '';
                var str = '<dl><dt>城市</dt>';
                $.each(r, function (i, v) {
                    str += '<dd data-key="' + v.id + '" data-areacode="' + v.areaCode + '">' + v.areaName + '</dd>'
                })
                str += '</dl>';
                $(lang).show().html(str);
            })
        },
        getCustomer: function () {
            var url = URL.customlist;
            var str = '';
            for (var i in this._data) {
                if (this._data[i]) {
                    str += '&' + i + '=' + this._data[i];
                }
            }
            url += str.substr(1);

            $.getJSON(url, function (data) {
                if (data.code == 0) {
                    var dtar = {
                        list: data.data
                    }

                    var html = Mustache.render(carHTML, dtar);
                    // console.log(html);
                    $('#customAll').html(html);
                }
            })
        }
    }

    new customerList();
})