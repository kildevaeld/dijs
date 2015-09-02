'use strict';

const gulp = require('gulp'),
	tsc = require('gulp-typescript'),
	babel = require('gulp-babel'),
	merge = require('merge2');

const tsp = tsc.createProject('./tsconfig.json', {
	declarationFiles: true,
	target: 'es6',
	modules: 'commonjs',
	//typescript: require('typescript')
});

gulp.task('build', function () {

	let result = tsp.src('./src/**/*.ts')
		.pipe(tsc(tsp))

	return merge([
		result.js.pipe(babel({
			blacklist: ['regenerator', 'es6.classes']
		}))
			.pipe(gulp.dest('./lib')),
		result.dts.pipe(gulp.dest('./lib'))
	]);

});

gulp.task('template', function () {
	gulp.src('./template/*.ts', {read:true}).pipe(gulp.dest('./'))
})

gulp.task('watch', ['build'], function () {
	return gulp.watch('./src/**/*.ts', ['build']);
})

gulp.task('default', ['build', 'template'])
