'use strict';

const gulp = require('gulp'),
	tsc = require('gulp-typescript'),
	babel = require('gulp-babel'),
	merge = require('merge2'),
	replace = require('gulp-replace'),
	webpack = require('webpack-stream');

const pkgjson = require('./package.json');

const tsp = tsc.createProject('./tsconfig.json', {
	
});

gulp.task('build', function () {

	let result = tsp.src('./src/**/*.ts')
		.pipe(tsc(tsp))

	return merge([
		result.js.pipe(babel({
			presets: ['es2015']
			//blacklist: ['regenerator'],
			//loose: ['es6.classes']
		}))
			.pipe(replace('<%version%>', pkgjson.version))
			.pipe(gulp.dest('./lib')),
		result.dts.pipe(gulp.dest('./lib'))
	]);

});



gulp.task('build:jspm', function () {

	const tsp = tsc.createProject('./tsconfig.json', {
		target: 'es6',
		module: 'amd',
	});

	return tsp.src('./src/**/*.ts')
	.pipe(tsc(tsp))
	.pipe(babel({
			presets: ['es2015']
		}))
	.pipe(replace('<%version%>', pkgjson.version))
	.pipe(gulp.dest('./dist/jspm'))
	

});


gulp.task('build:webpack', ['build'], function () {

	return gulp.src('./lib/index.js')
	.pipe(webpack({
		output: {
			filename: 'stick.di.js',
			library: 'stick.di',
			libraryTarget: 'umd'
		}
	}))
	.pipe(gulp.dest('./dist'));


});

gulp.task('template', function () {
	gulp.src('./template/*.ts', {read:true}).pipe(gulp.dest('./'));
});

gulp.task('watch', ['build'], function () {
	return gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('default', ['build', 'build:webpack' ,'template', 'build:jspm']);
