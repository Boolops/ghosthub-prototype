var fs = require('fs');
var replace = require('replace');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  grunt.initConfig({
    assemble: {
      // options: {
      //   flatten: true,
      //   layout: 'src/hbs/layouts/main.hbs',
      //   //data: 'src/data/themes.json',
      //   partials: 'src/components/*.hbs'
      // },
      // pages: {
      //   files: {
      //     'app/': ['src/hbs/pages/index.hbs', 'src/hbs/pages/free.hbs', 'src/hbs/pages/premium.hbs', 'src/hbs/pages/minimalistic.hbs']
      //   }
      // },
      page1: {
        options: {
          flatten: true,
          layout: 'src/hbs/layouts/main.hbs',
          data: 'src/data/page0.json',
          partials: 'src/components/*.hbs'
        },
        files: {
          'app/page1.html': ['src/hbs/pages/index.hbs']
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


  grunt.registerTask('themesDivider', 'Update base href', function() {
    var fs = require('fs');
    var contents = fs.readFileSync('src/data/themes.json').toString();
    var contentsObj = JSON.parse(contents);
    var themeStart = '{"ghost-themes":';
    var minimalisticContent = function(element){
       if (element.minimalictic  === true){
         return true;
      }
     };
     var freeContent = function(element){
       if(element.free === true){
         return true;
       }
     };
     var premiumContent = function(element){
       if(element.premium === true){
         return true;
       }
     };
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
           fs.writeFileSync(path + i + '.json', themeStart + JSON.stringify(result[i], null, 4) + '}');
       }
     };
    var filteredMin = contentsObj['ghost-themes'].filter(minimalisticContent);
    var filteredFree = contentsObj['ghost-themes'].filter(freeContent);
    var filteredPremium = contentsObj['ghost-themes'].filter(premiumContent);

    processArray(filteredMin,'src/data/min/page');
    processArray(contentsObj['ghost-themes'], 'src/data/page');
    processArray(filteredFree, 'src/data/free/page');
    processArray(filteredPremium, 'src/data/premium/page');

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
