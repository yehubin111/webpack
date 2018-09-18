import '../css/detail.less'

$(function () {
    // 轮播图
    function imgFocus() {
        this._data = {
            piclength: $('#leftFocus ul li').length,
            picwidth: $('#leftFocus ul li').width(),
            runindex: 0,  // 当前页码
        }
        this.imgturn = null;

        if(this._data.piclength < 2)
            return;
            
        this.init();
    }

    imgFocus.prototype = {
        init: function () {
            let self = this;
            // 根据图片数量设置ul宽度
            $('#leftFocus ul').css('width', this._data.piclength * this._data.picwidth);
            $('#leftFocus .pagecount .total').text('/' + this._data.piclength);

            // 滚动效果
            self.imgturn = setInterval(function () {
                self._data.runindex++;
                if (self._data.runindex == self._data.piclength) {
                    self._data.runindex = 0;
                }
                self.picRun.call(self);

            }, 3000);
            $('#leftFocus ul li, #leftFocus .turnleft, #leftFocus .turnright').on({
                'mouseenter': function () {
                    clearInterval(self.imgturn);
                },
                'mouseleave': function () {
                    self.imgturn = setInterval(function () {
                        self._data.runindex++;
                        if (self._data.runindex == self._data.piclength) {
                            self._data.runindex = 0;
                        }
                        self.picRun.call(self);

                    }, 3000);
                }
            });
            $('#leftFocus .turnleft').on({
                'click': function () {
                    self._data.runindex--;
                    if (self._data.runindex == -1) {
                        self._data.runindex = self._data.piclength - 1;
                    }
                    self.picRun.call(self);
                }
            });
            $('#leftFocus .turnright').on({
                'click': function () {
                    self._data.runindex++;
                    if (self._data.runindex == self._data.piclength) {
                        self._data.runindex = 0;
                    }
                    self.picRun.call(self);
                }
            });
        },
        picRun: function () {
            let idx = this._data.runindex;
            let wid = this._data.picwidth;

            $('#leftFocus .pagecount .dispage').text(this._data.runindex + 1);
            $('#leftFocus ul').animate({ 'left': -idx * wid }, 300);
        }
    }

    new imgFocus();
})