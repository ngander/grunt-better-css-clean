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

        var files = this.files;
        var removedBytesSum = 0;

        // Iterate over all specified file groups.
        files.forEach(function (file, b, c) {
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

                    removedBytesSum += utf8StringSizeBytes(fileContents) - utf8StringSizeBytes(result.styles);
                }
            });

            var currentIndex = files.findIndex(function(item){
                return item == file;
            });

            if (currentIndex === files.length - 1) {
                var formattedSize = removedBytesSum;
                var unit = ' B';

                if (formattedSize > 1000) {
                    formattedSize = formattedSize / 1000;
                    unit = ' kB';
                }
                else if (formattedSize > 1000000) {
                    formattedSize = formattedSize / 1000000;
                    unit = ' kB';
                }

                formattedSize = (parseFloat(formattedSize).toFixed(2) + '').replace('.', ',');

                grunt.log.writeln('Removed ' + formattedSize + unit + '.');
            }
        });
    });

    function utf8StringSizeBytes(string) {
        var match = encodeURIComponent(string).match(/%[89ABab]/g);
        return parseFloat(string.length + (match ? match.length : 0));
    }
};
