import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';

import { AppPage } from '../app.po';

let page: AppPage;

Before(() => {
    page = new AppPage();
});



// Go to the login - Display the title
Given(/^I am on the login page$/, { timeout: 5 * 1000 }, async () => {
    await page.navigateToLogin();
});
When(/^I do nothing$/, () => {});
Then(/^I should see the login title$/, async () => {
    expect(await page.getTitleText()).to.equal('SOLE CHAT');
});




// Go to the login - Display the description
Then(/^I should see the login description$/, async () => {
    expect(await page.getDescriptionLogin()).to.equal('Login with Solid Identity');
});





// Go to the card - Display the title
Given(/^I am on the card page$/, async () => {
    await page.navigateToCard();
});
Then(/^I should see the card title$/, async () => {
    // expect(await page.getTitleText()).to.equal('Welcome to angular-cli-cucumber-demo!');
    expect(await page.getTitleText()).to.equal('SOLE CHAT');
});


// Click on login button - Display anything
When(/^I click on register button$/, async () => {
    await page.clickOnRegisterButton();
});
Then(/^It should happen anything$/, () => {});

