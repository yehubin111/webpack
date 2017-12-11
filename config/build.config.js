const HtmlWebpackPlugin = require('html-webpack-plugin');
const pagePath = './src/page';
const htmlList = require('./base.config.js');

function setForEach(ar, cb) {
    if (ar instanceof Array) {
        ar.forEach((v, i) => {
            if (cb)
                cb(v, i);
        })
    } else {
        for (var i in ar) {
            if (cb)
                cb(ar[i], i);
        }
    }
}

module.exports = (function(ar) {
    var htmlAr = [];

    setForEach(ar, function(v, i) {
        setForEach(v, function(m, n) {
            htmlAr.push(
                new HtmlWebpackPlugin({
                    title: '',
                    filename: i + '/' + n + '.html', // 相对于webpackConfig.output.path
                    template: './src/' + i + '/' + n + '.html',
                    inject: 'body',
                    hash: true,
                    chunks: ((ck) => {
                        var ar = [];
                        ck.forEach((p) => {
                            ar.push(i + '/js/' + p);
                        })

                        return ar;
                    })(m)
                    // minify: {  // html压缩
                    //     caseSensitive:false, //是否大小写敏感
                    //     removeComments:true, //去除注释
                    //     removeEmptyAttributes:true,//去除空属性
                    //     collapseWhitespace:true //是否去除空格
                    // }
                })
            )
        })
    })

    return htmlAr;

})(htmlList)