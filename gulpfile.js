//https://mrmlnc.gitbooks.io/less-guidebook-for-beginners/
//content/chapter_3/special-parameters-and-pattern-matching.html
var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');//минификация css
var autoprefixer = require('gulp-autoprefixer');
var gcmq = require('gulp-group-css-media-queries');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');//Обьединение файлов
var uglify = require('gulp-uglifyjs');//сжатие js
var cssnano = require('gulp-cssnano');//минификация
var rename = require('gulp-rename');//переменование файлов
var del = require('del');//удаление файлов и папок
var gutil = require('gulp-util');//ошибки
var pug = require('gulp-pug');//Pug ex Jade

gulp.task('less', function(){
    return gulp.src('app/less/**/*.less')
        .pipe(less().on('error', function(err){
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gcmq())
        /*.pipe(cleanCSS({
            level: 2
        }))*/
        /*.pipe(autoprefixer({
            browsers: ['last 7 versions', '> 0.1%', 'ie 8', 'ie 7'],
            cascade: false
        }))*/
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('pug', function(){
    return gulp.src('app/*.pug')
        .pipe(pug({
            pretty: true
        }).on('error', function(err){
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({
            stream: true,
            //tunnel: true
        }));
});

gulp.task('scripts', function(){
    return gulp.src([
        /*'app/libs/jquery.min.js',
        'app/libs/swiper.min.js',*/
        'app/js/common.js'
    ])
    //.pipe(concat('libs.min.js'))
    .pipe(uglify(
        //{toplevel: true}
    ))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', function(){
    return gulp.src([/*'app/css/libs.css',*/ 'node_modules/normalize.css/normalize.css'])
    .pipe(concat('libs.css'))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task('lesson', function(){
    return gulp.src(['app/less/lesson.less'])
        .pipe(less().on('error', function(err){
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gcmq())
        .pipe(autoprefixer({
            browsers: ['last 7 versions', '> 0.1%', 'ie 8', 'ie 7'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('watchLesson', ['browser-sync', 'lesson'], function(){
   gulp.watch('app/less/lesson.less', ['lesson']);
   gulp.watch('app/less/_varLesson.less', ['lesson']);
   gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('watch', ['browser-sync', 'less', 'pug', 'css-libs', /*'scripts'*/], function(){
    gulp.watch('app/less/*.less', ['less']);
    gulp.watch('app/*.pug', ['pug']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/*.js', browserSync.reload);
});

function delFile(){
    //del(['app/css/*']);
}

gulp.task('build', ['clean', 'less', /*'scripts'*/], function(){
    var buildCss = gulp.src([
        'app/css/style.css',
        'app/css/swiper.min.css',
        'app/css/libs.min.css',
        /*'app/css/libs.css',*/
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildCss = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

    var buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['watch']);