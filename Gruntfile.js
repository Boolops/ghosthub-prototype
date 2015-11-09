var fs = require('fs');
var replace = require('replace');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});


  var assembleConfig = {};


  for(var i=0; i <= 3; i++){
    assembleConfig['page' + i] = {
      options: {
        flatten: true,
        layout: 'src/hbs/layouts/main.hbs',
        data: 'src/data/home/'+ i + '/themes.json',
        partials: 'src/components/*.hbs'
      },
      files:{}
    };
    assembleConfig["page" + i]['files']['app/page' + i + '.html'] = ['src/hbs/pages/index.hbs'];
  }
  for(var i=0; i <= 3; i++){
    assembleConfig['freePage' + i] = {
      options: {
        flatten: true,
        layout: 'src/hbs/layouts/main.hbs',
        data: 'src/data/free/'+ i + '/themes.json',
        partials: 'src/components/*.hbs'
      },
      files:{}
    };
    assembleConfig["page" + i]['files']['app/free/page' + i + '.html'] = ['src/hbs/pages/index.hbs'];
  }
  for(var i=0; i <= 2; i++){
    assembleConfig['minPage' + i] = {
      options: {
        flatten: true,
        layout: 'src/hbs/layouts/main.hbs',
        data: 'src/data/min/'+ i + '/themes.json',
        partials: 'src/components/*.hbs'
      },
      files:{}
    };
    assembleConfig["page" + i]['files']['app/min/page' + i + '.html'] = ['src/hbs/pages/index.hbs'];
  }
  for(var i=0; i <= 2; i++){
    assembleConfig['premiumPage' + i] = {
      options: {
        flatten: true,
        layout: 'src/hbs/layouts/main.hbs',
        data: 'src/data/premium/'+ i + '/themes.json',
        partials: 'src/components/*.hbs'
      },
      files:{}
    };
    assembleConfig["page" + i]['files']['app/premium/page' + i + '.html'] = ['src/hbs/pages/index.hbs'];
  }


  grunt.initConfig({
    assemble: assembleConfig,
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


  grunt.registerTask('themesDivider', 'Read info in themes.json into pages', function() {

    var contents = fs.readFileSync('src/data/themes.json').toString();
    var contentsObj = JSON.parse(contents);
    var themeStart = '{"ghost-themes":';

    function getFilterFunction(filterBy) {
      return function(element){
        return element[filterBy];
      }
    }

    var createGroupedArray = function(arr, chunkSize) {
     var groups = [], i;
     for (i = 0; i < arr.length; i += chunkSize) {
         groups.push(arr.slice(i, i + chunkSize));
     }
     return groups;
    };
    var processArray = function(arrayVar, path){
       var result = createGroupedArray(arrayVar, 9);
       for(var i=0; i< result.length; i++){
           try {
              stats = fs.lstatSync(path + i);
              if (!stats.isDirectory()) {
                fs.mkdirSync(path + i);
              }
          }
          catch (e) {
               fs.mkdirSync(path + i);
          }
           fs.writeFileSync(path + i + '/themes.json', themeStart + JSON.stringify(result[i], null, 4) + '}');
        }
    };
    var filteredMin = contentsObj['ghost-themes'].filter(getFilterFunction('minimalistic'));
    var filteredFree = contentsObj['ghost-themes'].filter(getFilterFunction('free'));
    var filteredPremium = contentsObj['ghost-themes'].filter(getFilterFunction('premium'));
    processArray(filteredMin,'src/data/min/');
    processArray(contentsObj['ghost-themes'], 'src/data/home/');
    processArray(filteredFree, 'src/data/free/');
    processArray(filteredPremium, 'src/data/premium/');
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
