/**
 * Created by 2016101901 on 2017/6/8.
 */
//分页
(function (root, factor) {
    if (typeof define === 'function' && define.amd) {
        define(factor);
    } else if (typeof exports === 'object') {
        module.exports = factor();
    } else {
        root.searchFunc = factor();
    }
})(this, function () {
    var pg = (function () {
        function pageSwitch(obj, options) {
            var defaults = {
                    ifSkip: false, //是否跳转切换，默认false
                    nowPage: 1, //如果ifSkip为true,需传入当前页码
                    nowType: 0,
                    ifInput: false, //是否添加输入页码点击跳转功能
                    key: '',  // 如果一个页面多次调用
                    sClass: 'hxPageswitch',
                    sId: 'hxPageswitch',
                    pageTotal: 10, //总页码数
                    dataTotal: '', //总数据
                    ifTotal: true, //是否显示总数据
                    onClass: 'swidthOn',
                    prevCallback: null,  // 上一页
                    nextCallback: null,  // 下一页
                    clickCallback: null  // 点击页码 点击页码跳转
                },
                $obj = $(obj),
                dispage,  // 变化之前的页码
                opt,
                numbertest = /^\d+$/;

            this.init = function (options) {
                opt = $.extend({}, defaults, options);
                opt.sId += opt.key;
                //如果跳转切换
                if (opt.ifSkip) {
                    if (opt.nowPage != 1) {
                        if (opt.pageTotal > 10) {
                            opt.nowType = 2;
                            if (opt.nowPage < 6) {
                                opt.nowType = 1;
                            } else if (opt.nowPage > opt.pageTotal - 6) {
                                opt.nowType = 3;
                            }
                        } else {
                            opt.nowType = 0;
                        }
                    }
                }
                choiceSwitch(opt.nowType, opt.nowPage);

                //绑定点击功能
                setFunc(opt);
            };

            //添加分页符
            var hxaddSwitch = function (ops, ptp, cpg) {
                dispage = cpg;
                var str = '';
                str += '<div class="' + ops.sClass + '" id="' + ops.sId + '"><div class="hxSwitchbox">';
                str += ops.ifTotal && ops.dataTotal != '' ? '<p class="dataTotal">共<span>' + ops.dataTotal + '</span>条记录</p>' : '';
                str += '<ul>';
                str += cpg === 1 ? '<li class="prevpage noclick">\u4e0a\u4e00\u9875</li>' : '<li class="prevpage">\u4e0a\u4e00\u9875</li>';
                switch (ptp) {
                    case 0:
                        if (cpg == 1) {
                            str += '<li class="' + ops.onClass + '" data-ptp = "0">1</li>';
                        } else {
                            str += '<li data-ptp = "0">1</li>';
                        }

                        for (var i = 1; i < ops.pageTotal; i++) {
                            var p = i + 1;
                            if (ops.pageTotal > 6) {
                                if (p == 6) {
                                    str += '<li class="notype">...</li>';
                                    i = ops.pageTotal - 2;
                                } else if (p > ops.pageTotal - 4) {
                                    str += '<li data-ptp = "3">' + p + '</li>';
                                } else if (p < 5) {
                                    str += '<li data-ptp = "1">' + p + '</li>';
                                } else {
                                    str += '<li data-ptp = "2">' + p + '</li>';
                                }
                            } else {
                                if (cpg == p) {
                                    str += '<li class="' + ops.onClass + '" data-ptp = "0">' + p + '</li>';
                                } else {
                                    str += '<li data-ptp = "0">' + p + '</li>';
                                }
                            }
                        }
                        break;
                    case 1:
                        for (var n = 0; n < ops.pageTotal; n++) {
                            var q = n + 1;
                            if (q == 6) {
                                str += '<li class="notype">...</li>';
                                n = ops.pageTotal - 2;
                            } else if (q > ops.pageTotal - 4) {
                                str += '<li data-ptp = "3">' + q + '</li>';
                            } else if (q < 5) {
                                if (q == cpg) {
                                    str += '<li data-ptp = "1" class="' + ops.onClass + '">' + q + '</li>';
                                } else {
                                    str += '<li data-ptp = "1">' + q + '</li>';
                                }
                            } else {
                                str += '<li data-ptp = "2">' + q + '</li>';
                            }
                        }
                        break;
                    case 2:
                        str += '<li data-ptp = "1">1</li>';
                        str += '<li class="notype">...</li>';
                        for (var m = cpg - 2; m < cpg + 3; m++) {
                            if (m < 5) {
                                str += '<li data-ptp = "1">' + m + '</li>';
                            } else if (m > ops.pageTotal - 4) {
                                str += '<li data-ptp = "3">' + m + '</li>';
                            } else {
                                if (m == cpg) {
                                    str += '<li data-ptp = "2" class="' + ops.onClass + '">' + m + '</li>';
                                } else {
                                    str += '<li data-ptp = "2">' + m + '</li>';
                                }
                            }
                        }
                        str += '<li class="notype">...</li>';
                        str += '<li data-ptp = "3">' + ops.pageTotal + '</li>';
                        break;
                    case 3:
                        str += '<li data-ptp = "1">1</li>';
                        str += '<li class="notype">...</li>';
                        var lastpage = ops.pageTotal - 4;
                        while (lastpage < parseInt(ops.pageTotal) + 1) {
                            if (lastpage > ops.pageTotal - 4) {
                                if (lastpage == cpg) {
                                    str += '<li data-ptp = "3" class="' + ops.onClass + '">' + lastpage + '</li>';
                                } else {
                                    str += '<li data-ptp = "3">' + lastpage + '</li>';
                                }
                            } else if (lastpage < 5) {
                                str += '<li data-ptp = "1">' + lastpage + '</li>';
                            } else {
                                str += '<li data-ptp = "2">' + lastpage + '</li>';
                            }
                            lastpage++;
                        }
                        break;
                    default:
                        alert('error');
                        break;
                }
                str += cpg === parseInt(ops.pageTotal) ? '<li class="nextpage noclick">\u4e0b\u4e00\u9875</li>' : '<li class="nextpage">\u4e0b\u4e00\u9875</li>';
                str += '</ul>';
                str += '<div class="switchpageall">';
                str += '<span>' + cpg + '/' + ops.pageTotal + '</span>';
                if (ops.ifInput) {
                    str += '<span>\u8f6c\u5230</span> <input class="customPage" id="customPage' + opt.key + '" type="text" value="">';
                    str += ' <a class="gotoPage" id="gotoPage' + opt.key + '">\u786e\u5b9a</a>';
                }
                str += '</div></div></div>';
                $obj.html(str);
            };
            //设置功能
            function setFunc(ops) {
                $obj.on('click', 'li:not(.notype)', function () {
                    hxPagechange.call($(this), ops);
                });
                $obj.on('click', '.prevpage', function () {
                    hxPrevpage(ops);
                });
                $obj.on('click', '.nextpage', function () {
                    hxNextpage(ops)
                });
                //自定义页码
                $obj.on({
                    'input propertychange': function () {
                        var itscon = $(this).val();
                        if (!numbertest.test(itscon)) {
                            $(this).val(itscon.substring(0, itscon.length - 1));
                        }
                    }
                }, '#customPage' + opt.key);
                $obj.on({
                    'click': function () {
                        var itscon = $.trim($('#customPage' + opt.key).val());
                        var pts = 0;
                        if (itscon == '') {
                            alert('\u8bf7\u8f93\u5165\u9875\u7801');
                            return;
                        }
                        itscon = parseInt(itscon);
                        if (itscon > ops.pageTotal || itscon < 1 || isNaN(itscon)) {
                            alert('\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u9875\u7801');
                            return;
                        }
                        // 如果输入的页面等于当前的页码
                        if(itscon == dispage) return;

                        if (ops.pageTotal > 6) {
                            if (itscon > ops.pageTotal - 4) {
                                pts = 3;
                            } else if (itscon < 5) {
                                pts = 1;
                            } else {
                                pts = 2;
                            }
                        } else {
                            $('#' + ops.sId + ' li').removeClass(ops.onClass).eq(itscon).addClass(ops.onClass);
                            pts = 0;
                        }

                        choiceSwitch(pts, itscon);
                        //回调函数
                        if ($.type(ops.clickCallback) === 'function') {
                            ops.clickCallback(itscon);
                        }
                    }
                }, '#gotoPage' + opt.key);
            }

            //上一页
            function hxPrevpage(ops) {
                var ithtml = $('#' + ops.sId + ' .' + ops.onClass).html();
                var itptp = $('#' + ops.sId + ' .' + ops.onClass).prev().attr('data-ptp');
                var iidex = $('#' + ops.sId + ' .' + ops.onClass).prev().index();
                if (ithtml == 1) return;
                var currpage = parseInt(ithtml) - 1;
                var ptps = parseInt(itptp);

                if (ptps || ptps == '0') {
                    choiceSwitch(ptps, currpage);
                } else {
                    $('#' + ops.sId + ' li').removeClass(ops.onClass).eq(iidex).addClass(ops.onClass);
                }
                //回调函数
                if ($.type(ops.prevCallback) === 'function') {
                    ops.prevCallback(currpage);
                }
            }

            //下一页
            function hxNextpage(ops) {
                var ithtml = $('#' + ops.sId + ' .' + ops.onClass).html();
                var itptp = $('#' + ops.sId + ' .' + ops.onClass).next().attr('data-ptp');
                var iidex = $('#' + ops.sId + ' .' + ops.onClass).next().index();
                if (ithtml == ops.pageTotal) return;
                var currpage = parseInt(ithtml) + 1;
                var ptps = parseInt(itptp);

                if (ptps || ptps == '0') {
                    choiceSwitch(ptps, currpage);
                } else {
                    $('#' + ops.sId + ' li').removeClass(ops.onClass).eq(iidex).addClass(ops.onClass);
                }
                //回调函数
                if ($.type(ops.nextCallback) === 'function') {
                    ops.nextCallback(currpage);
                }
            }

            //页码点击
            function hxPagechange(ops) {
                if ($(this).attr('class') === undefined || $(this).attr('class') === '') {
                    $('#' + ops.sId + ' li').removeClass(ops.onClass);
                    $(this).addClass(ops.onClass);
                    var currpage = parseInt($(this).html());
                    var ptps = parseInt($(this).attr('data-ptp'));
                    if (ptps || ptps == '0') {
                        choiceSwitch(ptps, currpage);
                    }
                    //回调函数
                    if ($.type(ops.clickCallback) === 'function') {
                        ops.clickCallback(currpage);
                    }
                }
            }

            //三种形式切换
            function choiceSwitch(ptp, currpage) {
                var pts = ptp;
                if (ptp === 0) {
                    pts = 0;
                }

                hxaddSwitch(opt, pts, currpage);
            }

            this.init(options);

            this.choiceSwitch = choiceSwitch;
            this.setFunc = setFunc;
            this.opt = opt;
        }

        pageSwitch.prototype = {
            /**
             * 2017/10/18 新增功能 同一个地方更新页码和总条数，初始化插件
             */
            setPageTotal: function (page, dtotal) {
                var self = this;

                self.opt.pageTotal = page;
                self.opt.dataTotal = dtotal;
                self.choiceSwitch(self.opt.nowType, self.opt.nowPage);
            }
        };

        return {
            pageSwitch: pageSwitch
        };
    })();

    return pg;
});