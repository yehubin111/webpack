import '../css/public.less'
import URL from './lib/url'

$(function () {
    $('#topNav li').eq(1).addClass('on');

    $('#wxUpload').click(function () {
        $('#wxEwm').toggle();
    });

    function carPublic() {
        this.imgArr = imagelist ? imagelist.split(',') : [];
        this.init();
    }

    carPublic.prototype = {
        init: function init() {
            // 品牌下拉
            this.getBrand();
            // 城市下拉
            this.getProvince();
            // 下拉选择框
            this.downSelect();
            // 图片上传
            this.fileUpload();
            // 提交
            this.toSubmit();
        },
        getCity: function getCity(id, lang) {
            $(this).parents('.selectbox').next().find('.choice').text('请选择').css('color', '#999');
            $(this).parents('.selectbox').next().find('.subinfo').val('');

            var url = URL.citylist.replace('{parentId}', id);
            $.getJSON(url, function (res) {
                var r = res.data;
                var title = '';
                var str = '<dl><dt>城市</dt>';
                $.each(r, function (i, v) {
                    str += '<dd data-key="' + v.id + '" data-areacode="' + v.areaCode + '">' + v.areaName + '</dd>';
                });
                str += '</dl>';
                $(lang).show().html(str);
            });
        },
        getProvince: function getProvince() {
            $.getJSON(URL.provincelist, function (res) {
                var r = res.data;
                var title = '';
                var str = '<dl><dt>省份</dt>';
                $.each(r, function (i, v) {
                    str += '<dd data-key="' + v.id + '" data-areacode="' + v.areaCode + '">' + v.areaName + '</dd>';
                });
                str += '</dl>';
                $('.provincelist').html(str);
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
            $('.seriesselect .choice').text('请选择').css('color', '#999');
            $('.seriesselect .subinfo').val('');

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
        getSeries: function getSeries(id) {
            $('.seriesselect .choice').text('请选择').css('color', '#999');
            $('.seriesselect .subinfo').val('');

            var url = URL.serieslist.replace('{serialId}', id);
            $.getJSON(url, function (res) {
                var r = res.data;
                var title = '';
                var str = '';
                $.each(r, function (i, v) {
                    if (title != v.title) {
                        title = v.title;
                        str += '</dl><dl><dt>' + v.title + '</dt><dd data-key="' + v.id + '">' + v.subject + '</dd>';
                    } else {
                        str += '<dd data-key="' + v.id + '">' + v.subject + '</dd>';
                    }
                });
                str += '</dl>';
                $('#seriesList').show().html(str.replace('</dl>', ''));
            });
        },
        fileUpload: function fileUpload() {
            var self = this;
            $('#fileupload').fileupload({
                dataType: 'json',
                done: function done(e, data) {
                    console.log(data);
                    var str = '<li><img src="/file/view?fileName=' + data.result.img + '" alt=""></li>';
                    $('#uploadPic').append(str);
                    $('#uploadStatus').text('上传图片');
                    $('#fileupload').show();

                    self.imgArr.push(data.result.img);
                    if (self.imgArr.length == 16) {
                        $('.uploadmethod').hide();
                    }
                },
                progressall: function progressall(e, data) {
                    var loaded = data.loaded;
                    var total = data.total;
                    var proces = loaded / total * 100;

                    $('#uploadIng i').css('width', proces + '%');
                    $('#uploadStatus').text('上传中...');
                    $('#fileupload').hide();
                }
            });
        },
        downSelect: function downSelect() {
            var self = this;
            $('.selectbox').each(function () {
                var self = this;
                $(this).on('click', function () {
                    $(this).find('.downselect').toggle();
                });

                $(this).find('.downselect').on('click', 'li', function (e) {
                    e.stopPropagation();

                    var str = $(this).text();
                    $(this).parent().hide().prevAll('.choice').text(str).css('color', '#333');
                    $(this).parent().prevAll('.subinfo').val(str);
                });

                $(document).click(function (e) {
                    if (!$(self).is(e.target) && $(self).has(e.target).length == 0) {
                        $(self).find('.downselect').hide();
                    }
                });
            });
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
                $(this).parents('.citylist').hide().prevAll('.choice').text(str).css('color', '#333');
                $(this).parents('.citylist').prevAll('.subinfo').val(areacode);
            });
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
                // var areacode = $(this).data('key');
                var lang = $(this).parents('.provinceselect').data('lang');
                $(this).parents('.provincelist').hide().prevAll('.choice').text(str).css('color', '#333');
                // $(this).parents('.provincelist').prevAll('.subinfo').val(areacode);

                self.getCity.call(this, id, lang);
            });
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
                $(this).parents('.brandlist').hide().prevAll('.choice').text(str).css('color', '#333');
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
                $(this).parents('.typelist').hide().prevAll('.choice').text(str).css('color', '#333');
                $(this).parents('.typelist').prevAll('.subinfo').val(id);

                self.getSeries.call(self, id);
            });
            // 车型
            $('.seriesselect').each(function () {
                var self = this;
                $(this).off().click(function () {
                    $(this).find('.serieslist').toggle();
                });
                $(document).click(function (e) {
                    if (!$(self).is(e.target) && $(self).has(e.target).length == 0) {
                        $(self).find('.serieslist').hide();
                    }
                });
            });
            $('.seriesselect .serieslist').on('click', 'dd', function (e) {
                e.stopPropagation();

                var str = $(this).text();
                var id = $(this).data('key');
                $(this).parents('.serieslist').hide().prevAll('.choice').text(str).css('color', '#333');
                $(this).parents('.serieslist').prevAll('.subinfo').val(id);
            });
        },
        toSubmit: function toSubmit() {
            var self = this;
            $('#toPublic').click(function () {
                var postdata = decodeURIComponent($('#allInfo').serialize());
                // console.log(postdata);

                var arr = postdata.split('&');
                var datalist = {};
                /**
                 * 特殊情况 如 ccsj_year ccsj_month
                 * 先组合成ccsj: year|month
                 * 再做特殊处理
                 */
                $.each(arr, function (i, v) {
                    var dt = v.split('=');
                    var key = dt[0].indexOf('_') != -1 ? dt[0].split('_')[0] : dt[0];

                    if (datalist[key]) datalist[key] += dt[1] ? '|' + dt[1] : ''; else datalist[key] = dt[1];
                });
                for (var i in datalist) {
                    if (i == 'spsj' || i == 'ccsj' || i == 'njdqsj') datalist[i] = datalist[i] && datalist[i].indexOf('|') != -1 ? datalist[i].replace('|', '年') + '月' : '';
                }

                if (self.imgArr.length == 0) {
                    alert('请上传图片');
                    return;
                }
                var check = self.dataCheck.call(self, datalist);
                if (!check[0]) {
                    alert(check[1]);
                    return;
                }

                datalist['imgs'] = self.imgArr.join(',');
                if ($('#id').val()) datalist['id'] = $('#id').val();

                console.log(datalist);
                $.post(URL.carpublic, datalist, function (res) {
                    var r = eval('(' + res + ')');
                    if (r.code === 0) {
                        alert(r.msg);
                        location.href = '/car/manager/carinventory';
                    }
                });
            });
        },
        dataCheck: function dataCheck(obj) {
            if (!obj.vin) return [false, '请输入vin码'];
            if (!obj.brandId || !obj.typeId) return [false, '请选择品牌型号'];
            if (!obj.carType) return [false, '请选择车型'];
            if (!obj.mileage) return [false, '请输入里程'];
            if (!obj.spsj.replace('月', '').split('年')[0] || !obj.spsj.replace('月', '').split('年')[1]) return [false, '请选择初次上牌日期'];
            if (!obj.color) return [false, '请选择车身颜色'];
            if (!obj.auto) return [false, '请输入排量'];
            if (!obj.outType) return [false, '请选择排放标准'];
            if (!obj.ztPrice) return [false, '请输入展厅标价'];
            if (!obj.lmPrice) return [false, '请输入销售底价'];
            if (!obj.ccsj.replace('月', '').split('年')[0] || !obj.ccsj.replace('月', '').split('年')[1]) return [false, '请选择出厂日期'];

            return [true];
        }
    };

    new carPublic();
});