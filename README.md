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

  // begin injection
  gulp.src('foo.html')
    .pipe(injectfiles('foo.html','parts'))
    .pipe(gulp.dest('temp'));

});
```

### inside foo.html

```html
<!-- inject:bar -->

<!-- inject:foo-bar -->
```

### inside parts/bar.html

```html
<p>Hello World!</p>
```

### inside parts/foo-bar.html

```html
<p>My name is Foo Bar</p>
```

## Output inside temp/foo.hmtl

```html
<p>Hello World!</p>

<p>My name is Foo Bar</p>
```

[npm-url]: https://www.npmjs.com/package/gulp-inject-multiple-files
