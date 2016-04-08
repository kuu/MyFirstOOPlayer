import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import es from 'event-stream';
import browserify from 'browserify';
import babelify from 'babelify';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function handleError(err) {
  $.util.log(err.toString());
  this.emit('end');
}

const plumber = () => {
  return $.plumber({ errorHandler : handleError });
};

/********
  STYLES
 ********/
gulp.task('styles', () => {
  return gulp.src('./src/styles/main.less')
    .pipe(plumber())
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.cleanCss({compatibility: '*'}))
    .pipe($.rename('app.css'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist/styles'));
});

/******
  LINT
 ******/
function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError());
  };
}
const testLintOptions = {
  env: {
    jasmine: true
  }
};

gulp.task('lint', lint('./src/scripts/**/*.js'));
gulp.task('lint:test', lint('./test/spec/**/*.js', testLintOptions));

/*********
  SCRIPTS
 *********/
gulp.task('scripts', ['lint'], () => {
  return browserify({
    entries: ['./src/scripts/main.js'], // Only need initial file, browserify finds the deps
    extensions: ['.js'],
    debug: process.env.NODE_ENV !== 'production',
    cache: {},
    packageCache: {},
    fullPaths: true
  })
  .transform(babelify.configure({
    sourceMapRelative: '.'
  }))
  .bundle() // Create the initial bundle when starting the task
  .pipe(plumber())
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe($.sourcemaps.init({loadMaps: true}))
  .pipe($.uglify())
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/scripts/'));
});

/********
  IMAGES
 ********/
gulp.task('images', () => {
  return gulp.src('./src/images/**/*')
    .pipe(plumber())
    .pipe($.if(
      $.if.isFile,
      $.cache(
        $.imagemin({
          progressive: true,
          interlaced: true,
          // don't remove IDs from SVGs, they are often used
          // as hooks for embedding and styling
          svgoPlugins: [{cleanupIDs: false}]
        })
      )
    ))
    .pipe(gulp.dest('./dist/images'));
});

/********
  EXTRAS
 ********/
gulp.task('extras', () => {
  const root = gulp.src([
    './src/*.html',
    './src/robots.txt'
  ])
  .pipe(gulp.dest('./dist'));

  const vendorScripts = gulp.src([
    './node_modules/flux/dist/Flux.min.js',
    './node_modules/react/dist/react.min.js',
    './node_modules/material-design-lite/material.min.js*',
    './node_modules/whatwg-fetch/fetch.js',
    './node_modules/tiny-sha256/sha256.min.js'
  ])
  .pipe(gulp.dest('./dist/scripts/vendor/'));

  const vendorStyles = gulp.src([
    'node_modules/material-design-lite/material.min.css*'
  ])
  .pipe(gulp.dest('./dist/styles/vendor/'));

  return es.merge(root, vendorScripts, vendorStyles);
});

/********
  TEST
 ********/
const testFiles = [
  'client/todo.js',
  'client/todo.util.js',
  'client/todo.App.js',
  'test/spec/*.js'
];

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

/********
  CLEAN
 ********/
gulp.task('clean', del.bind(null, ['dist']));

/********
  WATCH
 ********/
gulp.task('watch', () => {
  const changeHandler = (e) => {
    console.log(
      'File '+ e.path + ' was ' + e.type + ', running tasks...'
    );
  };

  gulp.watch('./src/styles/**/*.less', ['styles'])
  .on('change', changeHandler);

  gulp.watch([
    './src/scripts/**/*.js',
  ], ['scripts'])
  .on('change', changeHandler);

  gulp.watch('./src/images/**/*', ['images'])
  .on('change', changeHandler);

  gulp.watch('./src/*.html', ['extras'])
  .on('change', changeHandler);
});

/*******
  SERVE
 *******/
gulp.task('serve', ['styles'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        'scripts/vendor/react.js': 'node_modules/react/'
      }
    }
  });

  gulp.watch([
    'dist/**/*',
  ]).on('change', reload);

  gulp.start('watch');
});

/*******
  BUILD
 *******/
gulp.task('build', ['scripts', 'styles', 'images', 'extras'], () => {
  return gulp.src('./dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

/**************
  CLEAN & BUILD
 **************/
gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
