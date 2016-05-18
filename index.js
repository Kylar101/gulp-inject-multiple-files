'use strict';

// Dependencies
var pluginError = require('gulp-util').pluginError,
    rs = require('replacestream'),
    textorbinary = require('istextorbinary'),
    Transform = require('readable-stream/transform'),
    fs = require('fs');
/*
 * @Param search - an array of elements to search for
 * @Param replacement - an array of file names to replace search with
 */
module.exports = function(search,replacement){
  return new Transform({
    objectMode: true;
    transform: function(file,enc,callback){
      if (file.isNull()) {
        return callback(null,file);
      }
      function replace(){
        if (file.isStream()) {
          for (var i in search){
            file.contents = file.contents.pipe(rs(search[i],fs.readFileSync(replacement[i])));
            return callback(null,file);
          }
        }
        callback(null,file);
      }
      // end replace
      replace();
    }
  });
};
