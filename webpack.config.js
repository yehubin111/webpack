/**
 * Created by viruser on 2017/10/31.
 */

const HtmlWebpackPlugin = require('html-webpack-plugin'); // 提取entry中的JS 单独生成script标签调用到相应页面中
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 按照entry中css的调用 提取生成相应文件 生成link标签调用到相应页面中
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 编译之前先删除文件夹
module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: './js/[name].js'
    },
    // devtool: 'eval-source-map',
    devServer: {
        contentBase: "./dist", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true //实时刷新
    },
    module: {
        // webpack babel 模块安装 npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
        loaders: [{
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015", "react"
                        ]
                    }
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
            }
        ]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new ExtractTextPlugin('./css/[name].css'),
        new HtmlWebpackPlugin({
            title: '首页',
            filename: 'awardagain.html', // 相对于webpackConfig.output.path
            template: './src/pages/awardagain.html',
            inject: 'body',
            hash: true,
            chunks: ['index'],
            minify: {  // html压缩
                caseSensitive:false, //是否大小写敏感
                removeComments:true, //去除注释
                removeEmptyAttributes:true,//去除空属性
                collapseWhitespace:true //是否去除空格
            }
        }),
        new CleanWebpackPlugin(['./dist'])
    ]
};