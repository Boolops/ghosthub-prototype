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

  grunt.registerTask('dev', ['less', 'concat']);
  grunt.registerTask('default', ['dev', 'express:dev', 'watch']);

};
