/**
 * Created by viruser on 2017/12/14.
 */
import '../../common/less/common.less';
import '../../common/less/footer.less';
import '../css/lastyear.less'

$(function () {
    function newYearAward(fund) {
        this._data = {
            fundcode: [],
            fundname: [],
            flist: {},
            dt: {
                custid: '',
                encryptcustid: ''
                // activityId: '20171218'
            },
            custid: '',
            encryptcustid: '',
            login: '/login/loginInit.action?referrer=', //登录
            buy: '/trade/trade_otherTradeInit.action?fundCode={code}&tradeType=buy&amount=50000&frm=head',  //购买
            infoUrl: 'public/Activity/subsidyDecember1_rest.txt',
            getCan: 'interface/Activitynew/subsidyDecember',  // 领取奖励资格
            ifGet: 'interface/Activitynew/subsidyDecember',  // 是否领取奖励资格
            commonUrl: '/php/fexcactive/pc/crossApi.php',
            nomyUrl: '/php/fexcactive/pc/crossFile.php'  //无秘钥
        };

        this.init(fund);
    }

    newYearAward.prototype = {
        init: function (fund) {
            var self = this;

            this.initFund(fund);
            // 学习理财知识
            this.learnBox();

            // 获取收益信息，剩余额度
            this.getInfo(function () {
                self.statsJudge();
            });

            // 查看奖励判断
            this.awardJudge();

            // 埋点
            TA.log({id: 'fund_mkt_20171215_ndcxl', fid: 'fund_act,info_gather,ch_fund'});
            setTimeout(function () {
                TA.log({id: 'ad_jijin_2017121802', fid: 'fund_act,info_gather,ch_fund'});
            }, 1000);
        },
        learnBox: function () {
            $('#learnLine').click(function () {
                $("#ticket").show();
                $('#shadow').show();

                TA.log({id: 'fund_mkt_20171215_tk'});
            });
            $("#ticket").click(function () {
                $('#ticket').hide();
                $('#shadow').hide();
                // 埋点
                TA.log({id: 'fund_mkt_20171215_ndcxl.tk'});
            });
        },
        initFund: function (fund) {
            var self = this;

            var str = '';
            $.each(fund, function (i, v) {
                self._data.fundname.push(v.fundname);
                self._data.fundcode.push(v.fundcode);
                self._data.flist[v.fundcode] = v.fundname;

                str += '<div class="buybox">'
                    + '<a href="//fund.10jqka.com.cn/' + v.fundcode + '/" target="_blank" class="b-name">' + v.fundname + '</a>'
                    + '<div class="b-tag">'
                    + '<div class="obox">'
                    + '<div class="box">'
                    + '<p class="bt">活期理财</p>';

                if(v.fundcode == '001077')
                    str += '<p class="bt">低风险</p>';
                else
                    str += '<p class="bt">赎回实时到账</p>';

                str += '</div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="b-info">'
                    + '<div class="left">'
                    + '<p class="percent"><span>--</span></p>'
                    + '<p class="unit">近7日年化收益</p>'
                    + '</div>'
                    + '<div class="right">'
                    + '<p class="percent"><span>5.0</span>%</p>'
                    + '<p class="unit">奖学金年化（4 天）</p>'
                    + '</div>'
                    + '</div>'
                    + '<div class="b-residue" id="residue">'
                    + '<p class="process"><span></span></p>'
                    + '<p class="count">今日剩余额度：--万</p>'
                    + '</div>'
                    + '<div class="b-button">'
                    + '<a href="javascript:void(0)"></a>'
                    + '</div>'
                    + '</div>';
            });
            $('#allBuy').html(str);

            // self._data.buy = self._data.buy.replace('{code}', self._data.fundcode);
        },
        awardJudge: function () {
            var self = this;
            if (self.loginJudge()) {
                // 查看我的奖学金
                self.checkMyAward();
            } else {
                $("#learnButton a").attr('href', self._data.login + location.href);
            }
        },
        // activeEnd: function () {
        //     $("#goBuy").text('活动已结束').off().addClass('acend').attr('href', 'javascript:void(0)');
        //
        //     // $('#ticket').show().find('.button span').addClass('acend').text('活动已结束');
        //     // $('#shadow').show();
        // },
        statsJudge: function () {
            var self = this;
            if (self.loginJudge()) {
                var dt1 = self._data.dt;
                dt1.type = 'isreceive';

                $.post(self._data.commonUrl, {
                    "data": JSON.stringify(dt1),
                    "keyid": "1",
                    "fn": self._data.ifGet
                }, function (res) {
                    var res = eval('(' + res + ')');
                    var rdf = res.data.flag;

                    // 0 未领取 1 已领取
                    if (rdf == 0)
                        self.toGetcan.call(self);
                    else
                        self.toBuy.call(self);
                });
            } else {
                $('.buybox').find(".b-button a").text('领取奖学金').attr('href', self._data.login + location.href);
            }
        },
        checkMyAward: function () {
            var self = this;

            $("#learnButton a").on('click', function () {
                $('#award').show();
                $('#shadow').show();

                // 埋点
                TA.log({id: 'fund_mkt_20171215_ndcxl.ck'});
            });
            $('#award .a-close').on('click', function () {
                $('#award').hide();
                $('#shadow').hide();
            });

            // 获取奖学金记录
            var dt3 = self._data.dt;
            dt3.type = 'record';

            $.post(self._data.commonUrl, {
                "data": JSON.stringify(dt3),
                "keyid": "1",
                "fn": self._data.ifGet
            }, function (res) {
                var res = eval('(' + res + ')');
                var rdr = res.data.records;

                if (!rdr || rdr.length == 0) {
                    $('#recordBox').html('<p class="default tp">您尚未获得奖学金</p><p class="default">购买指定产品后，才可获得奖学金</p>')
                    return;
                }

                var str = '';
                $.each(rdr, function (i, v) {
                    var time = v.vc_accepttime.substr(4, 2) + '-' + v.vc_accepttime.substr(6, 2) + ' ' + v.vc_accepttime.substr(8, 2) + ':' + v.vc_accepttime.substr(10, 2);
                    str += '<ul class="record">'
                        + '<li>'
                        + '<p class="name">' + self._data.flist[v.vc_fundcode] + '</p>'
                        + '<p class="time">' + time + '</p>'
                        + '</li>'
                        + '<li>'
                        + '<p class="count">' + v.nd_applicationamount + '</p>'
                        + '</li>'
                        + '<li class="moneyli">'
                        + '<p class="money">' + parseFloat(v.prize).toFixed(2) + '</p>'
                        + '</li>'
                        + '</ul>';
                });

                $('#recordBox').html(str);

                // 设置滚动条
                $('#recordBox').slimScroll({
                    height: '310px',
                    railVisible: true,
                    alwaysVisible: true,
                    railOpacity: 0.1,
                    size: '4px',
                });
            });
        },
        toGetcan: function () {
            var self = this;
            $('.buybox').find(".b-button a:not(.acend)").text('领取奖学金').attr('href', 'javascript:void(0)');
            // $("#ticket").show();
            // $('#shadow').show();
            // // 弹框展现
            // TA.log({id: 'fund_mkt_20171215_tk'});
            // $('#ticket').click(function () {
            //     self.getTicket.call(self, function () {
            //         $('#ticket').hide();
            //         $('#shadow').hide();
            //     });
            //
            //     // 埋点
            //     TA.log({id: 'fund_mkt_20171215_ndcxl.tk'});
            // });
            $('.buybox').find(".b-button a:not(.acend)").click(function () {
                self.getTicket.call(self);

                var code = $(this).attr('data-code');
                // 埋点
                TA.log({id: 'fund_mkt_20171215_ndcxl.lq' + code});
            });
        },
        getTicket: function (cb) {
            var self = this;
            var dt2 = self._data.dt;
            dt2.type = 'receive';

            $.post(self._data.commonUrl, {
                "data": JSON.stringify(dt2),
                "keyid": "1",
                "fn": self._data.getCan
            }, function (res) {
                var res = eval('(' + res + ')');

                if (res.code == '0000') {
                    $('.buybox').each(function (i, v) {
                        var ts = $(this).find(".b-button a");
                        var code = $(ts).attr('data-code');

                        if (!$(ts).hasClass('acend')) {
                            var buylink = $(ts).attr('data-buy');
                            $(ts).text('立即购买').off().attr('href', buylink).attr('target', '_blank');
                        }

                        $(ts).click(function () {
                            // 埋点
                            TA.log({id: 'fund_mkt_20171215_ndcxl.buy' + code});
                        });
                    });

                    if (cb)
                        cb();
                } else {
                    alert(res.msg);
                }
            });
        },
        toBuy: function () {
            var self = this;

            $('.buybox').each(function (i, v) {
                var ts = $(this).find(".b-button a");
                var code = $(ts).attr('data-code');

                if (!$(ts).hasClass('acend')) {
                    var buylink = $(ts).attr('data-buy');
                    $(ts).text('立即购买').off().attr('href', buylink).attr('target', '_blank');
                }

                $(ts).click(function () {
                    // 埋点
                    TA.log({id: 'fund_mkt_20171215_ndcxl.buy' + code});
                });
            });
        },
        getInfo: function (cb) {
            var self = this;

            $.post(self._data.nomyUrl, {
                'fn': self._data.infoUrl
            }, function (res) {
                var data = eval('(' + res + ')');
                var dd = data.detail;
                var dt = data.totalnet;

                $('.buybox').each(function (i, v) {
                    if (!dd[self._data.fundcode[i]])
                        return true;

                    var residue = (1 - dd[self._data.fundcode[i]].rest / dd[self._data.fundcode[i]].total) * 100;
                    var rdu = dd[self._data.fundcode[i]].rest / 10000;

                    $(this).find('.left .percent').html('<span>' + parseFloat(dt[self._data.fundcode[i]]).toFixed(2) + '</span>%');
                    $(this).find('.count').text('剩余额度：' + parseInt(rdu) + '万');
                    $(this).find('.process span').css('width', residue.toFixed(2) + '%');
                    $(this).find(".b-button a").attr('data-buy', self._data.buy.replace('{code}', self._data.fundcode[i])).attr('data-code', self._data.fundcode[i]);

                    if (parseFloat(rdu) <= 0)
                        $(this).find(".b-button a").text('已售完').off().addClass('acend').attr('href', 'javascript:void(0)');

                });

                if (cb)
                    cb();
            })
        },
        loginJudge: function () {
            var userid = $.cookie("user_id");
            if (!userid) return false;

            var self = this;

            self._data.dt.custid = userid;
            self._data.dt.encryptcustid = self._data.dt.custid * 59 + 101;

            return true;
        }
    };

    // 获取服务器时间
    function getServerDate() {
        return new Date($.ajax({async: false}).getResponseHeader("Date")).getTime();
    }

    var fundlist = [
        [
            {fundname: '华泰柏瑞天添宝货币', fundcode: '003246'},
            {fundname: '华夏现金宝货币', fundcode: '001077'}
        ]
    ];
    // var time1 = new Date('2017/12/20 15:00').getTime();
    // var time2 = new Date('2017/12/25 15:00').getTime();
    // var now = getServerDate();

    new newYearAward(fundlist[0]);

    // if (now < time1)
    //     new newYearAward(fundlist[0]);
    // else if (now > time2)
    //     new newYearAward(fundlist[2]);
    // else
    //     new newYearAward(fundlist[1]);
});