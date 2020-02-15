// Gulp.js настройки
'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const smartgrid = require('smart-grid');
const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pug = require('gulp-pug');


let wp_template_patch = 'W:/domains/wp-gulp/theme/';

let config = {
    src: './src/',  // чисто все файлы в папке src
    build: './build', // папка результат 
    html:  { src: '**/*.html', dest: '/'  },
    pug:   { src: 'pug/**/*.pug', dest: '/'  },
    css:   { src: 'css/*.css',  dest: '/css', css_res_theme: wp_template_patch + 'css' }, 
	scss:  { src: 'scss/*.scss', patch_main: 'scss/main.scss',  dest: '/css', less_res_theme: wp_template_patch + 'css' },
    php:   { src: 'php_file/*.php',  dest: '/',  res_theme: wp_template_patch }, // укажим папку с php файлами
    img:   { src: 'img/**/*', dest: '/img', res_theme: wp_template_patch + 'img'  },
    js:    { src: 'js/*.*', dest: '/js', res_theme: wp_template_patch + 'js'},
    fonts: { src: 'fonts/*.*', dest: '/fonts' }
 };

 // HTML
 let src_html = config.src + config.html.src; // gulp-wp/src/**/*.html берем все файлы хтмл во всех папках
 let build_html = config.build + config.html.dest;
 // HTML
 let src_pug = config.src + config.pug.src; // gulp-wp/src/**/*.html берем все файлы хтмл во всех папках
 let build_pug  = config.build;
 // PHP
 let src_php = config.src + config.php.src; // gulp-wp/src/**/*.php берем все файлы хтмл во всех папках
 let build_php = config.php.res_theme; // путь в папку шаблона
 // CSS
 let src_css = config.src + config.css.src; // gulp-wp/src/**/*.php берем все файлы хтмл во всех папках
 let build_css = config.build + config.css.dest; // обычная папка в build/css 
 //let build_css = config.css.css_res_theme; // путь для заливки css в папку шалона
 let scss_watcher = config.src + config.scss.src; // все less файлы для наблюдения ватчером
 let src_scss = config.src + config.scss.patch_main; // gulp-wp/src/**/*.html берем все файлы хтмл во всех папках
 let build_scss = config.build + config.scss.dest; // обычная папка в build/css 
 //let build_scss = config.scss.scss_res_theme; // путь для заливки css в папку шалона
 // IMG
 let src_img = config.src + config.img.src; // gulp-wp/src/**/*.html берем все файлы хтмл во всех папках
 let build_img = config.build + config.img.dest;
 //let build_img = config.img.res_theme;
 // JS
 let src_js = config.src + config.js.src; // gulp-wp/src/**/*.html берем все файлы хтмл во всех папках
 let build_js = config.build + config.js.dest;
 // переносимlet build_js = config.js.res_theme;
 // FONTS
  let src_fonts = config.src + config.fonts.src; // gulp-wp/src/**/*.html берем все файлы хтмл во всех папках
  let build_fonts = config.build + config.fonts.dest;



function pugstart() {
// Таск для сборки Gulp файлов
console.log(src_pug);
	return gulp.src(src_pug)
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe( pug({
			pretty: true
		}) )
        .pipe( gulp.dest(build_pug) )
        .pipe(browserSync.stream()); 
    
}



// переносим js
function font() {
    return gulp.src(src_fonts).
    pipe(newer(build_fonts)).
    pipe(gulp.dest(build_fonts)).
    pipe(browserSync.stream());
}

// переносим js
function js() {
    return gulp.src(src_js).
    pipe(newer(build_js)).
    pipe(gulp.dest(build_js)).
    pipe(browserSync.stream());
}

// переносим img
function img() {
    console.log('Запуск !');
    return gulp.src(src_img).
    pipe(newer(build_img)).
    pipe(gulp.dest(build_img)).
    pipe(browserSync.stream());
}

 
 // переносим scss
function scssCss() {
    return gulp.src(src_scss)
	.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
			overrideBrowserslist: ['last 4 versions']
	 }))
	.pipe(gcmq())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build_scss))
    .pipe(browserSync.stream());  
 }
 
 // переносим css
 function css() {
    return gulp.src(src_css)
    .pipe(plumber())
    .pipe(newer(build_css))
    .pipe(gulp.dest(build_css))
    .pipe(browserSync.stream());
 }
 
 
 // переносим php
 function php() {
     return gulp.src(src_php).pipe(newer(build_php)).pipe(gulp.dest(build_php));
 }

// Функция генерации сетки
gulp.task('smart', function(done) {
    let gridSettings = {
       container: { maxWidth: "1170px", fields: "30px" },
	   outputStyle: 'scss', /* less || scss || sass || styl */
       breakPoints: {
          lg:    { width: "1200px", },
          lgfix: { width: "1100px", },
          md:    { width: "992px", },
          sm:    { width: "720px", fields: "15px" },
          xs:    { width: "576px", },
          xxs:   { width: "400px" }
       }};
    smartgrid(config.src + "scss", gridSettings);
    done();
 });
 // активируем настройки browserSync
 browserSync.init({
    server: {
        baseDir: config.build
    }
});


 function watch() {
 // gulp.watch(src_html, html);
  gulp.watch(src_css, css);
  gulp.watch(scss_watcher, scssCss);
  //gulp.watch(src_html, html);
  gulp.watch(src_img, img);
  gulp.watch(src_js, js);
  gulp.watch(src_pug, pugstart);

  //gulp.watch(src_php, php);
 }
 
  let build = gulp.parallel(css, scssCss, img, js, font);
  gulp.task('default', gulp.series(build, watch));
  gulp.task('pug', gulp.series(pugstart, watch));





/*
config.src = gulp-wp/src/
config.build = gulp-wp/build/
config.html.src - все html файлы из SRC

*/


/*
let src_css = config.src + config.css.src;
let src_patch_css = config.src + config.css.patch_main;
let build_css = config.build + config.css.dest;

let src_img = config.src + config.img.src;
let build_img = config.build + config.img.dest;

let src_fonts = config.src + config.fonts.src;
let build_fonts = config.build + config.fonts.dest;

let src_js = config.src + config.js.src;
let build_js = config.build + config.js.dest;
*/

