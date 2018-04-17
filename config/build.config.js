const HtmlWebpackPlugin = require('html-webpack-plugin');// 提取entry中的JS 单独生成script标签调用到相应页面中
const htmlList = require('./base.config.js');

const setForEach = (ar, cb) => {
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

// html压缩
const htmlMinify = process.env.NODE_ENV === 'production'? {
    minify: { 
        caseSensitive:false, //是否大小写敏感
        removeComments:true, //去除注释
        removeEmptyAttributes:true,//去除空属性
        collapseWhitespace:true //是否去除空格
    }
}: {};

module.exports = ((ar) => {
    let htmlAr = [];

    setForEach(ar, (v, i) => {
        setForEach(v, (m, n) => {
            let chunklist = ((ck) => {
                let ar = [];
                ck.forEach((p) => {
                    ar.push(`${i}/js/${p}`);
                });

                return ar;
            })(m);
            htmlAr.push(
                new HtmlWebpackPlugin(Object.assign({
                    title: '',
                    filename: `${i}/${n}.html`, // 相对于webpackConfig.output.path
                    template: `./src/${i}/${n}.html`,
                    inject: 'body',
                    hash: true,
                    chunks: chunklist,
                    chunksSortMode: (ck1, ck2) => {
                        let chunk = chunklist;
                        let ck1index = chunk.indexOf(ck1.names[0]);
                        let ck2index = chunk.indexOf(ck2.names[0]);

                        return ck1index - ck2index
                    }
                }, htmlMinify))
            )
        })
    });

    return htmlAr;

})(htmlList);