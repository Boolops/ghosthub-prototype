var fs = require('fs');
var replace = require('replace');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  grunt.initConfig({
    assemble: {
      options: {
        flatten: true,
        layout: 'src/hbs/layouts/main.hbs',
        data: 'src/data/themes.json',
        partials: 'src/components/*.hbs'
      },
      pages: {
        files: {
          'app/': ['src/hbs/pages/index.hbs', 'src/hbs/pages/free.hbs', 'src/hbs/pages/premium.hbs', 'src/hbs/pages/minimalistic.hbs']
        }
      }
    },
    less: {
      dev: {
        files: {
          'app/assets/main.css': 'src/less/main.less'
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
          spawn: false, // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
          verbose: true
        }
      }
    },
    concat: {
      main: {
        files: {
          'app/assets/main.js': 'src/js/*.js'
        }
      }
    }
  });

  var replaceHTML = function(original, replacement){
    replace({
        regex: original,
        replacement: replacement,
        //paths: ['index.html', 'app/about/index.html', 'app/homepage/index.html', 'app/tag/index.html'],
        paths: ['index.html'],
        recursive: true,
        silent: true
    });
  };

  grunt.registerTask('basehrefqa', 'Update base href', function() {
    replaceHTML('http://localhost:8080', 'http://boolops.github.io/ghosthub-prototype/');
  });

  grunt.registerTask('basehrefdev', 'Update base href', function() {
    replaceHTML('http://boolops.github.io/ghosthub-prototype/', 'http://localhost:8080');
  });

  grunt.registerTask('dev', ['less', 'concat', 'assemble']);
  grunt.registerTask('default', ['dev', 'basehrefdev', 'express:dev', 'watch']);
  grunt.registerTask('qa', ['dev', 'basehrefqa']);

};
