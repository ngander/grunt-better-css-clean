/*
 * grunt-better-css-clean
 * https://github.com/opctim/grunt-better-css-clean
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('css_clean', 'Remove duplicated css according to application priority', function () {
        var CleanCSS = require('clean-css');

        // Iterate over all specified file groups.
        this.files.forEach(function (file) {
            // Concat specified files.
            file.src.forEach(function (srcpath) {
                if (!grunt.file.exists(srcpath)) {
                    grunt.log.warn('Source file "' + srcpath + '" not found.');
                }
                else {
                    var cleanCssOptions = grunt.config.data.css_clean.options || {};

                    var cleanCss = new CleanCSS(cleanCssOptions);
                    var fileContents = grunt.file.read(srcpath);

                    var result = cleanCss.minify(fileContents);

                    grunt.file.write(file.dest, result.styles);
                    grunt.verbose.writeln('File "' + file.dest + '" created.');
                }
            });
        });
    });
};
