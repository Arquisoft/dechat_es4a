// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  var cfg = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
      files:[
      "../node_modules/solid-auth-client/dist-lib/solid-auth-client.bundle.js",
      'assets/js/libs/rdflib.min.js'
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
        dir: require("path").join(__dirname, "../coverage"),
        reports: ["html", "lcovonly", "text-summary"],
        fixWebpackSourcePaths: true,
        combineBrowserReports: true,
        skipFilesWithNoCoverage: true,
        verbose: true
    },
    reporters: ['progress', 'kjhtml','coverage-istanbul'],
    port: 4200,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome","ChromeHeadlessCI"],
    customLaunchers: {
      Chrome_travis_ci: {
           base: 'Chrome',
           flags: ['--no-sandbox']
       },
       ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
    captureTimeout: 210000,
    browserDisconnectTolerance: 3, 
    browserDisconnectTimeout : 210000,
    browserNoActivityTimeout : 210000,
  }

  if (process.env.TRAVIS) {
    cfg.browsers = ['Chrome_travis_ci'];
}

config.set(cfg);
};
