//@charset "gbk";
var flag = 0;
var repFlag = 0; //��¼���ڱ�����
var repPeriod = ['����', '�걨', '������', '���걨', 'һ����'];
var repPeriodStat = ['newer', 'annual', 'third', 'interim', 'first'];

/*���ɻ��������걨*/
function createRateList(obj) {
    flag = 0;
    $(".stockholder-tab tbody tr").remove();
    var html = '<tr>' +
        '<th width="28%">�о�����</th>' +
        '<th width="24%">��������</th>' +
        '<th width="24%">ÿ������</th>' +
        '<th width="24%">Ŀ���</th>' +
        '</tr>';
    $(".stockholder-tab tbody").append(html);
    seeMore(obj);
    $('#stockholder-more a').html('�鿴����');
}

function seeMore(obj) {
    var objLen = obj.length;
    var html = '';

    var loopLen = objLen - flag >= 5 ? 5 : objLen - flag;
    var i;
    if (loopLen < 5) {
        $('#stockholder-more a').html('�������');
    }
    while (loopLen > 0) {
        i = flag;
        html += '<tr>' +
            '<td>' +
            '<p>' + obj[i].name + '</p>' +
            '<p class="s-time">' + obj[i].time + '</p>' +
            '</td>' +
            '<td>' +
            '<p>' + obj[i].rate + '</p>';
        if (obj[i].rateIcon == 'rate-red') {
            html += '<p><i class="rate-red">�����ϵ�</i></p>';
        } else if (obj[i].rateIcon == 'rate-green') {
            html += '<p><i class="rate-green">�����½�</i></p>';
        }
        html += '</td>' +
            '<td>' + obj[i].income + '</td>' +
            '<td>' + obj[i].aim + '</td>' +
            '</tr>';
        loopLen--;
        flag++;
    }
    $('.stockholder-tab tbody').append(html);
}
//createRateList(stockObj2014);


/*������������ �鿴���� or ������� */
$('#stockholder-more').click(function () {
    var index = 0;
    if ($(this).find('a').html() == '�������') {
        if (index == '0') { //2014��
            createRateList(stockObj2014);
        }
    } else { //�鿴����
        if (index == '0') { //2014��
            seeMore(stockObj2014);
        }
    }
});

/*ҵ��Ԥ��*/
$('.month i').click(function () {
    var className = $(this).prop('class');
    var num = 0;
    if (className == 'month-unfold') { //���ǰΪչ��״̬
        //�۵�����
        $(this).prop('class', 'month-fold');
        $(this).parents('tr').next().css('display', 'none');
    } else { //���ǰΪ�۵�״̬
        //չ������
        $(this).prop('class', 'month-unfold');
        $(this).parents('tr').next().css('display', 'table-row');
    }
    $('.month i').each(function () {
        if ($(this).prop('class') == 'month-fold') {
            num++;
        }
    });
});

/*�о�����*/
var flagReport = 0;

function createRepert(obj, loopLen) {
    if (flagReport == 0) {
        $('.report-list').remove();
    }
    var html = '';
    while (loopLen > 0) {
        html += '<div class="report-list">' +
            '<h4>' + obj[flagReport].tit + '</h4>' +
            '<p><span>' + obj[flagReport].time + '</span>';
        if (obj[flagReport].tip == '����') {
            html += '<i class="red">����</i></p>';
        } else if (obj[flagReport].tip == '����') {
            html += '<i class="orange">����</i></p>';
        } else if (obj[flagReport].tip == '����') {
            html += '<i class="green">����</i></p>';
        } else if (obj[flagReport].tip == '����') {
            html += '<i class="gray">����</i></p>';
        } else {
            html += '<i>' + obj[flagReport].tip + '</i></p>';
        }
        if (flagReport == 0) {
            html += '<p class="re-detail show">' + obj[flagReport].detail + '</p>' +
                ' </div>';
        } else {
            html += '<p class="re-detail" style="display: none;">' + obj[flagReport].detail + '</p>' +
                ' </div>';
        }
        loopLen--;
        flagReport++;
    }
    $('#report-more').before(html);
}

function seeMoreRep(obj) {
    var clientH = document.documentElement.clientHeight;
    var num = Math.floor((clientH - 41) / 67); //һ������ʾ����Ϣ����
    var loopLen = obj.length - flagReport > num ? num : obj.length - flagReport;
    if (obj.length - flagReport < num) {
        $('#report-more').find('a').html('�������');
    }
    createRepert(obj, loopLen);
    document.body.scrollTop = document.body.scrollHeight; //���������ײ�
}
//createRepert(repoertObj,2);

/*�о����� ��ʾ����*/
$('.info-cont').on('click', '.report-list', function () {
    if (!$(this).find('.re-detail').hasClass('show')) {
        $(this).find('.re-detail').addClass('show').show();
    } else {
        $(this).find('.re-detail').removeClass('show').hide();

    }
});


/*�о����� �鿴����*/
$('#report-more').click(function () {
    if ($('#report-more').find('a').html() == '�鿴����') {
        seeMoreRep(repoertObj);
    } else { //�������
        flagReport = 0;
        $('#report-more').find('a').html('�鿴����');
        createRepert(repoertObj, 2);
    }
});

/*�Ʊ�*/
//�Ʊ���ҳ
var menu,
    clientw,
    ul,
    lis,
    menuw;
if (window.location.href.indexOf('maintablen') != -1 || window.location.href.indexOf('dtl') != -1) { /*�˵����һ���*/
    menu = document.getElementById('menu');
    clientw = menu.offsetWidth;
    ul = menu.getElementsByTagName('ul')[0];
    lis = menu.getElementsByTagName('li');
    menuw = 0;
    for (var i = 0; i < lis.length; i++) {
        menuw += lis[i].offsetWidth;
    }
    menuw += 10;
    ul.style.width = menuw + 'px';
    if (clientw < menuw) {
        ul.style.marginLeft = 0;
        swipeFun(menu);
    }
}


$('.menuzone li').click(function () {
    //ͳ��
    var pagestatid = $('#pagestatid').val();
    var statname = $(this).find('a').attr('stat_name');
    var oldStatName = $('#nav-cur a').attr('stat_name');
    if (oldStatName != statname)
        hxmClickStat(pagestatid + '.' + oldStatName + '.' + statname, {'action_type': '1'});
    var pos = $(this).index();
    $('.menuzone li').eq(pos).prop('id', 'nav-cur').siblings('li').prop('id', '');
    $(this).parent().css('margin-left', pos * (-80) + 'px');

    $('#menu li').eq(pos).prop('id', 'nav-cur').siblings('li').prop('id', '');
    $('#clonemenu li').eq(pos).addClass('clone-cur').siblings('li').removeClass('clone-cur');

    /*����ҳ������*/
    var a = pos;
    var b = slider.element.style;
    var c = slider.speed;
    slider.index = pos;
    b.webkitTransitionDuration = b.MozTransitionDuration = b.msTransitionDuration = b.OTransitionDuration = b.transitionDuration = c + "ms";
    b.MozTransform = b.webkitTransform = "translate3d(" + -(a * slider.width) + "px,0,0)";
    b.msTransform = b.OTransform = "translateX(" + -(a * slider.width) + "px)";

    //�ı�����
    createCanvas(pos);
    //������
    createList(getKeyObj());
    //��ҵ��λ
    //initRank(pos);
});

function swipeFun(touchobj) { //�˵���ˮƽ�ƶ�
    var pressX = 0;
    var moveX = 0;
    var maxmoveX = clientw - menuw;

    var lis = touchobj.getElementsByTagName('li');
    var stPos = getStartPos();
    for (var i = 0; i < lis.length; i++) {
        if (i == stPos) {
            break;
        } else {
            moveX -= lis[i].offsetWidth;
        }
    }

    if (moveX > 0) {
        moveX = 0;
    } else if (moveX <= maxmoveX) {
        moveX = maxmoveX;
    }
    ul.style.marginLeft = moveX + 'px';
    touchobj.addEventListener('touchmove', function (event) {
        // ������Ԫ�ص�λ����ֻ��һ����ָ�Ļ�

        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            var spanX = touch.pageX - pressX;
            pressX = touch.pageX;
            moveX += spanX;
            if (moveX > 0) {
                moveX = 0;
            } else if (moveX <= maxmoveX) {
                moveX = maxmoveX;
            }

            ul.style.marginLeft = moveX + 'px';
        }
    }, false);

    touchobj.addEventListener('touchstart', function (event) {
        // ������Ԫ�ص�λ����ֻ��һ����ָ�Ļ�
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            // ��Ԫ�ط�����ָ���ڵ�λ��
            pressX = touch.pageX;
        }
    }, false);
    touchobj.addEventListener('touchend', function (event) {
        // ������Ԫ�ص�λ����ֻ��һ����ָ�Ļ�
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            // ��Ԫ�ط�����ָ���ڵ�λ��
            pressX = touch.pageX;
        }
    }, false);
}


/*�Ʊ�����ҳ��*/
function getStartPos() { //��ò˵���λ��
    var url = window.location.href;
    var startP = url.indexOf('&subIndex') + 10;
    var startPos = parseInt(url.substring(startP));
    $('.menuzone li').eq(startPos).prop('id', 'nav-cur').siblings('li').prop('id', '');
    return startPos;
}

var stPos = getStartPos();
var rankObj;


function getZheObj() {
    var zheobj = getKeyObj();
    var zheArr = [];
    for (var i in zheobj) {
        zheArr.push(parseFloat(zheobj[i].profit));
    }
    return zheArr;
}

function getZheObjTime() {
    var zheobj = getKeyObj();
    var zheTimeArr = [];
    for (var i in zheobj) {
        var time = zheobj[i].time;
        var timeStr = '';
        timeStr += time.substr(0, 4);
        switch (time.substr(5, 2)) {
            case '03':
                timeStr += '|һ����';
                break;
            case '06':
                timeStr += '|�б�';
                break;
            case '09':
                timeStr += '|������';
                break;
            case '12':
                timeStr += '|�걨';
                break;
            default:
                break;
        }
        zheTimeArr.push(timeStr);
    }
    return zheTimeArr;
}


//��˾������Ҫָ����ϸҳִ���¼�(����ͼ)
/*����Ҫָ�꡿����ͼ*/
function createCanvas(num) {
    if (document.getElementById("catecode").value == 'maintabledtln' ||
        document.getElementById("catecode").value == 'benefitdtln' ||
        document.getElementById("catecode").value == 'debtdtln' ||
        document.getElementById("catecode").value == 'cashdtln' ||
        document.getElementById("catecode").value == 'bankdtln') {
        var boxw1 = document.getElementById("dtl-zhe" + (num + 1));
        boxw1.width = $(window).width() - 20;
        boxw1.height = 200;

        var zheobj = getZheObj();
        var zheobjTime = getZheObjTime();
        var isok = false;
        if (zheobj.length > 0) {
            for (x in zheobj) {
                if (!isNaN(zheobj[x])) {
                    isok = true;
                }
            }
        }
        //һ�����ݵ�ʱ�����⴦��
        if (zheobj.length == 1) {
            zheobj.unshift(NaN);
            zheobjTime.unshift('')
        }
        if (!isok) {
            $('#dtl-zhe' + (num + 1)).hide();
            var $slidenode = $('#dtl-zhe' + (num + 1)).parents('.slide-block');
            var $clone = $('<div id="clone-f-h4" class="info-cont"></div>');
            //$slidenode.find('.info-cont').eq(0).hide();
            $clone.html($slidenode.find('.info-cont').eq(0).children('.f-h4').clone());
            $slidenode.find('.info-cont').eq(0).append($('#nodata'));
            //$('#nodata').before($clone);
            $('#nodata').show();
            return false;
        } else {
            $('#clone-f-h4').remove();
            $('#nodata').hide();
            var $slidenode = $('#dtl-zhe' + (num + 1)).parents('.slide-block');
            $slidenode.find('.info-cont').show();
            $('#dtl-zhe' + (num + 1)).show();
        }

        var chartsConfig;
        if (theme == 'night') {
            chartsConfig = {
                bezierCurve: false,
                datasetFill: false,
                animation: false,
                showTooltips: false,
                scaleOverride: false,
                scaleLineColor: "#313131",
                scaleGridLineColor: "#313131"
            };
        } else {
            chartsConfig = {
                bezierCurve: false,
                datasetFill: false,
                animation: false,
                showTooltips: false,
                scaleOverride: false
            };
        }
        var lineChartData_zhe = {
            "labels": zheobjTime,
            "datasets": [{
                "strokeColor": "#4691EE",
                "pointColor": "#fff",
                "pointStrokeColor": "#4691EE",
                "data": zheobj
            }]
        };
        var myLine1 = new Chart(boxw1.getContext("2d")).Line(lineChartData_zhe, chartsConfig);
    }
}


/*���ɡ�ָ��䶯������*/
function createList(obj) {
    obj = objSort(obj);
    var submenu = document.getElementById('nav-cur');
    var subindex = $(submenu).index();
    var unit = $('.slide-block').eq(subindex).find('.unit').html();
    if (!obj || obj.length <= 0) {
        $('.list-tab tbody').eq(subindex).hide();
        return false;
    }

    $('.list-tab tbody tr').remove();
    var isok = false;
    for (x in obj) {
        if (obj[x]['profit']) {
            isok = true;
        }
    }
    if (!isok) {
        return false;
    }
    var loopLen = Math.min(obj.length, 5);
    var html = '';
    var i = 0;
    var keyname = $(submenu).find('a').html();
    html += '<tr>' +
        '<th width="30%">������</th>' +
        '<th width="45%">' + keyname + '</th>' +
        '<th width="25%">ͬ������</th>' +
        '</tr>';
    var profitobj;
    var unitobj;
    while (loopLen > 0) {
        if (parseFloat(obj[i].range) > 0) {
            var color = 'cred';
        } else {
            var color = 'cgreen';
        }
        profitobj = obj[i].profit ? obj[i].profit : '--';
        unitobj = obj[i].unit ? obj[i].unit : unit;
        html += '<tr>' +
            '<td>' + obj[i].time + '</td>' +
            '<td>' + profitobj + unitobj + '</td>' +
            '<td class="' + color + '">' + obj[i].range + '</td>' +
            '</tr>';
        i++;
        loopLen--;
    }
    $(".unit").eq(subindex).html(unitobj)
    $('.list-tab tbody').eq(subindex).append(html);
    $('.list-tab tbody').eq(subindex).show();
}


/*�л�������*/
$(document).on('click', '.change', function () {
    repFlag++;
    repFlag = repFlag > (repPeriod.length - 1) ? 0 : repFlag;
    var changeIndex = repFlag + 1 > (repPeriod.length - 1) ? 0 : repFlag + 1;
    $('.change').html('���л�' + repPeriod[changeIndex] + '��');
    $('.ptit span').not($(".unit")).html(repPeriod[repFlag]);
    var submenu = document.getElementById('nav-cur');
    var subindex = $(submenu).index();
    //ͳ��
    var pagestatid = $('#pagestatid').val();
    var tab1 = $('#nav-cur a').attr('stat_name');
    hxmClickStat(pagestatid + '.' + tab1 + '.period', {'title': repPeriod[repFlag]});
    createCanvas(subindex);
    createList(getKeyObj());
});

$('#slide_area canvas').on('click', function () {
    var pagestatid = $('#pagestatid').val();
    var tab1 = $('#nav-cur a').attr('stat_name');
    hxmClickStat(pagestatid + '.' + tab1 + '.chart');
});

function getKeypage() { //���ҳ������
    var url = window.location.href;
    var starP = url.indexOf('#pageIndex') + 11;
    var endP = url.indexOf('&', starP);
    var page = parseInt(url.substring(starP, endP));
    return page;
}

function getKeyObj() {
    var allObjClone = $.extend(true, [], allObj);
    var mainObjClone = $.extend(true, [], mainObj);
    var subObjClone = $.extend(true, [], subObj);
    var submenu = document.getElementById('nav-cur');
    var subindex = $(submenu).index();
    var mainObj = allObjClone[getKeypage()];
    var subObj = mainObj[subindex];
    var keyObj = subObj[repFlag];
    return keyObj;
}
//��ʱ�䣬�Ӵ�С����
function objSort(keyObj) {
    var tempObj = keyObj;
    var len = tempObj.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - i - 1; j++) {
            if (tempObj[j].time < tempObj[j + 1].time) {
                var temp = tempObj[j];
                tempObj[j] = tempObj[j + 1];
                tempObj[j + 1] = temp;
            }
        }
    }
    return tempObj;
}


/*��ҵ��λ*/
function getRankObj() {
    var submenu = document.getElementById('nav-cur');
    var subindex = $(submenu).index() || stPos;
    var mainObj = allRankObj[getKeypage()];
    var rankobj = mainObj[subindex];
    // rankObj = rankobj;
    return rankobj;
}

//����ҳ
if (window.location.href.indexOf('dtl') != -1) {
    var keyName = '������';
    var keyRank;
    //rankObj = getRankObj();
}


function createRank(obj, loopLen, num) {
    obj = getRankObj();
    for (var i = 0; i < rankObj.length; i++) { //�����ҵ����
        if (rankObj[i].name.indexOf(keyName) != -1) {
            keyRank = i + 1;
            break;
        }
    }
    $('.industry-tab tbody tr').remove();
    var html = '';
    var i = 0;
    html = '<tr>' +
        '<th width="22%">����</th>' +
        '<th width="26%">��Ʊ����</th>' +
        '<th width="26%">��Ʊ���</th>' +
        '<th width="26%">������(��)</th>' +
        '</tr>';
    while (loopLen > 0) {
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + obj[i].code + '</td>' +
            '<td>' + obj[i].name + '</td>' +
            '<td class="cred">' + obj[i].profit + '</td>' +
            '</tr>';
        i++;
        loopLen--;
    }
    //��������
    var rankTxt = $('.industry-tab').eq(num).find('i')[1];
    rankTxt.innerHTML = keyRank + '/' + obj.length;
    $('.industry-tab tbody').eq(num).append(html);
    if (keyRank > loopLen) {
        $('.industry-tab tbody tr').eq(keyRank).prop('class', 'cblue');
    }
    //��̬�޸Ļ�����߶�
    var slide_area = document.getElementById('slide_area');
    slidezone.style.height = slide_area.offsetHeight + 'px';
}

function initRank(num) {
    var submenu = document.getElementById('nav-cur');
    var subindex = $(submenu).index();
    var i = subindex;
    rank = getRankObj();
    //��������
    var rankTxt = $('.industry-tab').eq(i).find('i')[1];
    rankTxt.innerHTML = keyRank + '/' + rankObj.length;
    if (rankObj.length > 6) {
        $('.industry-tab .more').eq(i).show();
        if (keyRank > 6) {
            createRank(rankObj, 5, subindex);
            var html = '<tr class="cblue">' +
                '<td>' + keyRank + '</td>' +
                '<td>' + rankObj[keyRank - 1].code + '</td>' +
                '<td>' + rankObj[keyRank - 1].name + '</td>' +
                '<td class="cred">' + rankObj[keyRank - 1].profit + '</td>' +
                '</tr>';
            $('.industry-tab tbody').eq(i).append(html);
        } else {
            createRank(rankObj, 6, subindex);
        }
    } else {
        $('.industry-tab .more').eq(i).hide();
        createRank(rankObj, 6, subindex);
    }
    //��̬�޸Ļ�����߶�
    var slide_area = document.getElementById('slide_area');
    slidezone.style.height = slide_area.offsetHeight + 'px';
}

/*����ҵ��λ���鿴����*/
$('.industry-more').click(function (event) {
    var i = $(this).index();
    var submenu = document.getElementById('nav-cur');
    var subindex = $(submenu).index();
    var i = subindex;
    if ($('.industry-tab .more').find('a').eq(i).html() == '�鿴����') {
        createRank(rankObj, rankObj.length, i);
        $('.industry-tab .more').find('a').eq(i).html('�������');
    } else {
        initRank(subindex);
        $('.industry-tab .more').find('a').eq(i).html('�鿴����');
    }
});


/*ָ��ҳ�桪��ͷ�����̶�*/
window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if (t > 46) {
        $('.menu-area').addClass('fixed-menu');
        $('.slide-cont').css('marginTop', '30px');
    } else {
        $('.menu-area').removeClass('fixed-menu');
        $('.slide-cont').css('marginTop', '0');
    }
};
$('.industry-tab td.stockcodecheck').each(function () {
    if ($(this).html() == $("#stockcode").val()) {
        $(this).parent().css({'color': '#3d76b8', 'font-weight': 'bold'});
    }
});
$('.menu-more').click(function () {
    if ($('#clonemenu').find('ul').length < 1) {
        $('#menu ul').clone().appendTo('#clonemenu');
        var top = $(this).offset().top;
        $('#clonemenu').find('ul').addClass('clonemenuCss').css({
            'width': '105px',
            'marginLeft': 0
        });
        $('#clonemenu ul li').each(function () {
            var str = $(this).html();
            str = str.replace('|', '');
            if ($(this).attr('id') == 'nav-cur') {
                $(this).addClass('clone-cur');
            }
            $(this).removeAttr('id');
            $(this).html(str);
        })
    }
    if ($('#clonemenu').hasClass('hide')) {
        $('#clonemenu').removeClass('hide');
    } else {
        $('#clonemenu').addClass('hide');
    }
    //ͳ��
    var pagestatid = $('#pagestatid').val();
    hxmClickStat(pagestatid + '.button.open');
});
$('#clonemenu li').live('click', function () {
    //ͳ��
    var pagestatid = $('#pagestatid').val();
    var statname = $(this).find('a').attr('stat_name');
    var oldStatName = $('#clonemenu .clone-cur a').attr('stat_name');
    hxmClickStat(pagestatid + '.open.' + oldStatName + '.' + statname);
    var pos = $(this).index();
    //�˵���
    $('#menu li').eq(pos).prop('id', 'nav-cur').siblings('li').prop('id', '');
    $('#clonemenu li').eq(pos).addClass('clone-cur').siblings('li').removeClass('clone-cur');
    createPage(pos);
    $('#clonemenu').addClass('hide');

});

function createPage(pos) {
    $('.menuzone li').eq(pos).prop('id', 'nav-cur').siblings('li').prop('id', '');
    $('.menuzone li').eq(pos).parent().css('margin-left', pos * (-80) + 'px');
    /*����ҳ������*/
    var a = pos;
    var b = slider.element.style;
    var c = slider.speed;
    slider.index = pos;
    b.webkitTransitionDuration = b.MozTransitionDuration = b.msTransitionDuration = b.OTransitionDuration = b.transitionDuration = c + "ms";
    b.MozTransform = b.webkitTransform = "translate3d(" + -(a * slider.width) + "px,0,0)";
    b.msTransform = b.OTransform = "translateX(" + -(a * slider.width) + "px)";

    //�ı�����
    createCanvas(pos);
    //������
    createList(getKeyObj());
}
$(document).click(function (e) {
    var $clonemenu = $(e.target).closest('#clonemenu');
    var $menumore = $(e.target).closest('.menu-more');
    if (!($clonemenu.length || $menumore.length)) {
        $('#clonemenu').addClass('hide');
    }
});

function indexScrollBottomStat() {
    var pagestatid = $('#pagestatid').val();
    var bottomStat = function () {
        var pageHeight = $('.main-cont').height();
        var screenHeight = $(window).height();
        if (pageHeight <= screenHeight) {
            hxmEventStat(pagestatid + '.bottom');
            $(window).off('touchstart', bottomStat);
        } else if (screenHeight + $(window).scrollTop() >= pageHeight) {
            hxmEventStat(pagestatid + '.bottom');
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
$(function () {
    //ͳ��
    var pagestatid = $('#pagestatid').val();
    hxmPageStat(pagestatid);
    indexScrollBottomStat();
});
/**
 * Created by Administrator on 2017/7/20.
 */