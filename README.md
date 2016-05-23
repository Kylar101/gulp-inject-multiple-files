# gulp-inject-multiple-files
> A function that allows users to inject multiple files into a single locations

## Installation

First, install `gulp-inject-multiple-files` as a development dependency:

```shell
npm install --save-dev gulp-inject-multiple-files
```

Then, add it to your `gulpfile.js`:

```javascript
var injectfiles = require('gulp-inject-multiple-files');
```

## Usage

### Inside gulpfile.js

```javascript
gulp.task('inject-files',function(){

  // searching file, putting into array, stripping away extra char
  var filecontent = fs.readFileSync('foo.html', 'utf8');
  var match = filecontent.match(/inject\:([a-z-]+)\b/ig);
  var files = [match.length];
  for(var i in match){
    match[i] = match[i].replace('inject:',"");
    files[i] = 'parts/'+match[i]+'.html';
  }

  // begin injection
  gulp.src('foo.html')
    .pipe(injectfiles(match,files))
    .pipe(gulp.dest('temp'));
});
```

### inside foo.html

```html
<!-- inject:bar -->

<!-- inject:foo-bar -->
```

### inside bar.html

```html
<p>Hello World!</p>
```

### inside foobar.html

```html
<p>My name is Foo Bar</p>
```

## Output

```html
<p>Hello World!</p>

<p>My name is Foo Bar</p>
```

[npm-url]: https://www.npmjs.com/package/gulp-inject-multiple-files
