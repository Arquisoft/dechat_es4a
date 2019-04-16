// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts



exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    "test/acceptance/features/*.feature"
  ],

  framework: 'custom',
  frameworkPath: require.resolve("protractor-cucumber-framework"),
  directConnect: true,
  baseUrl: "http://localhost:4200/",

    cucumberOpts: {
        require: ["e2e/src/steps/*.steps.js"],
        strict: true
    },
    specs: ["e2e/src/features/*.feature"],
    capabilities: {
        browserName: "chrome",
    },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, "./tsconfig.e2e.json")
    });
  }
};
