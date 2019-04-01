// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts



exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
      "chromeOptions": {
          "args": ["--headless", "--no-sandbox"]
      }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'custom',  // set to "custom" instead of cucumber.
  frameworkPath: require.resolve('protractor-cucumber-framework'),  // path relative to the current config file
  cucumberOpts: {
    require: ['./e2e/features/**/*.steps.ts'], // loads step definitions
    format: 'json: e2e-output.txt',              // enable console output (NO EN OTROS PROYECTOS EJEMPLO)
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
  }
};