var fs = require('fs');
var replace = require('replace');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    less: {
      dev: {
        files: {
          'pages/assets/main.css': 'src/less/main.less'
        }
      }
    },
    express: {
      dev: {
        options: {
          port: 8080,
          script: 'server.js',
          background: true
        }
      }
    },
    watch: {
      express: {
        files:  [ 'src/**/*.*' ],
        tasks:  [ 'dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    },
    concat: {
      main: {
        files: {
          'pages/assets/main.js': 'src/js/*.js'
        }
      }
    }
  });

  var replaceHTML = function(original, replacement){
    replace({
        regex: original,
        replacement: replacement,
        paths: ['index.html'],
        recursive: true,
        silent: true
    });
  };

  grunt.registerTask('basehrefqa', 'Update base href', function() {
    replaceHTML('http://localhost:8080', 'http://boolops.github.io/ghosthub-prototype');
  });

  grunt.registerTask('basehrefdev', 'Update base href', function() {
    replaceHTML('http://boolops.github.io/ghosthub-prototype', 'http://localhost:8080');
  });

  grunt.registerTask('dev', ['less', 'concat']);
  grunt.registerTask('default', ['dev', 'basehrefdev', 'express:dev', 'watch']);
  grunt.registerTask('qa', ['dev', 'basehrefqa']);

};
