var fs = require('fs'),
    replace = require('replace'),
    path = require('path');

/* HELPER FUNCTIONS --------------------------------------------------------- */

var themeStart = '{"ghost-themes":';

function getDirectories(srcpath) {
  /* get an array of directories in a directory specified */
  try {
    return fs.readdirSync(srcpath).filter(function(file) {
     return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  } catch(e) {
    return [];
  }
}

function getFilterFunction(filterBy) {
  /* returns a function to be used as a callback for filtering */
  return function(element){
    // special case for homepage filter - return all themes
    if (filterBy === 'home') {
      return element;
    }
    return element[filterBy];
  }
}

var createGroupedArray = function(arr, chunkSize) {
  /* split array arr into chunks of chunkSize */
 var groups = [], i;
 for (i = 0; i < arr.length; i += chunkSize) {
     groups.push(arr.slice(i, i + chunkSize));
 }
 return groups;
};

var createDirectory = function(dirName){
  try {
    stats = fs.lstatSync(dirName);
    if (!stats.isDirectory()) {
      fs.mkdirSync(dirName);
    }
  }
  catch (e) {
     fs.mkdirSync(dirName);
  }
};

var processArray = function(arrayVar, path){
  /* split array into chunks and write each chunk to the corresponding file */

  /* split into chunks */
  var themesPerPage = 9;
  var result = createGroupedArray(arrayVar, themesPerPage),
      pathName;

  /* iterate through chuks */
  for(var i=0; i< result.length; i++){
    // create directory
    pathName = path+'/'+(i+1);
    createDirectory(pathName);
    /* write to file */
    fs.writeFileSync(pathName + '/themes.json', themeStart + JSON.stringify(result[i], null, 4) + '}');
  }
};
/* HELPER FUNCTIONS END ----------------------------------------------------- */

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  /* generate assemble config ----------------------------------------------- */
  var assembleConfig = {};

  // declare all the categories existing on the site here
  var categories = ['home', 'free', 'minimalistic', 'premium'];

  categories.forEach(function(category){

    var pagesCount = getDirectories('src/data/'+category).length,
        configName, i, filePath;

    for(i=0; i < pagesCount; i++){
      configName = category+'page' + i;
      assembleConfig[configName] = {
        options: {
          flatten: true,
          layout: 'src/hbs/layouts/main.hbs',
          data: 'src/data/'+category+'/'+ (i+1) + '/themes.json',
          partials: 'src/components/*.hbs'
        },
        files:{}
      };

      filePath = 'app/'+category+'/' + (i+1) + '/index.html';
      if (category === 'home') {
        if (i === 0) {
          filePath = 'app/index.html';
        } else {
          filePath = 'app/' + (i+1) + '/index.html';
        }

      } else {
        if (i === 0) {
          filePath = 'app/'+category+'/index.html';
        }
      }
      assembleConfig[configName]['files'][filePath] = ['src/hbs/pages/index.hbs'];
    }
  });

  /* finish generating assmeble config -------------------------------------- */

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

    var contents = JSON.parse(fs.readFileSync('src/data/themes.json').toString());
    var filtered, dirName;

    categories.forEach(function(category){
      // get only the themes we need
      filtered = contents['ghost-themes'].filter(getFilterFunction(category));
      // create directory
      dirName = 'src/data/'+ category;
      createDirectory(dirName);
      // created folders and write to json files accordingly
      processArray(filtered, dirName);
    });

  });

  grunt.registerTask('basehrefqa', 'Update base href', function() {
    replaceHTML('http://localhost:8080', 'http://boolops.github.io/ghosthub-prototype/');
  });

  grunt.registerTask('basehrefdev', 'Update base href', function() {
    replaceHTML('http://boolops.github.io/ghosthub-prototype/', 'http://localhost:8080');
  });

  grunt.registerTask('dev', ['less', 'concat', 'themesDivider', 'assemble']);
  grunt.registerTask('default', ['dev', 'express:dev', 'watch']);
  grunt.registerTask('qa', ['dev']);

};
