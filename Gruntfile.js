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
      },
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


  grunt.registerTask('themesDivider', 'Update base href', function() {
    var fs = require('fs');
    var contents = fs.readFileSync('src/data/themes.json').toString();
    var contentsObj = JSON.parse(contents);

  var createGroupedArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  };
  var result = createGroupedArray(contentsObj['ghost-themes'], 9);
  var themeStart = '{"ghost-themes":';
  for(var i=0; i < result.length; i++){
      fs.writeFileSync('src/data/page' + i + '.json', themeStart + JSON.stringify(result[i], null, 4) + '}');
  }
  });

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
