import _ from 'lodash'
import gulp from 'gulp'
import tape from 'gulp-tape'
import tapSpec from 'tap-spec'
import lazypipe from 'lazypipe'
import gulpLoadPlugins from 'gulp-load-plugins'
import runSequence from 'run-sequence'

var plugins = gulpLoadPlugins()

const paths = {
  scripts: [
    'src/**/!(*.spec|*.integration).js',
    '!src/config/local.env.sample.js'
  ],
  json: ['src/**/*.json'],
  test: {
    integration: ['src/**/*.integration.js', 'mocha.global.js'],
    unit: ['src/**/*.spec.js', 'src/**/**/*.spec.js']
  },
  dist: 'dist'
}

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
      'transform-class-properties',
      'transform-runtime'
    ]
  })
  .pipe(plugins.sourcemaps.write, '.')

gulp.task('transpile', () => {
  return gulp.src(_.union(paths.scripts, paths.json))
    .pipe(transpileServer())
    .pipe(gulp.dest(paths.dist))
})

gulp.task('env:test', () => {
  plugins.env({
    vars: {NODE_ENV: 'test'}
  })
})

const runTests = () => {
  return gulp.src(_.union(paths.test.unit, paths.test.integration))
    .pipe(tape({
      reporter: tapSpec()
    }))
}

gulp.task('test', (a) => {
  require('babel-register')
  let tasks = ['env:test']
  runSequence(tasks, runTests)
  if (process.argv.indexOf('--watch') > -1) {
    gulp.start('watch')
  }
})

gulp.task('watch', () => {
  var testFiles = _.union(paths.test.unit, paths.test.integration)

  plugins.watch(_.union(paths.scripts, testFiles), runTests)
})

function onServerLog (log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message)
}

gulp.task('start:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  require(`./${paths.dist}/config/environment`)
  nodemon(`-w ${paths.dist} ${paths.dist}`)
    .on('log', onServerLog)
})
