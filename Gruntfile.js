'use strict';

module.exports = function (grunt) {

	var chromeFolder = __dirname + '/src/chrome',
		firefoxFolder = __dirname + '/src/firefox',
		safariFolder = __dirname + '/src/cryptocat.safariextension',
		releaseFolder = __dirname + '/release';


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

		copy: {
			'chrome-to-firefox': {
				files: [
					{
						expand: true,
						src: [ 'css/**', 'img/**', 'js/**', 'locale/**', 'snd/**', 'locale/**', 'index.html' ],
						dest: firefoxFolder + '/chrome/content/data',
						cwd: chromeFolder
					}
				]
			},
			'chrome-to-safari': {
				files: [
					{
						expand: true,
						src: [ 'css/**', 'img/**', 'js/**', 'locale/**', 'snd/**', 'locale/**', 'index.html' ],
						dest: safariFolder,
						cwd: chromeFolder
					}
				]
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


	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('copy-changes', 'Ensure all browser extensions have latest code', ['copy:chrome-to-firefox', 'copy:chrome-to-safari']);

	grunt.registerTask('tests', 'Run tests', ['mochaTest']);

	grunt.registerTask('pre-build', 'Pre-build tasks', ['tests', 'jshint', 'copy-changes']);


	/**
	 * Create zip file.
	 * @param inputFolder String folder containing input files.
	 * @param outputFile String output file.
	 * @param cb Function result callback with signature: (Boolean)
	 */
	var createZipFile = function(inputFolder, outputFile, cb) {
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
				cb(false);
			} else {
				grunt.log.writeln('...created ZIP [' + outputFile + ']');
				cb(true);
			}
		});
	};



	grunt.registerTask('build-chrome', 'Build Chrome browser extension', function() {
		var done = this.async();

		grunt.log.write('Creating Chrome extension...');

		var outputFile = releaseFolder + '/cryptocat-chrome.zip';

		createZipFile(chromeFolder, outputFile, done);
	});

	grunt.registerTask('build-firefox', 'Build Firefox browser extension', function() {
		var done = this.async();

		grunt.log.write('Creating Firefox add-on...');

		var outputFile = releaseFolder + '/cryptocat-firefox.xpi';

		createZipFile(firefoxFolder, outputFile, done);
	});

	grunt.registerTask('build', 'Build project', ['pre-build', 'build-chrome', 'build-firefox']);

	grunt.registerTask('default', ['build']);
};