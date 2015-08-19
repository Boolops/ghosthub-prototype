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
          background: false
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'express']);

};
