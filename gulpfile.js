// yuto nagashima  @@@@@@ https://github.com/Apro-yuto @@@@@@

const { src, dest, watch, series, parallel } = require('gulp');

const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const auto = require('gulp-autoprefixer');
const sync = require('browser-sync');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');
// const pug = require('gulp-pug');


const srcPath = {
  sass: './src/assets/sass/**/*.scss',
}

const distPath = {
  css: './dist/assets/css/'
}
const startWebpack = () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(dest('./dist/assets/js/'));
}

const cssSass = () => {
  return src(srcPath.sass)
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(auto({
      cascade: false
    }))
    .pipe(dest(distPath.css))
}

const imgClean = (done) => {
  del(['./dist/assets/img/**/*']);
  done();
};

const copyImages = () => {
  return src('./src/assets/img/**')
  .pipe(dest('./dist/assets/img/'))
}

const copyHtml = () => {
  return src('./src/**/*.html')
  .pipe(dest('./dist/'))
}

const cssPublic = (done) => {
  del(['./dist/assets/css/**/*']);
  done();
};

const copycss = () => {
  return src('./src/assets/css/**/*')
  .pipe(dest('./dist/assets/css/'))
}


// const compilePug = () => {
//   return src([ 'src/**/*.pug', '!src/**/_*.pug' ])
//   .pipe(pug({
//     pretty: true
//   }))
//   .pipe( dest( './dist/' ) );
// }

const copyMinjs = () => {
  return src('./src/assets/js/**/*.min.js')
  .pipe(dest('./dist/assets/js/'))
}

const syncFunc = () => {
  sync.init(syncOption);
}

const syncOption = {
  server: true,
  open: true,
  reloadOnStart: true,
  startPath: '/dist/',
  baseDir: '/dist/',
}

const syncReload = (done) => {
  sync.reload();
  done();
}

const watchFiles = () => {
  watch( './src/**/*.html', series(copyHtml, syncReload))
  watch( './src/assets/sass/**/*.scss', series(cssSass, syncReload))
  watch( './src/assets/css/**/*', series(cssPublic ,copycss, syncReload))
  watch( './src/assets/img/', series(imgClean, copyImages, syncReload))
  // watch( './src/**/*.pug', series( syncReload))
  watch( './src/assets/js/', series(startWebpack, syncReload))
  watch( './src/assets/js/**/*.min.js', series(copyMinjs, syncReload))
}

exports.default = series(series(startWebpack, imgClean, copyImages, copyHtml, cssPublic ,cssSass ,copycss ,copyMinjs), parallel(watchFiles, syncFunc));




// yuto nagashima  @@@@@@ https://github.com/Apro-yuto @@@@@@