/**
 * Created by viruser on 2017/9/4.
 */
require('../css/common.less')
require('../css/awardagain.less')

$(function(){
    TA.log({id: 'ad_jijin_17090603', fid: 'ch_fund,info_gather'});
    function sendKey(id) {
        TA.log({id: id, fid: 'ad_jijin_17090603_dj'});
    }

    $('#golearn').click(function () {
        $('#learn').show();
        $('#shadow').show();

        sendKey('ad_jijn_17090603_xx');
    });

    // $('#awardBtn').click(function () {
    //     $('#sybox').show();
    //     $('#shadow').show();
    // });

    $('.close').click(function () {
        $(this).parent().hide();
        $('#shadow').hide();
    });

    $('#learned').click(function () {
        $('#learn').hide();
        $('#shadow').hide();
    });

    $('#buybtn a').attr('hidefocus', 'true');

    $('.topNav a').attr('hidefocus', 'true');
    $('.footer a').attr('hidefocus', 'true');

    // 浮动收益
    $.ajax({
        url: 'https://trade.5ifund.com/php/fexcactive/pc/api.php/interface/net/minfo/0_004939_0_0',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            var ddt = data.data[0].totalnet;

            $('#sypercent span').html(parseFloat(ddt).toFixed(2));
            $('#sypercent').attr('hidefocus', 'true');
        }
    });

    $('#sypercent').click(function () {
        sendKey('ad_jijin_17090603_xq');
    });

    var ourl = 'https://trade.5ifund.com/php/fexcactive/pc/crossApi.php';
    var disurl = 'https://fund.10jqka.com.cn/interface/Activity/raiseAugust';

    // 剩余奖励
    $.ajax({
        url: 'https://trade.5ifund.com/php/fexcactive/pc/api.php/public/Activity/raise20170828_rest.txt',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (data != 'aa0') {
                $('#buybox').addClass('cant');
                $('#buybox .btn').html('券已领完');

                $('#buybtn a').click(function () {
                    sendKey('ad_jijin_17090603_buy');
                    $('#sorry').show();
                    $('#shadow').show();
                });

                $('#sorry .ok').click(function () {
                    $('#sorry').hide();
                    $('#shadow').hide();
                });

                if (isLogined()) {
                    $('#awardBtn').click(function () {
                        $('#sybox').show();
                        $('#shadow').show();
                    });
                    $('#sybox .ok').click(function () {
                        $('#sybox').hide();
                        $('#shadow').hide();
                    });

                    getSydialog();
                } else {
                    // 未登录
                    var hf = location.href;
                    hf += hf.indexOf('?') != -1 ? '&getsy=on' : '?getsy=on';
                    var url = 'https://trade.5ifund.com/login/loginInit.action?referrer=' + hf;

                    $('#awardBtn').click(function () {
                        location.href = url;
                    });
                }
            } else {
                hasSy();
            }
        }
    });

    // 获取收益信息
    function getSydialog() {
        var userid = $.cookie("user_id");
        var encryptcustid = userid * 59 + 101;

        var dt4 = {"type": "prize", "custid": userid, "encryptcustid": encryptcustid};
        $.ajax({
            url: ourl,
            data: {
                "data": JSON.stringify(dt4),
                "keyid": "3",
                "url": disurl
            },
            type: 'POST',
            success: function (data) {
                var dd = eval('(' + data + ')').data;
                var dar = eval('(' + dd + ')');
                var str = '';
                var pz = 0;

                $.each(dar, function (i, v) {
                    var dtime = v.vc_accepttime.toString();
                    var time = dtime.substring(4, 6) + '月' + dtime.substring(6, 8) + '日 ' + dtime.substring(8, 10) + ':' + dtime.substring(10, 12) + ':' + dtime.substring(12, 14);
                    str += '<p class="buyrecord">' + time + '  购买' + v.nd_applicationamount + '元 奖励' + v.prize + '元</p>';
                    pz += parseFloat(v.prize);
                });

                $('#sybox .sy span').html(pz + '元');
                $('#sybox .result').html(str);
            }
        });
    }

    function hasSy() {
        if (isLogined()) {
            var userid = $.cookie("user_id");
            var encryptcustid = userid * 59 + 101;

            // 未登录 点击我的收益 登陆后返回
            var lh = location.search.substring(1);
            if (lh) {
                lh = lh.replace('=', '":"');
                lh = '{"' + lh + '"}';

                lh = eval('(' + lh + ')');
            }

            if (lh.getsy && lh.getsy == 'on') {
                $('#sybox').show();
                $('#shadow').show();
            }

            getSydialog();

            var dt = {'type': 'hasticket', 'custid': userid, 'encryptcustid': encryptcustid};

            // 是否领券
            // {"data": {'type': 'init', 'custid': '100000000151', 'encryptcustid': '5900000009010'}, "keyid": "3", "url": "https://testfund.10jqka.com.cn/interface/Activity/raiseAugust"}
            $.ajax({
                url: ourl,
                data: {
                    "data": JSON.stringify(dt),
                    "keyid": "3",
                    "url": disurl
                },
                type: 'POST',
                success: function (data) {
                    var ddf = eval('(' + data + ')').data.flag_ticket;

                    if (ddf == '1') {
                        $('#buybox').addClass('cant');
                        $('#buybox .btn').off().html('已经领取');

                        // 已领券 点击抢购
                        $('#buybtn a').click(function () {
                            sendKey('ad_jijin_17090603_buy');
                            window.open('https://trade.5ifund.com/pc/buy/buy.html?frm=hd_r1&fundCode=004939');
                        });
                    } else if (ddf == '0') {
                        $('#buybox:not(.cant) .btn').click(function () {
                            // 去领券
                            var dt2 = {
                                'type': 'ticket',
                                'custid': userid,
                                'encryptcustid': encryptcustid,
                                'from': 'pc'
                            };

                            $.ajax({
                                url: ourl,
                                data: {
                                    "data": JSON.stringify(dt2),
                                    "keyid": "3",
                                    "url": disurl
                                },
                                type: 'POST',
                                success: function (data) {
                                    var dc = eval('(' + data + ')').code;

                                    switch (dc) {
                                        case '0000':
                                            alert('领取成功');
                                            $('#buybox').addClass('cant');
                                            $('#buybox .btn').html('已经领取');

                                            sendKey('ad_jijn_17090603_lq');

                                            // 领完券 改变抢购动作
                                            $('#buybtn a').off().attr('href', 'https://trade.5ifund.com/pc/buy/buy.html?frm=hd_r1&fundCode=004939').attr('target', '_blank');
                                            break;

                                        case '9999':
                                            alert('领取失败');
                                            break;

                                        case '0009':
                                            alert('您已经领取');
                                            $('#buybox').addClass('cant');
                                            $('#buybox .btn').html('已经领取');

                                            // 领完券 改变抢购动作
                                            $('#buybtn a').off().attr('href', 'https://trade.5ifund.com/pc/buy/buy.html?frm=hd_r1&fundCode=004939').attr('target', '_blank');
                                            break;

                                        default:
                                            break;
                                    }
                                }
                            })
                        });

                        if (lh.ifbuy && lh.ifbuy == 'on') {
                            $('#sorry2').show();
                            $('#shadow').show();
                        }

                        $('#buybtn a').click(function () {
                            sendKey('ad_jijin_17090603_buy');
                            $('#sorry2').show();
                            $('#shadow').show();
                        });
                        $('#sorry2 .ok').click(function () {
                            $('#sorry2').hide();
                            $('#shadow').hide();
                        });
                    }
                }
            });

            $('#awardBtn').click(function () {
                $('#sybox').show();
                $('#shadow').show();
            });
            $('#sybox .ok').click(function () {
                $('#sybox').hide();
                $('#shadow').hide();
            });
        } else {
            // 未登录
            var hf = location.href;
            hf += hf.indexOf('?') != -1 ? '&getsy=on' : '?getsy=on';
            var url = 'https://trade.5ifund.com/login/loginInit.action?referrer=' + hf;

            $('#awardBtn').click(function () {
                location.href = url;
            });

            var url2 = 'https://trade.5ifund.com/login/loginInit.action?referrer=' + location.href;
            $('#buybox .btn').click(function () {
                sendKey('ad_jijn_17090603_lq');
                location.href = url2;
            });

            var hf2 = location.href;
            hf2 += hf2.indexOf('?') != -1 ? '&ifbuy=on' : '?ifbuy=on';
            var url3 = 'https://trade.5ifund.com/login/loginInit.action?referrer=' + hf2;
            $('#buybtn a').click(function () {
                sendKey('ad_jijin_17090603_buy');
                location.href = url3;
            });
        }
    }

    function isLogined() {
        var uname = $.cookie("user_id");
        if (uname && uname.length > 0) {
            return true;
        } else {
            return false;
        }
    }
});