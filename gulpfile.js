var gulp = require("gulp");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

gulp.task('copy', function() {
  gulp.src('src/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task("minify-html", function() {
  gulp.src("src/**/*.html")
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist'));
});

gulp.task("merge-minify-js-css", function() {
  gulp.src("src/assets/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/assets/js"));
  gulp.src("src/assets/css/*.css")
    .pipe(minifyCss())
    .pipe(gulp.dest("dist/assets/css"));
});

gulp.task("compress-images", function() {
  gulp.src('src/images/*')
    .pipe(imagemin([
      imageminPngquant({
        speed: 1,
        quality: 50
      }),
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/images'))


    gulp.src('src/robots/images/**/*')
    .pipe(imagemin([
      imageminPngquant({
        speed: 1,
        quality: 10
      }),
      imagemin.gifsicle({
        interlaced: true,
        optimizationLevel: 3,
        number: 64
      }),
      imagemin.jpegtran({
        progressive: true,
        arithmetic: true
      }),
      imagemin.optipng({
        optimizationLevel: 7
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/robots/images'))
});






// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'src/images/logo.png',
    dest: 'dist/images/icons',
    iconsPath: '/images/icons',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '14%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: 'MilkenKnights'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'whiteSilhouette',
        backgroundColor: '#34345c',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        },
        appName: 'MilkenKnights'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'The MilkenKnights',
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      compression: 5,
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
  return gulp.src(['TODO: List of the HTML files where to inject favicon markups'])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});



gulp.task("default", ["copy", "generate-favicon", "minify-html", "merge-minify-js-css", "compress-images"]);
