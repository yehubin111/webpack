/**
 * Created by viruser on 2017/10/31.
 */
function searchFunc(options) {
    this.defaults = {
        searchId: '', // ** 组件存放ID
        type: 'stock,ijjfund', // ** 要搜索的内容，多个用逗号隔开 如 stock,ijjfund
        placeholder: '请输入代码、简称或拼音',  // input默认内容
        count: '5', // 单个模块条数
        successCallback: null // 回调函数，返回搜索结果数据
    };

    this.dom = {
        iptId: '#sh-input',  // 输入框ID， 默认#sh-input
        disId: '#sh-result',  // 搜索结果ID，默认#sh-result
        btnId: '#sh-button',  // 搜索按钮ID，默认#sh-button
        boxId: '#searchBox'  // 搜索框ID，默认#searchBox
    };

    // 全局变量存放
    this._data = {
        url: '//news.10jqka.com.cn/public/index_keyboard_{keyword}_{type}_{count}_1_jsonp.html',
        callback: this.successCallback
    };

    this.init(options);
}
searchFunc.prototype = {
    init: function (options) {
        var self = this;

        this.opts = $.extend({}, this.defaults, options);

        // 添加CSS
        this.addCss();
        // 添加输入框
        this.addInput();

        this._data.type = this.opts.type.split(',');
        this._data.url = this._data.url.replace('{type}', this.opts.type).replace('{count}', this.opts.count);
        this._data.callback = typeof this.opts.successCallback === 'function' ? this.opts.successCallback : this._data.callback;
        this._data.namelist = [];
        this._data.index = -1;
        this._data.runFunc = null;
        this._data.target = $(this.dom.iptId);
        this._data.listbox = $(this.dom.disId);
        this._data.button = $(this.dom.btnId);
        this._data.ajaxProcess = null;

        $.each(this._data.type, function (i, v) {
            var name = self.tools.keyToName(v);
            self._data.namelist.push(name);
        });

        console.log(this.opts);

        //绑定搜索框按键事件
        this._data.target.off().on({
            'input propertychange': function () {
                var ts = this;
                clearTimeout(self._data.runFunc);

                self._data.runFunc = setTimeout(function () {
                    // 终止前一次未执行完的请求
                    if (self._data.ajaxProcess) {
                        self._data.ajaxProcess.abort();
                    }
                    self.getInput.call(self, ts);
                }, 300);
            },
            'keydown': function (e) {
                self.getKeydown.call(self, e);
            },
            'focus': function () {
                self.tools.focusPlaceholder.call(self, this);
            },
            'blur': function () {
                self.tools.blurPlaceholder.call(self, this);
            }
        });

        //是否有回调
        if (this.idEstimate())
            return;

        //绑定搜索按钮点击事件
        this._data.button.off().on({
            'click': function () {
                self.clickEnter();
            }
        });

        //搜索结果点击跳转
        this._data.listbox.on({
            'click': function () {
                self.forDD.skip.call(self, this);
            },
            'mouseenter': function () {
                self.forDD.trig.call(self, this);
            }
        }, 'dd');

        //点击空白关闭
        $(document).click(function (e) {
            if (!$(self.dom.boxId).is(e.target) && $(self.dom.boxId).has(e.target).length === 0) {
                $(self._data.listbox).hide();
            }
        });
    },
    addCss: function () {
        var str = '<link rel="stylesheet" href="http://testfund.10jqka.com.cn/public/fronttest/search/css/search.css">';
        $(this.opts.searchId).append(str);
    },
    addInput: function () {
        var str = '<div class="' + this.dom.boxId.replace('#', '') + '" id="' + this.dom.boxId.replace('#', '') + '">';
        str += '<input value="' + this.opts.placeholder + '" type="text"  class="' + this.dom.iptId.replace('#', '') + '" id="' + this.dom.iptId.replace('#', '') + '" style="color:#999;">';
        str += '<span class="' + this.dom.btnId.replace('#', '') + '" id="' + this.dom.btnId.replace('#', '') + '">搜索</span>';
        //是否有回调
        if (!this.idEstimate())
            str += '<div class="' + this.dom.disId.replace('#', '') + '" id="' + this.dom.disId.replace('#', '') + '" style="display: none;"></div>';
        str += '</div>';
        $(this.opts.searchId).append(str);
    },
    getKeydown: function (e) {
        if (this._data.listbox.is(':hidden'))
            return;
        //是否有回调
        if (this.idEstimate())
            return;

        var keycode = e.which,
            lth;
        switch (keycode) {
            case 40: //down
                e.preventDefault();

                lth = this._data.listbox.find('dd').length;
                this._data.index++;
                if (this._data.index > lth - 1) {
                    this._data.index = 0;
                }
                this.forDD.choice.call(this);
                break;
            case 38: //up
                e.preventDefault();

                lth = this._data.listbox.find('dd').length;
                this._data.index--;
                if (this._data.index < -1) {
                    this._data.index = lth - 1;
                }

                if (this._data.index === -1) {
                    this._data.index = lth - 1;
                }
                this.forDD.choice.call(this);
                break;
            case 13: //enter
                this.clickEnter();
                break;
        }
    },
    clickEnter: function () {
        var idx = this._data.index;
        this._data.listbox.find('dd').eq(idx === -1 ? 0 : idx).click();
    },
    getInput: function (target) {
        var keyword = $(target).val();
        this._data.index = -1;
        if (keyword === '' || keyword === this.opts.placeholder) {
            $(this._data.listbox).hide();
            return;
        }

        var url = this._data.url.replace('{keyword}', keyword);

        this._data.keyword = keyword;

        this.tools.useJSONP.call(this, url, this._data.callback);
    },
    successCallback: function (data) {
        var data = data,
            str = '';

        str = this.stringGroup.call(this, data);
        $(this._data.listbox).show().html(str);
    },
    stringGroup: function (data) {
        var str = '',
            other = '';
        var self = this;

        $.each(data, function (i, v) {
            if (v.length === 0) {
                other += '<dl class="sh-line" data-key="' + self._data.type[i] + '">';
                other += '<dt class="sh-title">相关 <b>' + self._data.namelist[i].name + '</b> 搜索结果为0</dt>';
                other += '</dl>';

                return true;
            }

            str += '<dl class="sh-line" data-key="' + self._data.type[i] + '">';
            str += '<dt class="sh-title">搜"' + self._data.keyword + '"相关 <b>' + self._data.namelist[i].name + '</b></dt>';
            $.each(v, function (i, vl) {
                var keyReg = new RegExp(self._data.keyword, 'gi');
                var kcode = vl.code.toString();
                var kname = vl.name.toString();
                var getcdKwd = kcode.match(keyReg);
                var getnmKwd = kname.match(keyReg);
                if (getcdKwd)
                    kcode = kcode.replace(getcdKwd[0], '<em>' + getcdKwd[0] + '</em>');
                else if (getnmKwd)
                    kname = kname.replace(getnmKwd[0], '<em>' + getnmKwd[0] + '</em>');

                str += '<dd class="sh-info" data-code="' + vl.code + '"><span>' + kcode + '</span>' + kname + '</dd>'
            });
            str += '</dl>';
        });

        return str + other;
    },
    idEstimate: function () {
        if (typeof this.opts.successCallback === 'function') {
            return true;
        }
        return false;
    },
    forDD: {
        choice: function () {
            this._data.listbox.find('dd').removeClass('sh-on').eq(this._data.index).addClass('sh-on');
        },
        skip: function (target) {
            var key = $(target).parent().attr('data-key'),
                url = this.tools.keyToName(key).url,
                code = $(target).attr('data-code');

            window.open(url.replace('{code}', code));
        },
        trig: function (target) {
            var idx = this._data.listbox.find('dd').index($(target));
            this._data.index = idx;

            this.forDD.choice.call(this);
        }
    },
    tools: {
        blurPlaceholder: function (target) {
            var vl = $(target).val();

            if (vl === '') {
                $(target).val(this.opts.placeholder).css({
                    'color': '#999'
                });
            }
        },
        focusPlaceholder: function (target) {
            var vl = $(target).val();

            if (vl === this.opts.placeholder) {
                $(target).val('').css({
                    'color': 'inherit'
                });
                return;
            }

            if (vl !== '') {
                $(this._data.listbox).show();
            }
        },
        keyToName: function (key) {
            var info = {};
            switch (key) {
                case 'ijjfund':
                    info = {
                        name: '基金',
                        url: 'http://fund.10jqka.com.cn/{code}/'
                    };
                    break;
                case 'ijjfifund':
                    info = {
                        name: '固收',
                        url: 'http://fund.10jqka.com.cn/public/webgs/funddetail.html?fundCode={code}&openday='
                    };
                    break;
                case 'stock':
                    info = {
                        name: '股票',
                        url: 'http://stockpage.10jqka.com.cn/{code}/'
                    };
                    break;
                case 'company':
                    info = {
                        name: '基金公司',
                        url: 'http://fund.10jqka.com.cn/company/{code}/'
                    };
                    break;
                case 'master':
                    info = {
                        name: '名家',
                        url: 'http://master.10jqka.com.cn/mj_{code}/'
                    };
                    break;
                default:
                    break;
            }

            return info;
        },
        useJSONP: function (url, callback) {
            var self = this;
            self._data.ajaxProcess = $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonpCallback: 'jsonp',
                jsonp: false,
                cache: true,
                success: function (data) {
                    callback.call(self, data);
                },
                error: function (xml, st) {
                    console.log(url);
                    console.log(st);
                }
            });
        }
    }
};

module.exports = searchFunc;