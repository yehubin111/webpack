//@charset "gbk";
const u = navigator.userAgent;
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
$(function () {
    // 判断tab的宽度
    const tabNum = $('.info-cont-tab ul').children('li').length;
    if (tabNum === 3) {
        $('.info-cont-tab ul li').css('width', '33%');
    } else if (tabNum === 2) {
        $('.info-cont-tab ul li').css('width', '50%');
    } else {
        $('.info-cont-tab').css('display', 'none');
    }
    /*智能机器人*/
    if (!isAndroid) {
        $('.zyzb-xh').show()
    }
    $('.zyzb-xh .quota-img,.quota-info').click(() => {
        if ((window.myoptions.appname == 'Hexin_Gphone' && compareVersion(window.myoptions.appversion, '8.90.01')) || (window.myoptions.appname == 'IHexin' && compareVersion(window.myoptions.appversion, '9.70.01'))) {
            let rbParamStr = JSON.stringify(rbParam);
            window.location.href = `client://client.html?action=ymtz^webid=2719^type=2^entranceType=2^newsInfo=${encodeURIComponent(rbParamStr)}^saying=${encodeURIComponent(saying)}`;
        }
        let pagestatid = $('#pagestatid').val();
        hxmClickStat(`${pagestatid}.zyzb.zhushou`);
    });
    var infoNone = setTimeout(function () {
        $('.zyzb-xh .quota-info').css({
            'transform': 'translateX(300px)',
            'transition': 'all 3000ms',

            '-webkit-transform': 'translateX(300px)',
            '-webkit-transition': 'all 3000ms',

            '-moz-transform': 'translateX(300px)',
            '-moz-transition': 'all 3000ms',

            '-ms-transform': 'translateX(300px)',
            '-ms-transition': 'all 3000ms'
        })
    }, 3000);
    //如果屏幕宽度过小，不显示同比
    if ($(window).width() < 375) {
        $('.zyzb-data').each(function () {
            let infoNum = $(this).children('li').length;
            if (infoNum === 3) {
                $(this).addClass('no-paiming');
                $(this).children('li').eq(1).css('display', 'none');
            }
        })
    }

    // 解决安卓手机line-height向上偏移2px问题
    if (isAndroid) {
        $('.zyzb-list .empBox').css('height', '24px')
    }

    function moveLeft($elem, callback) {
        var time = 200;
        $elem.animate({
            left: "100%"
        }, time, function () {
            if (callback && typeof callback == 'function') {
                callback();
            }
        });
        $elem.delay(time).animate({
            left: "0"
        }, time);
    }

    function drawPolaChart() {
        if (!(polaData && polaData.length > 0)) {
            return false;
        }
        var elemId = 'polachart',
            backgroundColor = '#fff',
            gridLineColor = '#d0d0d0',
            xLabelsColor = '#666',
            borderColor = '#a3a3a3',
            color = '#323232';

        if (theme == 'night') {
            backgroundColor = '#252528';
            gridLineColor = '#cecece';
            xLabelsColor = '#ababab';
            borderColor = '#a2a2a2';
            color = '#999';
        }
        polaData.push({
            type: 'scatter',
            marker: {
                symbol: 'circle',
                fillColor: '#478ad8',
                lineColor: '#91b9e8',
                lineWidth: 2
            },
            enableMouseTracking: false,
            data: [5, 5, 5, 5, 5]
        });

        $(`#${elemId}`).on('click', function () {
            hxmClickStat(`${pagestatid}.fivefin.finwhole.chart`);
        });

        $(`#${elemId}`).highcharts({
            chart: {
                type: 'area',
                polar: true,
                backgroundColor: backgroundColor
            },
            pane: {
                startAngle: 36
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 300],
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }
                }
            },
            colors: ['#ecbe5a', '#478ad8'],
            title: {
                text: null
            },
            credits: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: ['盈利能力', '成长能力', '偿债能力', '运营能力', '现金流'],
                tickmarkPlacement: 'on',
                lineWidth: 0,
                gridLineColor: gridLineColor,
                labels: {
                    style: {
                        color: xLabelsColor
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 5,
                tickInterval: 1,
                showLastLabel: true,
                gridLineColor: gridLineColor,
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                shared: true,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                style: {
                    padding: '0',
                    color: color
                },
                headerFormat: '',
                pointFormat: '<span>{series.name}: {point.y}<br/>'
            },
            series: polaData
        });
    }

    function drawRemarkChart(index) {
        if (!(remarkData && remarkData.length > 0 && index < remarkData.length)) {
            return false;
        }
        let elemId = 'remark-chart',
            name = '持有',
            categories = [],
            seriesdata = [],
            text,
            data,
            min = 0,
            max = 0,
            backgroundColor = '#fff',
            lineColor = '#f4f4f4',
            gridLineColor = '#f4f4f4',
            labelsColor = '#333';

        if (theme == 'night') {
            backgroundColor = '#252528';
            lineColor = '#313131';
            gridLineColor = '#313131';
            labelsColor = '#ababab';
        }

        $(`#${elemId}`).on('click', function () {
            var oldStat_name = $('.report-box .tab .cur a').attr('stat_name');
            hxmClickStat(`${pagestatid}.fivefin.finchange.${oldStat_name}.chart`);
        });

        text = remarkData[index].text;
        data = remarkData[index].data;
        for (let j = 0; j < data.length; j++) {
            categories.push(data[j].time);
            seriesdata.push(data[j].y);
            min = data[j].y < min ? data[j].y : min;
            max = data[j].y > max ? data[j].y : max;
        }
        $(`#${elemId}`).highcharts({
            chart: {
                backgroundColor: backgroundColor,
                events: {
                    load: function () {
                        moveLeft($('.remark-text'), function () {
                            $('.remark-text p').html(text);
                        });
                    }
                }
            },
            colors: ['#478ad8'],
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: categories,
                lineWidth: 1,
                lineColor: lineColor,
                tickWidth: 0,
                labels: {
                    formatter: function () {
                        var val = this.value.split('|');
                        return val[1] + '<br/>' + val[0];
                    },
                    style: {
                        color: labelsColor
                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                //tickInterval: parseInt((max-min)/10),
                lineWidth: 1,
                lineColor: lineColor,
                gridLineColor: gridLineColor,
                labels: {
                    style: {
                        color: labelsColor
                    }
                }
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: true,
                        fillColor: '#fff',
                        lineColor: '#478ad8',
                        lineWidth: 1
                    }
                }
            },
            tooltip: {
                valueSuffix: '',
                style: {
                    padding: '2px'
                },
                pointFormat: '{series.name}: {point.y}<br/>'
            },
            series: [{
                name: name,
                data: seriesdata
            }]
        });

    }

    $('.report-box .tab a').click(function () {
        var $dd = $('.report-box .tab dd');
        var $thisdd = $(this).parents('dd');
        var index = $dd.index($thisdd);
        var pagestatid = $('#pagestatid').val();
        var oldStat_name = $('.report-box .tab .cur a').attr('stat_name');
        if (!$thisdd.hasClass('cur')) {
            var stat_name = $(this).attr('stat_name');
            hxmClickStat(`${pagestatid}.fivefin.finchange.${oldStat_name}.${stat_name}`);
            $dd.removeClass('cur');
            $thisdd.addClass('cur');
            drawRemarkChart(index);
        }
    });

    function NewDate(str) {
        str = str.split('-');
        var date = new Date();
        date.setUTCFullYear(str[0], str[1] - 1, str[2]);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    }

    // 判断是否有财务解读这个模块
    if ($('.cwjd-box').length > 0) {
        //页面进入首次加载财务解读数据，每次加载20条
        getCwjdData()
        if ($('.zyzb-box').length === 0) {
            $('.cwjd-box').css('display', 'block');
        }

    }
    if ($('.zyzb-box').length === 0 && $('.cwjd-box').length === 0 && $('.wwcwzd-box').length > 0) {
        $('.wwcwzd-box').css('display', 'block');
    }
    // 页面统计埋点
    const pagestatid = $('#pagestatid').val();
    hxmPageStat(pagestatid);
    indexScrollBottomStat();

    const hash = location.hash;
    if (hash === '#wwcwzd') {
        $('.wwcwzd-li').siblings().removeClass('selected-tab').end().addClass('selected-tab');
        $('.cwjd-box').css('display', 'none');
        $('.zyzb-box').css('display', 'none');
        $('.wwcwzd-box').css('display', 'block');
    }

    const d = $('#chartData').val();
    if (d) {
        var chartData = eval(d),
            newDate = "",
            lastDate = "",
            newData = "",
            lastData = "",
            dateArr = new Array(),
            xaxisArr = new Array(),
            j = 0,
            tmp = "",
            tmpMonth = "";
        for (let i in chartData[0]) {
            dateArr[j] = i;
            tmp = NewDate(i);
            tmpMonth = tmp.getMonth() + 1;
            tmpMonth = (tmpMonth < 10 ? `0${tmpMonth}` : tmpMonth); //TODO
            xaxisArr[j++] = `${tmp.getFullYear()}|${tmpMonth}-${tmp.getDate()}`;
            if (newDate == "") {
                newDate = i;
                let lastDate = newDate;
                lastDate = lastDate.split('-');
                lastDate[0] = lastDate[0] - 1;
                lastDate = lastDate.join('-');
            }
            if (newData == "") {
                newData = `${chartData[0][i]['profit']['score']},${chartData[0][i]['grow']['score']},${chartData[0][i]['pay']['score']},${chartData[0][i]['operate']['score']},${chartData[0][i]['cash']['score']}`;
                let newProfit = chartData[0][i]['profit']['score'],
                    newGrow = chartData[0][i]['grow']['score'],
                    newPay = chartData[0][i]['pay']['score'],
                    newOperate = chartData[0][i]['operate']['score'],
                    newCash = chartData[0][i]['cash']['score'];
            }
            if (lastData == "") {
                lastData = `${chartData[0][lastDate]['profit']['score']},${chartData[0][lastDate]['grow']['score']},${chartData[0][lastDate]['pay']['score']},${chartData[0][lastDate]['operate']['score']},${chartData[0][lastDate]['cash']['score']}`;
                let lastProfit = chartData[0][lastDate]['profit']['score'],
                    lastGrow = chartData[0][lastDate]['grow']['score'],
                    lastPay = chartData[0][lastDate]['pay']['score'],
                    lastOperate = chartData[0][lastDate]['operate']['score'],
                    lastCash = chartData[0][lastDate]['cash']['score'];
            }
        }
        let polaData = [{
            name: '去年同期',
            data: [lastProfit, lastGrow, lastPay, lastOperate, lastCash]
        }, {
            name: '本期状况',
            data: [newProfit, newGrow, newPay, newOperate, newCash]
        }];
        let remarkData = [{
            text: `盈利能力分析:${chartData[0][newDate]['profit']['topComment']}${$('#stockname').val()}${chartData[0][newDate]['profit']['botComment']}`,
            data: [{
                time: xaxisArr[4],
                y: chartData[0][dateArr[4]]['profit']['score']
            }, {
                time: xaxisArr[3],
                y: chartData[0][dateArr[3]]['profit']['score']
            }, {
                time: xaxisArr[2],
                y: chartData[0][dateArr[2]]['profit']['score']
            }, {
                time: xaxisArr[1],
                y: chartData[0][dateArr[1]]['profit']['score']
            }, {
                time: xaxisArr[0],
                y: chartData[0][dateArr[0]]['profit']['score']
            }]
        }, {
            text: `成长能力分析:${chartData[0][newDate]['grow']['topComment']}${$('#stockname').val()}${chartData[0][newDate]['grow']['botComment']}`,
            data: [{
                time: xaxisArr[4],
                y: chartData[0][dateArr[4]]['grow']['score']
            }, {
                time: xaxisArr[3],
                y: chartData[0][dateArr[3]]['grow']['score']
            }, {
                time: xaxisArr[2],
                y: chartData[0][dateArr[2]]['grow']['score']
            }, {
                time: xaxisArr[1],
                y: chartData[0][dateArr[1]]['grow']['score']
            }, {
                time: xaxisArr[0],
                y: chartData[0][dateArr[0]]['grow']['score']
            }]
        }, {
            text: `偿债能力分析：${chartData[0][newDate]['pay']['topComment']}${$('#stockname').val()}${chartData[0][newDate]['pay']['botComment']}`,
            data: [{
                time: xaxisArr[4],
                y: chartData[0][dateArr[4]]['pay']['score']
            }, {
                time: xaxisArr[3],
                y: chartData[0][dateArr[3]]['pay']['score']
            }, {
                time: xaxisArr[2],
                y: chartData[0][dateArr[2]]['pay']['score']
            }, {
                time: xaxisArr[1],
                y: chartData[0][dateArr[1]]['pay']['score']
            }, {
                time: xaxisArr[0],
                y: chartData[0][dateArr[0]]['pay']['score']
            }]
        }, {
            text: `运营能力分析：${chartData[0][newDate]['operate']['topComment']}${$('#stockname').val()}${chartData[0][newDate]['operate']['botComment']}`,
            data: [{
                time: xaxisArr[4],
                y: chartData[0][dateArr[4]]['operate']['score']
            }, {
                time: xaxisArr[3],
                y: chartData[0][dateArr[3]]['operate']['score']
            }, {
                time: xaxisArr[2],
                y: chartData[0][dateArr[2]]['operate']['score']
            }, {
                time: xaxisArr[1],
                y: chartData[0][dateArr[1]]['operate']['score']
            }, {
                time: xaxisArr[0],
                y: chartData[0][dateArr[0]]['operate']['score']
            }]
        }, {
            text: `现金流分析：${chartData[0][newDate]['cash']['topComment']}${$('#stockname').val()}${chartData[0][newDate]['cash']['botComment']}`,
            data: [{
                time: xaxisArr[4],
                y: chartData[0][dateArr[4]]['cash']['score']
            }, {
                time: xaxisArr[3],
                y: chartData[0][dateArr[3]]['cash']['score']
            }, {
                time: xaxisArr[2],
                y: chartData[0][dateArr[2]]['cash']['score']
            }, {
                time: xaxisArr[1],
                y: chartData[0][dateArr[1]]['cash']['score']
            }, {
                time: xaxisArr[0],
                y: chartData[0][dateArr[0]]['cash']['score']
            }]
        }];
        drawPolaChart();
        drawRemarkChart(0);
    }

    // 财务分析-财务解读

    $(".info-cont-tab ul li").on('click', function () {
        indexScrollBottomStat();
        var tabOld = $('.info-cont-tab .selected-tab').attr('flag').split('-')[0];
        if (!$(this).hasClass('selected-tab')) {
            $(this).siblings().removeClass('selected-tab').end().addClass('selected-tab');
        }
        var flag = $(this).attr('flag');
        var stockcode = $('#stockcode').val();
        if (flag === "cwjd-box") {
            $('.wwcwzd-box').css('display', 'none');
            $('.zyzb-box').css('display', 'none');
            $('.cwjd-box').css('display', 'block');
            hxmClickStat('free_stock_diagnose_' + stockcode + '.finexplain');
        } else if (flag === "zyzb-box") {
            $('.wwcwzd-box').css('display', 'none');
            $('.zyzb-box').css('display', 'block');
            $('.cwjd-box').css('display', 'none');
            hxmClickStat('free_stock_diagnose_' + stockcode + '.impindex');
        } else {
            $('.cwjd-box').css('display', 'none');
            $('.zyzb-box').css('display', 'none');
            $('.wwcwzd-box').css('display', 'block');
            hxmClickStat('free_stock_diagnose_' + stockcode + '.fivefin');

        }
    });

    // 加载财务解读数据方法

    function getCwjdData() {
        $('#pub_new_load').hide();
        $('#morec').show();
        var page = $("#pub_new_load_a").attr('pages');
        var stockcode = $('#stockcode').val();
        $.get(`//basic.10jqka.com.cn/api/stockph/financeRead.php?code=${stockcode}&page=${page}`, function (data) {
            try {
                var datas = JSON.parse(data);
            } catch (e) {
            }
            if (datas.result) {
                if (datas.result.length < 20) {
                    $('.event-tab').hide();
                }
                var pages = Number(page) + 1;
                renderCwjdBox(datas.result, pages);
                $("#pub_new_load_a").attr('pages', pages)
                $('#pub_new_load').show();
            } else {
                $('.cwjd-box-list').unbind("touchend")
            }
            $('#morec').hide();

        });
    }

    //点击更多加载
    $('#pub_new_load').click(function () {
        getCwjdData()
    });
    // render 财务解读列表
    function renderCwjdBox(data, page) {
        data = data || [];
        let html = '';
        data.map(function (itm, idx) {
            html += `<li class="cwjd-list"> <div class="cwjd-title"><dl>`;
            if (theme === "night" && itm.type === "report") {
                var url = itm.pic.replace('white', 'black');
                html += ` <dt><img src="${url}" alt=""></dt>`;
            } else {
                html += ` <dt><img src="${itm.pic}" alt=""></dt>`;
            }

            html += `<dd><h2>${itm.author}</h2><p>`;
            var dateArr = itm.date.split(' ');
            var dateArr1 = dateArr[0].split('-');
            var dateArr2 = dateArr[1].split(':');
            html += `<span>${dateArr1[1]}-${dateArr1[2]}</span> <span>${dateArr2[0]}:${dateArr2[1]}</span>`;
            switch (itm.type) {
                case 'report':
                    html += '<span class="stat_flag" stat_flag="ybjd">&nbsp;研报解读财务</span></span>';
                    break;
                case 'dav':
                    html += '<span class="stat_flag" stat_flag="dvjd">&nbsp;大V解读财务</span></span>';
                    break;
                case 'guba':
                    html += '<span class="stat_flag" stat_flag="nsjd">&nbsp;牛散解读财务</span></span>';
                    break;
                default:
                    html += '';
            }
            html += `</p> </dd></dl></div><h3>${itm.title}</h3>`;
            // 黑板换图标
            html += `<h4 class="cwjd_jumpBtn limit" urls="${itm.url}"><span class="empBox"></span><ins class="uparrow">...全文</ins><div>${itm.content}</div></h4>`;
            if (itm.type !== "report") {
                html += `  <h5 class="cwjd_jumpBtn" urls="${itm.url}"><span class="read ">${itm.readnum} 阅读</span> <span class="comment "><i>&nbsp;&nbsp;&nbsp;&nbsp;</i> ${itm.replaynum} </span> <span class="like "> <i>&nbsp;&nbsp;&nbsp;&nbsp;</i>${itm.likenum}</span></h5>  `;
            }
            html += '</li>';
        });
        $('.cwjd-box-list').append(html);
        if (isAndroid) {
            $('.cwjd-list .empBox').css('height', '48px')
        }
    }

    // 下拉加载20条
    $('.cwjd-box-list').bind("touchend", function () {
        var stop = $(window).scrollTop();
        var ttop = $("#pub_new_load").offset().top;
        var wtop = $(window).height();
        if (stop + wtop > ttop) {
            getCwjdData();
        }
    });

    function indexScrollBottomStat() {
        var pagestatid = $('#pagestatid').val();
        var bottomStat = function () {
            var pageHeight = $('.main-cont').height();
            var screenHeight = $(window).height();
            var flag = $('.selected-tab').attr('flag');
            var key = '';
            if (flag === "cwjd-box") {
                key = 'finexplain';
            } else if (flag === "zyzb-box") {
                key = 'impindex';
            } else {
                key = 'fivefin';
            }
            if (pageHeight <= screenHeight) {
                hxmEventStat(pagestatid + '.' + key + '.bottom');
                $(window).off('touchstart', bottomStat);
            } else if (screenHeight + $(window).scrollTop() >= pageHeight) {
                hxmEventStat(pagestatid + '.' + key + '.bottom');
                $(window).off('scroll', bottomStat);
            }
        };

        var pageHeight = $('.main-cont').height();
        var screenHeight = $(window).height();
        if (pageHeight <= screenHeight) {
            $(window).on('touchstart', bottomStat);
        } else {
            $(window).on('scroll', bottomStat);
        }
    }

    // 点击阅读、点赞、评跳转到详情
    $('.cwjd-box-list').delegate('.cwjd_jumpBtn', 'click', function () {
        var pagestatid = $('#pagestatid').val();
        var stockcode = $('#stockcode').val();
        var stat_flag = $(this).parents().find('.stat_flag').attr('stat_flag');

        var href = $(this).attr('urls');
        try {
            var seq = href.split('cn/m')[1].split('_')[0];
        } catch (err) {
            var seq = '';
        }

        var to_resourcesid = 'seq_' + seq;
        hxmJumpPageStat(pagestatid + '.finexplain.yanbao.' + stat_flag, to_resourcesid);

        setTimeout(function () {
            window.location.href = href;
        }, 350);
    })


    $('.zyzb-list-box .zyzb-list').first().find('.zyzb-title-box').click(function (e) {
        e.stopPropagation();
        var pagestatid = $('#pagestatid').val();
        if ($(this).find('.zyzb-icon-explain').css('display') == 'none') {
            hxmClickStat(pagestatid + '.impindex.importance');
        } else {
            hxmClickStat(pagestatid + '.impindex.importance');
        }
        $('.zyzb-icon-explain').toggle();
        $('.zyzb-sj').toggle();
    })

    // // 点击页面其他部分， 弹窗关闭
    // $(document).click(function(e) {
    //     e.stopPropagation();
    //     if ($(e.target).closest('.zyzb-icon-explain').length == 0 && $(e.target).closest('.zyzb-label').length == 0 && $(e.target).closest('.zyzb-zyd-1').length == 0) {
    //         $('.zyzb-icon-explain').hide();
    //         $('.zyzb-sj').hide();
    //     }
    // })
    $('.zyzb-xbjd ').bind('click', function () {
        $('.zyzb-xbjd-yy').show();
        $("body").css({"overflow": "hidden", "height": "100%"});
    })

    $('.zyzb-xbjd-box .close-btn').bind('click', function () {
        $('.zyzb-xbjd-yy').hide();
        $("body").css({"overflow": "auto", "height": "100%"});
    })

    $('.zyzb-xbjd-box .detail-btn').bind('click', function (e) {
        if ($(this).hasClass('open')) {
            $('.detail-btn').addClass('open').removeClass('close');
            $('.detail-btn').parents('.xbjd-list').find('.xbjd-detail').hide();
            $(this).removeClass('open').addClass('close');
            $(this).parents('.xbjd-list').find('.xbjd-detail').show();
        } else {
            $(this).addClass('open').removeClass('close');
            $(this).parents('.xbjd-list').find('.xbjd-detail').hide();
        }
    })

    $('.zyzb-xbjd-box .yjfk').bind('click', function () {
        window.location.href = "https://eq.10jqka.com.cn/iphone_2th/suggestion.php ";
    })


    $('.zyzb-box .zyzb-list>.limit').on('click', function (e) {
        var stockcode = $('#stockcode').val();
        var pagestatid = $('#pagestatid').val();
        var flag = $(this).parent().attr('flag') || 1;
        var title = $(this).prevAll('.zyzb-title-box').find('.zyzb-title').text();
        var to_resourcesid = 'free_stock_zhibiao_fenxi_' + stockcode;
        hxmJumpPageStat(pagestatid + '.impindex.interpre.' + flag, to_resourcesid, {'title': title});
        var linksrc = system.pathname.replace('diagnosen', 'indicatorn');
        var seq = $(this).attr('seq');
        linksrc += "#" + seq;
        window.location.href = linksrc;
    });
    $('.zyzb-box .zyzb-list>.zyzb-data').on('click', function (e) {
        var stockcode = $('#stockcode').val();
        var pagestatid = $('#pagestatid').val();
        var flag = $(this).parent().attr('flag') || 1;
        var title = $(this).prevAll('.zyzb-title-box').find('.zyzb-title').text();
        var to_resourcesid = 'free_stock_zhibiao_fenxi_' + stockcode;
        hxmJumpPageStat(pagestatid + '.impindex.rank.' + flag, to_resourcesid, {'title': title});
        var linksrc = system.pathname.replace('diagnosen', 'indicatorn');
        var seq = $(this).prev('.limit').attr('seq');
        linksrc += "#" + seq;
        window.location.href = linksrc;
    });

    // $('.zyzb-box .zyzb-list ').bind('click', function (e) {
    //     if ($(e.target).closest('.zyzb-title-box').length == 0) {
    //         var stockcode = $('#stockcode').val();
    //         var pagestatid = $('#pagestatid').val();
    //         var flag = $(this).attr('flag') || 1;
    //         var to_resourcesid = 'free_stock_zhibiao_fenxi_' + stockcode;
    //         hxmJumpPageStat(pagestatid + '.zyzb.zbxx.' + flag, to_resourcesid);
    //         var linksrc = system.pathname.replace('diagnosen', 'indicatorn');
    //         var seq = $(this).find('h3').attr('seq');
    //         linksrc += "#" + seq;
    //         window.location.href = linksrc;
    //     }
    // })

});