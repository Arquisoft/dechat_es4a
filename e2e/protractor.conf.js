// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts


exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/features/**/*.features'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200',
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: ['./e2e/features/**/*.steps.ts'], // loads step definitions
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    
  }
};