/**
 * Created by viruser on 2017/10/31.
 */
const path = require('path');
const glob = require('glob');
const htmlwebpacklist = require('./build.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 提取entry中的JS 单独生成script标签调用到相应页面中
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 按照entry中css的调用 提取生成相应文件 生成link标签调用到相应页面中
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 编译之前先删除文件夹

function getEntry(pattern){
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
        filename: '[name].js'
    },
    // devtool: 'eval-source-map',
    devServer: {
        contentBase: "./dist", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        open: true
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
            },
            // {
            //     test: /(\.jpg|\.png|\.gif|\.jpeg)$/,
            //     use: {
            //         loader: 'file-loader',
            //         query: {
            //             name: 'images/[hash].[name].[ext]'
            //         }
            //     }
            // },
            // {
            //     test: /\.html$/,
            //     use: {
            //         loader: 'html-loader'
            //     }
            // }
            {
                test: /(\.jpg|\.png|\.gif|\.jpeg)$/,
                use: {
                    loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'  // 转base64 小于 8192B
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
        new CleanWebpackPlugin(['./dist'], {
            root: path.resolve(__dirname, '../')
        })
    ].concat(htmlwebpacklist)
}

module.exports = webpackConfig;