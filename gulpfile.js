var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')         // html压缩
var concat = require('gulp-concat')           // 合并文件
var rename = require('gulp-rename')           // 重命名
var minifycss = require('gulp-minify-css')    // CSS压缩
var jshint = require('gulp-jshint')           //js代码规范性检查
var uglify = require('gulp-uglify')           // js压缩
var imagemin = require('gulp-imagemin')       //图片压缩
var clean = require('gulp-clean')             //清空文件夹

gulp.task('html', function(){
	return gulp.src('src/*.html')
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest('dist'))
})

gulp.task('css', function(){
	return gulp.src('src/css/*.css')
			.pipe(concat('merge.css'))
			.pipe(rename({
                suffix: '.min'
            }))
			.pipe(minifycss())
			.pipe(gulp.dest('dist/css/'))
})

gulp.task('js', function(argument) {
     return	 gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('merge.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('img', function(argument){
	gulp.src('src/imgs/*')
	    .pipe(imagemin())
	    .pipe(gulp.dest('dist/imgs'));
});

gulp.task('clear', function(){
    gulp.src('dist/*',{read: false})
        .pipe(clean());
});

gulp.task('build', ['html', 'css', 'js', 'img']);