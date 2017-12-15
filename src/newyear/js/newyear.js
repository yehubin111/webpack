/**
 * Created by viruser on 2017/12/13.
 */
import '../../common/less/common.less';
import '../../common/less/footer.less';
import '../css/newyear.less';

$(function () {
    function newYearAward(fund) {
        this._data = {
            fundcode: fund.fundcode,
            fundname: fund.fundname,
            dt: {
                custid: '',
                encryptcustid: '',
                activityId: '20171218'
            },
            custid: '',
            encryptcustid: '',
            login: '/login/loginInit.action?referrer=', //登录
            buy: '/trade/trade_otherTradeInit.action?fundCode={code}&tradeType=buy&amount=50000&frm=head',  //购买
            infoUrl: 'public/Activity/subsidyMobile20171218_rest.txt',
            getCan: 'interface/Activitynew/subsidyMobile',  // 领取奖励资格
            ifGet: 'interface/Activitynew/subsidyMobile',  // 是否领取奖励资格
            commonUrl: '/php/fexcactive/pc/crossApi.php',
            nomyUrl: '/php/fexcactive/pc/crossFile.php'  //无秘钥
        };

        this.init();
    }

    newYearAward.prototype = {
        init: function () {
            var self = this;

            this.initFund();

            // 获取收益信息，剩余额度
            this.getInfo(function (amt) {
                if (parseFloat(amt) > 0)
                // 购买按钮判断
                    self.statsJudge();
                else
                    self.activeEnd();
            });

            // 查看奖励判断
            this.awardJudge();

            // 埋点
            TA.log({id: 'fund_mkt_20171213_dqlc'});
        },
        initFund: function () {
            var self = this;

            $('#buyBox .name').attr('href', '//fund.10jqka.com.cn/' + self._data.fundcode + '/').text(self._data.fundname);
            self._data.buy = self._data.buy.replace('{code}', self._data.fundcode);
            $('#ticket .t-right .tell').eq(0).find('span').text(self._data.fundname);
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
        activeEnd: function () {
            $("#goBuy").text('活动已结束').off().addClass('acend').attr('href', 'javascript:void(0)');

            $('#ticket').show().find('.button span').addClass('acend').text('活动已结束');
            $('#shadow').show();
        },
        statsJudge: function () {
            var self = this;
            if (self.loginJudge()) {
                var dt1 = self._data.dt;
                dt1.type = 'isreceive';

                $.post(self._data.commonUrl, {
                    "data": JSON.stringify(dt1),
                    "keyid": "3",
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
                $("#goBuy").text('领取奖学金').attr('href', self._data.login + location.href);
                $("#ticket").show().click(function () {
                    $('#ticket').hide();
                    $('#shadow').hide();
                    // 埋点
                    TA.log({id: 'fund_mkt_20171213_dqlc.tk'});
                });
                $('#shadow').show();
            }
        },
        checkMyAward: function () {
            var self = this;

            $("#learnButton a").on('click', function () {
                $('#award').show();
                $('#shadow').show();

                // 埋点
                TA.log({id: 'fund_mkt_20171213_dqlc.ck'});
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
                "keyid": "3",
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
                    if(v.vc_fundcode != self._data.fundcode)
                        return true;

                    var time = v.vc_accepttime.substr(4, 2) + '-' + v.vc_accepttime.substr(6, 2) + ' ' + v.vc_accepttime.substr(8, 2) + ':' + v.vc_accepttime.substr(10, 2);
                    str += '<ul class="record">'
                        + '<li>'
                        + '<p class="name">' + self._data.fundname + '</p>'
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
            $("#goBuy").text('领取奖学金').attr('href', 'javascript:void(0)');
            $("#ticket").show();
            $('#shadow').show();
            $('#ticket').click(function () {
                self.getTicket.call(self, function () {
                    $('#ticket').hide();
                    $('#shadow').hide();
                });

                // 埋点
                TA.log({id: 'fund_mkt_20171213_dqlc.tk'});
            });
            $("#goBuy").click(function () {
                self.getTicket.call(self);

                // 埋点
                TA.log({id: 'fund_mkt_20171213_dqlc.lqjl'});
            });
        },
        getTicket: function (cb) {
            var self = this;
            var dt2 = self._data.dt;
            dt2.type = 'receive';

            $.post(self._data.commonUrl, {
                "data": JSON.stringify(dt2),
                "keyid": "3",
                "fn": self._data.getCan
            }, function (res) {
                var res = eval('(' + res + ')');

                if (res.code == '0000') {
                    $("#goBuy").text('立即购买').off().attr('href', self._data.buy).attr('target', '_blank');
                    $("#goBuy").click(function () {
                        // 埋点
                        TA.log({id: 'fund_mkt_20171213_dqlc.buy'});
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
            $("#goBuy").text('立即购买').attr('href', self._data.buy).attr('target', '_blank');
            $("#goBuy").click(function () {
                // 埋点
                TA.log({id: 'fund_mkt_20171213_dqlc.buy'});
            });
        },
        getInfo: function (cb) {
            var self = this;

            $.post(self._data.nomyUrl, {
                'fn': self._data.infoUrl
            }, function (res) {
                var data = eval('(' + res + ')');

                var residue = (1 - data.detail[self._data.fundcode].rest / data.detail[self._data.fundcode].total) * 100;
                var rdu = data.detail[self._data.fundcode].rest / 10000;
                $('#fundInfo .percent').html('<span>' + parseFloat(data.totalnet[self._data.fundcode]).toFixed(2) + '</span>%');
                $('#residue .count').text('今日剩余额度：' + parseInt(rdu) + '万');
                $('#residue .process span').css('width', residue.toFixed(2) + '%');

                if (cb)
                    cb(rdu);
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
        {fundname: '光大保德信短期理财', fundcode: '360019'},
        {fundname: '广发30天理财', fundcode: '270046'}
    ];
    var time = new Date('2017/12/22 15:00').getTime();
    var now = getServerDate();

    if (now > time)
        new newYearAward(fundlist[1]);
    else
        new newYearAward(fundlist[0]);
});


