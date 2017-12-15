/**
 * Created by 2016101901 on 2017/6/2.
 */
var fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv;

var ROOT_PATH = path.join(__dirname),
    SRC_PATH = `${ROOT_PATH}/src/`,
    DIST_PATH = `${ROOT_PATH}/dist/`;

var PRCS = {},
    profile = '',
    index = 0,
    url = SRC_PATH;

PRCS.start = function (fc) {
    process.stdin.setEncoding('utf8');

    process.stdin.resume();
    process.stdout.write('请输入文件夹名：\n');
    process.stdin.on('data', (chunk) => {
        if (chunk) {
            fc(chunk);
        }
    });
};

PRCS.start(function (chunk) {
    index++;
    url += chunk + '/';
    url = PRCS.wipeN(url);

    switch (index) {
        case 1:
            profile = chunk;

            if (fs.existsSync(url)) {
                process.stdout.write('该文件夹已存在\n');
                process.stdout.write('请重新输入文件夹名：\n');
                index = 0;
                url = SRC_PATH;
            } else {
                fs.mkdir(url, (err) => {
                    process.stdout.write(err ? err : `${url} complete\n`);
                    process.stdout.write('请输入html名：\n');
                });
            }
            break;
        case 2:
            PRCS.newFile(PRCS.wipeN(profile) + '/');
            PRCS.newHtml(PRCS.wipeN(profile), PRCS.wipeN(chunk));
            process.stdin.pause();
            break;
    }
});


PRCS.wipeN = (str) => {
    return str.replace(/[\r\n]/g, '');
};

PRCS.newHtml = (file, name) => {
    let path = `${SRC_PATH}${file}/${name}.html`;
    let content = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>title</title>\n</head>\n<body>\n\n</body>\n</html>';

    fs.writeFile(path, content, (err) => {
        process.stdout.write(err ? err : `html complete\n`);
    });
};

PRCS.newFile = (file) => {
    if (file) {
        argv.p = file;
    }
    let path = argv.p ? `${SRC_PATH}${argv.p}` : SRC_PATH;
    let fileAr = ['css', 'js', 'images', 'templates'];

    fileAr.forEach(function (v, i, ar) {
        let url = `${path}${v}/`;

        if (fs.existsSync(url)) {
            process.stdout.write(`${v} already\n`);
        } else {
            fs.mkdir(url, (err) => {
                process.stdout.write(err ? err : `${v} complete\n`);
            });
        }
    });
};