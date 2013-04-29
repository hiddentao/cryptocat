'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		mochaTest:{
			files:['test/chrome/js/*.js']
		},
		mochaTestConfig:{
			options:{
				reporter:'spec',
				ui:'exports'
			}
		},

		jshint:{
			options:{
				"bitwise":false,
				"camelcase":false,
				"curly":false,
				"eqeqeq":true,
				"forin":true,
				"immed":true,
				"indent":2,
				"latedef":false,
				"newcap":true,
				"noarg":true,
				"noempty":false,
				"nonew":true,
				"plusplus":false,
				"quotmark":false,
				"undef":true,
				"unused":true,
				"strict":true,
				"trailing":true,

				"boss":true,
				"laxcomma":true,
				"multistr":true,
				"sub":true,
				"supernew":true,

				"browser":true,
				"node":true,

				"predef":[
					'define', 'require'
				]
			},
			files:[
				'Gruntfile.js'
			]
		}
	});


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('pre-build', 'Pre-build tasks', ['mochaTest', 'jshint']);

	grunt.registerTask('build-chrome', 'Build chrome browser extension', function() {
		var done = this.async();

		var outputFile = __dirname + '/release/cryptocat-chrome.zip';
		var inputFolder = __dirname + '/src/chrome';

		grunt.file.delete(outputFile);

		grunt.log.write('Compressing...');

		grunt.util.spawn({
			cmd: 'zip',
			opts: {
				cwd: inputFolder
			},
			args: ['-q', '-r9', outputFile, '.', '-x', '*/\\.*', '-x', '\\.*'],
			fallback: -255
		}, function(error, result, code) {
			if (-255 === code) {
				grunt.log.errorlns(result.stderr);
				done(false);
			} else {
				grunt.log.writeln('...done');
				done();
			}
		});
	});

	grunt.registerTask('build', 'Build project', ['build-chrome']);

	grunt.registerTask('default', ['build']);
};