import { Given, Before, When, Then } from 'cucumber';
import { browser, element, by, ExpectedConditions } from 'protractor';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { AppPage } from './app.po';
const expect = chai.use(chaiAsPromised).expect;

let appPage: AppPage = new AppPage();

Given('I open a page', function () {
    return browser.get('/').then(() => {
        element(by.css('h1')).getText()
            .then(text => {
                expect(text).to.have.string("Solid app")
            })
    });
});

Before(() => {
    appPage = new AppPage();
});

Given('I open app page', () => {
    appPage.navigateTo();
});

When('app page loads', () => {
    return browser.wait(ExpectedConditions.visibilityOf(appPage.getTitle()), 5000);
});

Then('header {string} is displayed', (title) => {
    return appPage.getTitle()
        .then(text => {
            expect(text).to.have.string(title)
        })
});

// app.feature

Before(() => {
    appPage = new AppPage();
});

Given(/^I am on the home page$/, async () => {
    await appPage.navigateTo();
});

When(/^I do nothing$/, () => {});

Then(/^I should see the title$/, async () => {
    expect(await appPage.getTitleText()).to.equal('Welcome to angular-cli-cucumber-demo!');
});