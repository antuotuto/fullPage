var fs = require('fs');
var path = require('path');
var http = require('http');

var package = '{"name": "gulps","version": "1.0.0","description": "","main": "index.js","scripts": { "test": "echo \\"Error: no test specified\\" && exit 1","start": "gulp"},"author": "","license": "ISC","devDependencies": {"browser-sync": "^2.18.13","gulp": "^3.9.1","del": "^3.0.0","gulp-autoprefixer": "^4.0.0","gulp-clean-css": "^3.8.0","gulp-plumber": "^1.1.0","gulp-rename": "^1.2.2","gulp-uglify": "^3.0.0","gulp-zip": "^4.0.0"}}';
var gulpfile = "var gulp = require('gulp');var uglify = require('gulp-uglify');var cleanCSS = require('gulp-clean-css');var autoprefixer = require('gulp-autoprefixer');var bs = require('browser-sync');var rename = require('gulp-rename');var zip = require('gulp-zip');var plumber = require('gulp-plumber');var del = require('del');var js = 'develop/scripts/*.js';var sty = 'develop/styles/*.css';var htm = 'develop/html/*.html';var img = 'develop/images/**';gulp.watch([js,sty,htm,img], ['reload', 'zip']);gulp.task('nanoJs', () => {return gulp.src(js).pipe(plumber()).pipe(gulp.dest('public/scripts/')).pipe(uglify()).pipe(gulp.dest('nano/scripts/'));});gulp.task('nanoCss', () => {return gulp.src(sty).pipe(plumber()).pipe(autoprefixer()).pipe(gulp.dest('public/styles/')).pipe(cleanCSS()).pipe(gulp.dest('nano/styles/'));});gulp.task('moveHtml', () => {return gulp.src(htm).pipe(plumber()).pipe(gulp.dest('nano/html/')).pipe(gulp.dest('public/html/'));});gulp.task('moveImg', () => {return gulp.src(img).pipe(plumber()).pipe(gulp.dest('nano/images/')).pipe(gulp.dest('public/images/'));});gulp.task('reload', () => {bs.reload();});gulp.task('clean',()=>{del.sync(['public/**','nano/**']);});gulp.task('zip', ['clean','nanoJs', 'nanoCss', 'moveHtml', 'moveImg'], () => {console.log('执行压缩');return gulp.src('develop/**').pipe(zip('project.zip')).pipe(gulp.dest('public/'));});gulp.task('default', ['clean','nanoJs', 'nanoCss', 'moveHtml', 'moveImg', 'zip'], function () {bs.init({server: './develop',index: 'html/index.html',browser: 'google chrome',port: '8222',open: 'external',ui: {port: 8223,}})});";
var index = '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" id="viewport" content="width=device-width"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black"><title>Document</title><link rel="stylesheet" href="../styles/reset.css"><link rel="stylesheet" href="../styles/style.css"><script>!function(){var e=screen.width/750;document.getElementById("viewport").content="width=750,initial-scale="+e+",minimum-scale="+e+",maximum-scale="+e+",user-scalable=no"}()</script></head><body><h1>Let`s Go!!!</h1></body><script src="../scripts/jquery.min.js"></script><script src="../scripts/preload.min.js"></script><script src="../scripts/TweenMax.min.js"></script><script src="../scripts/main.js"></script></html>';
var css = "@charset 'utf-8';/*=========================Reset_start==========================*/html,body,h1,h2,h3,h4,h5,h6,div,p,dl,dt,dd,ol,ul,li,form,table,th,td,a,img,span,strong,var,em,input,textarea,select,option{margin: 0; padding: 0;}html,body{font-family:'Microsoft YaHei','微软雅黑','黑体','Helvetica Neue','宋体','Arail','Tabhoma';div,img,input,section,p{box-sizing: border-box;-webkit-box-sizing: border-box;} font-size: 90px; text-align: left; width: 100%; height: 100%; overflow: hidden; background: #000; -webkit-tap-highlight-color: rgba(0,0,0,0);}body { font-size: 100%; }ul,ol{list-style: none;}img{border: 0;}input,select,textarea{outline:0;}textarea{resize:none;}table{border-collapse: collapse; border-spacing: 0;}th,strong,var,em{font-weight: normal; font-style: normal;}a{text-decoration: none;}/*a:link,a:visited,a:hover,a:active{text-decoration:none;} *//*==========================Reset_End===========================*/body,html {width: 100%;height: 100%;color: red;}"

var dir = ['./develop', './develop/html', './develop/scripts', './develop/styles', './develop/images'];

var remotePath = [{
        inputPath: 'http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js',
        outPath: './develop/scripts/jquery.min.js',
        console: '写入Jquery成功！'
    },
    {
        inputPath: 'http://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TweenMax.min.js',
        outPath: './develop/scripts/TweenMax.min.js',
        console: '写入TweenMax成功'

    },
    {
        inputPath: 'http://cdn.bootcss.com/PreloadJS/0.6.0/preloadjs.min.js',
        outPath: './develop/scripts/preload.min.js',
        console: '写入preload成功！'

    },
]

var data = [{
        outPath: 'package.json',
        content: package,
        console: '写入package.json成功！！'
    },
    {
        outPath: 'gulpfile.js',
        content: gulpfile,
        console: '写入gulpfile.js成功！！'
    },
    {
        outPath: './develop/html/index.html',
        content: index,
        console: '写入index.html成功！'
    },
    {
        outPath: './develop/scripts/main.js',
        content: '',
        console: '写入main.js成功！'
    },
    {
        outPath: './develop/styles/style.css',
        content: css,
        console: '写入style.css成功！'
    },
]

/**
 * 读取远程文件
 *
 * @param {String} url
 * @param {Function} cb
 *   - {Error} err
 *   - {Buffer} buf
 */

function readRemoteFile(url, cb) {
    var callback = function () {
        callback = function () {};
        cb.apply(null, arguments);
    };
    var req = http.get(url, function (res) {
        var b = [];
        res.on('data', function (c) {
            b.push(c);
        });
        res.on('end', function () {
            callback(null, Buffer.concat(b));
        });
        res.on('error', callback);
    });
    req.on('error', callback);
}

function remote(i) {
    if (i < remotePath.length) {
        readRemoteFile(remotePath[i].inputPath, function (err, buffer) {
            if (err) throw err;
            data.push({
                outPath: remotePath[i].outPath,
                content: buffer,
                console: remotePath[i].console
            });
            console.log(remotePath[i].outPath + "获取成功");
            i++;
            remote(i);
        });
    } else {
        maDir(0);
    }

}

function maDir(i) {
    if (i < dir.length) {
        fs.mkdir(dir[i], function (ee) {
            console.log("创建 " + dir[i]);
            i++;
            maDir(i);
        });

    } else {
        writeFile(0);
    }
}

function writeFile(num) {
    if (num < data.length) {
        fs.writeFile(data[num].outPath, data[num].content, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log(data[num].console);
            num++;
            writeFile(num);
        });
    } else {
        console.log('done');
    }
};
remote(0);