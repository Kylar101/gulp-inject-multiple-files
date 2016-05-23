'use strict';

// Dependencies
var rs = require('replacestream'),
    textorbinary = require('istextorbinary'),
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
            file.contents = file.contents.pipe(rs('<!-- inject:'+search[i]+' -->',fs.readFile(replacement[i])));
            return callback(null,file);
          }
        }

        // buffer
        if (file.isBuffer()){
          if (search instanceof RegExp) {
            for (var i in search){
              file.contents = new Buffer(String(file.contents).replace('<!-- inject:'+search[i]+' -->', fs.readFile(replacement[i])));
            }
          }
          else{
            for (var i in search){
              var chunks = String(file.contents).split('<!-- inject:'+search[i]+' -->');

              var result;
              if (typeof fs.readFile(replacement[i]) === 'function'){
                // Start with the first chunk already in the result
                // Replacements will be added thereafter
                // This is done to avoid checking the value of i in the loop
                result = [ chunks[0] ];

                // The replacement function should be called once for each match
                for (var j = 1; j < chunks.length;j++){
                  // add replacement value
                  result.push(replacement('<!-- inject:'+search[i]+' -->'));
                  // add next chunk
                  result.push(chunks[j]);
                }
                result = result.join("");

              }
              else{
                result = chunks.join(replacement[i]);
              }
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
