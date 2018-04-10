//@charset "gbk";
var devicewidth = document.documentElement.clientWidth;
var historyMove = 1;
window.Swipe = function (b, a) {
    if (!b) {
        return null
    }
    var c = this;

    this.options = a || {};
    this.index = this.options.startSlide || 0;
    this.speed = this.options.speed || 300;
    this.lwidth = this.options.width || devicewidth; //导航li宽度
    this.delay = this.options.auto || 0; //自动滚动菜单速度0为不自动滚动
    this.col = this.options.auto || 4; //每排显示个数
    this.container = b;
    this.element = this.container.children[0];
    this.container.style.overflow = "hidden";
    this.element.style.listStyle = "none";
    this.element.style.margin = 0;
    this.setup();
    if (this.delay != 0) {
        this.begin();
    }
    if (this.element.addEventListener) {
        this.element.addEventListener("touchstart", this, false);
        this.element.addEventListener("touchmove", this, false);
        this.element.addEventListener("touchend", this, false);
        this.element.addEventListener("touchcancel", this, false);
        this.element.addEventListener("webkitTransitionEnd", this, false);
        this.element.addEventListener("msTransitionEnd", this, false);
        this.element.addEventListener("oTransitionEnd", this, false);
        this.element.addEventListener("transitionend", this, false);
        window.addEventListener("resize", this, false)
    }
};
Swipe.prototype = {
    setup: function () {
        this.slides = this.element.children;

        this.width = devicewidth;
        if (!this.width) {
            return null
        }

        this.length = this.slides.length; //最少显示两个*/
        if (this.length < 1) {
            return null
        }

        this.container.style.visibility = "hidden";
        this.element.style.width = Math.ceil(this.slides.length * this.lwidth) + "px";
        var a = this.slides.length;
        while (a--) {
            var b = this.slides[a];
            b.style.width = this.lwidth + "px";
            b.style.display = "table-cell";
            b.style.verticalAlign = "top"
        }
        this.slide(this.index, 0);
        this.container.style.visibility = "visible"
    },
    slide: function (a, c) {
        var b = this.element.style;
        if (c == undefined) {
            c = this.speed
        }
        b.webkitTransitionDuration = b.MozTransitionDuration = b.msTransitionDuration = b.OTransitionDuration = b.transitionDuration = c + "ms";
        b.MozTransform = b.webkitTransform = "translate3d(" + -(a * this.width) + "px,0,0)";
        b.msTransform = b.OTransform = "translateX(" + -(a * this.width) + "px)";
        this.index = a;
    },
    getPos: function () {
        return this.index
    },
    prev: function (a) {
        this.delay = a || 0;
        clearTimeout(this.interval);
        if (this.index) {
            this.slide(this.index - 1, this.speed)
        } else {
            this.slide(this.length - 1, this.speed)
        }
    },
    next: function (a) {
        this.delay = a || 0;
        clearTimeout(this.interval);
        if (this.index < this.length - 1) {
            this.slide(this.index + 1, this.speed)
        } else {
            this.slide(0, this.speed)
        }
    },
    begin: function () {
        var a = this;
        this.interval = (this.delay) ? setTimeout(function () {
                a.next(a.delay)
            },
            this.delay) : 0
    },
    stop: function () {
        this.delay = 0;
        clearTimeout(this.interval)
    },
    resume: function () {
        this.delay = this.options.auto || 0;
        this.begin()
    },
    handleEvent: function (a) {
        switch (a.type) {
            case "touchstart":
                this.onTouchStart(a);
                break;
            case "touchmove":
                this.onTouchMove(a);
                break;
            case "touchcancel":
            case "touchend":
                this.onTouchEnd(a);
                break;
            case "webkitTransitionEnd":
            case "msTransitionEnd":
            case "oTransitionEnd":
            case "transitionend":
                this.transitionEnd(a);
                break;
            case "resize":
                this.setup();
                break
        }
    },
    transitionEnd: function (a) {
        if (this.delay) {
            this.begin()
        }

    },
    onTouchStart: function (a) {
        this.start = {
            pageX: a.touches[0].pageX,
            pageY: a.touches[0].pageY,
            time: Number(new Date())
        };
        this.isScrolling = undefined;
        this.deltaX = 0;
        this.element.style.MozTransitionDuration = this.element.style.webkitTransitionDuration = 0;
        a.stopPropagation()
    },
    onTouchMove: function (a) {
        if (a.touches.length > 1 || a.scale && a.scale !== 1) {
            return
        }
        this.deltaX = a.touches[0].pageX - this.start.pageX;
        if (typeof this.isScrolling == "undefined") {
            this.isScrolling = !!(Math.abs(this.deltaX) < Math.abs(a.touches[0].pageY - this.start.pageY))
        }

        if (!this.isScrolling) {
            a.preventDefault();
            clearTimeout(this.interval);
            a.stopPropagation()
        }
    },
    onTouchEnd: function (c) {
        if (this.deltaX == 0) {
            this.isScrolling = true;
        }
        var b = Number(new Date()) - this.start.time < 250 && Math.abs(this.deltaX) > 20 || Math.abs(this.deltaX) > this.width / 2,
            a = !this.index && this.deltaX > 0 || this.index == this.length - 1 && this.deltaX < 0;
        if (!this.isScrolling) {
            var pagestatid = $('#pagestatid').val();
            var oldStatName = $('#nav-cur a').attr('stat_name');
            var statName = this.deltaX < 0 ? $('#nav-cur').next().find('a').attr('stat_name') : $('#nav-cur').prev().find('a').attr('stat_name');
            sliderCount++;
            if ($('#catecode').val() == 'financen') {
                hxmClickStatF10(pagestatid + '.' + oldStatName + '.' + statName, {'action_type': '2'});
            } else {
                hxmClickStat(pagestatid + '.' + oldStatName + '.' + statName, {'action_type': '2'});
            }

            this.slide(this.index + (b && !a ? (this.deltaX < 0 ? 1 : -1) : 0), this.speed);
            changeInfo();
        }
        c.stopPropagation();


    }
};

//开始调用插件

var slidezone = document.getElementById('slide-main');
var slider = new Swipe(slidezone);
var sliderCount = 0;
var slide_area = document.getElementById('slide_area');
slidezone.style.width = slide_area.offsetWidth + 'px';
slidezone.style.height = 900 + 'px';


var changeInfoFlag = 0;

function changeInfo() {
    var transform = slide_area.style.webkitTransform || slide_area.style.transform;
    transform = transform.replace(/%|translate3d|px|\(|\)|\s/ig, '');
    var deg = Math.abs(transform.split(',')[0]);
    var num = deg == '0' ? 0 : deg / devicewidth;
    if (changeInfoFlag == 0) {
        var submenu = document.getElementById('nav-cur');
        var subindex = $(submenu).index();
        num = subindex;
        /*滚动页面内容*/
        var a = num;
        var b = slider.element.style;
        var c = slider.speed;
        slider.index = num;
        b.webkitTransitionDuration = b.MozTransitionDuration = b.msTransitionDuration = b.OTransitionDuration = b.transitionDuration = c + "ms";
        b.MozTransform = b.webkitTransform = "translate3d(" + -(a * slider.width) + "px,0,0)";
        b.msTransform = b.OTransform = "translateX(" + -(a * slider.width) + "px)";
    }
    //改变菜单栏
    $('.menuzone li').eq(num).prop('id', 'nav-cur').siblings('li').prop('id', '');
    $('#clonemenu li').eq(num).addClass('clone-cur').siblings('li').removeClass('clone-cur');
    $('#clonemenu').addClass('hide');

    var moveX = 0;

    var maxmoveX = clientw - menuw;
    for (var i = 0; i < lis.length; i++) {
        if (i == num) {
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
    // ul.style.marginLeft = moveX + 'px';
    /*改变折线*/
    // if (historyMove != moveX) {
    //     createCanvas(num);
    //     historyMove = moveX
    // }
    createCanvas(num)

    /*报告期*/
    createList(getKeyObj());
    //行业地位
    //initRank(num);
    changeInfoFlag++;
    $('#slide-main').css('height', $($('.slide-block')[num]).height() + 5)
}

$(document).ready(function () {
    changeInfo()
})