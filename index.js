'use strict';

// Dependencies
var rs = require('replacestream'),
    Transform = require('readable-stream/transform'),
    fs = require('fs');
/*
 * @Param search - an array of elements to search for
 * @Param replacement - an array of file names to replace search with
 */
module.exports = function(base,segments){
  return new Transform({
    objectMode: true,
    transform: function(file,enc,callback){
      if (file.isNull()) {
        return callback(null,file);
      }
      function replace(){

        // searching file, putting into array, stripping away extra char
        var filecontent = fs.readFileSync(base, 'utf8');
        var match = filecontent.match(/inject\:([a-z-]+)\b/ig);
        var files = [match.length];
        for(var i in match){
          match[i] = match[i].replace('inject:',"");
          files[i] = segments + '/' + match[i] + '.html';
        }

        // stream
        if (file.isStream()) {
          for (var i in match){
            file.contents = file.contents.pipe(rs('<!-- inject:'+match[i]+' -->',fs.readFileSync(files[i])));
            return callback(null,file);
          }
        }

        // buffer
        if (file.isBuffer()){
          if (match instanceof RegExp) {
            for (var i in match){
              file.contents = new Buffer(String(file.contents).replace('<!-- inject:'+match[i]+' -->', fs.readFileSync(files[i])));
            }
          }
          // all others
          else{
            for (var i in match){
              var chunks = String(file.contents).split('<!-- inject:'+match[i]+' -->');

              var result = chunks.join(fs.readFileSync(files[i]));
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
