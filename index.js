'use strict';

// Dependencies
var rs = require('replacestream'),
    Transform = require('readable-stream/transform'),
    fs = require('fs');
/*
 * @Param search - an array of elements to search for
 * @Param replacement - an array of file names to replace search with
 */
module.exports = function(search,replacement){
  return new Transform({
    objectMode: true,
    transform: function(file,enc,callback){
      if (file.isNull()) {
        return callback(null,file);
      }
      function replace(){

        // stream
        if (file.isStream()) {
          for (var i in search){
            file.contents = file.contents.pipe(rs('<!-- inject:'+search[i]+' -->',fs.readFileSync(replacement[i])));
            return callback(null,file);
          }
        }

        // buffer
        if (file.isBuffer()){
          if (search instanceof RegExp) {
            for (var i in search){
              file.contents = new Buffer(String(file.contents).replace('<!-- inject:'+search[i]+' -->', fs.readFileSync(replacement[i])));
            }
          }
          // all others
          else{
            for (var i in search){
              var chunks = String(file.contents).split('<!-- inject:'+search[i]+' -->');

              var result = chunks.join(fs.readFileSync(replacement[i]));
              file.contents = new Buffer(result);
            }
          }
          return callback(null,file);
        }
        callback(null,file);
      }
      // end replace
      replace();
    }
  });
};
