/**
 * Created by viruser on 2017/10/31.
 */
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const _path = require('./publicPath.js');
const htmlwebpacklist = require('./build.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 按照entry中css的调用 提取生成相应文件 生成link标签调用到相应页面中
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 编译之前先删除文件夹
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css，解决多个js调用同一个css重复问题
// const es3ifyPlugin = require('es3ify-webpack-plugin');

function getEntry(pattern) {
    const entry = {};
    const pth = path.resolve(__dirname, '../src');

    glob.sync(pattern).forEach((v, i) => {
        const filename = path.relative(pth, v).split('.')[0].replace(/\\/g, '/');

        entry[filename] = v;
    });

    return entry;
}

const webpackConfig = {
    entry: getEntry(path.resolve(__dirname, '../src/*/js/*.js')),
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: _path[process.env.NODE_ENV].publicPath,
        filename: '[name].js'
    },
    devtool: process.env.NODE_ENV === 'development'
        ? 'eval-source-map'
        : '',
    devServer: {
        contentBase: "./dist", //本地服务器所加载的页面所在的目录
        port: '1001',
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        open: true,
        openPage: './page/awardagain.html',
        // 页面上直接显示编译错误，无需打开终端查看
        overlay: {
            errors: true,
            warnings: true
        }
    },
    module: {
        // webpack babel 模块安装 npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /(\.less|\.css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'autoprefixer-loader',
                        'less-loader'
                    ],
                })
            },
            {
                test: /(\.jpg|\.png|\.gif|\.jpeg)$/,
                loader: 'url-loader',
                query: {
                    limit: '32768',
                    name: 'images/[hash:8].[name].[ext]' // 转base64 小于 32kb
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('[name].css').replace('/js/', '/css/');
            }
        }),
        new OptimizeCSSPlugin()
        // new es3ifyPlugin()
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common',
        //     filename: '[name].js',
        //     // chunks: []
        // })
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: '"production"'
        //     }
        // }),
    ].concat(htmlwebpacklist)
};

module.exports = webpackConfig;

// 生产环境下
if (process.env.NODE_ENV === 'production') {
    // js压缩
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // 兼容IE78，缺少标识符
                properties: false,
                warnings: false
            },
            output: {
                beautify: false,
                quote_keys: true
            },
            mangle: {
                screw_ie8: false
            },
            sourceMap: false
        })
    );
    // 打包前先清空
    module.exports.plugins.push(
        new CleanWebpackPlugin(['./dist'], {
            root: path.resolve(__dirname, '../')
        })
    );
}

// 开发环境
if (process.env.NODE_ENV === 'development') {
    // 打包前先清空
    module.exports.plugins.push(
        new CleanWebpackPlugin(['./dist'], {
            root: path.resolve(__dirname, '../')
        })
    );
}