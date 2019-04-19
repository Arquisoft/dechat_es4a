import {Before, Given, Then, When} from 'cucumber';
import {expect} from 'chai';

import {AppPage} from '../page/buttonStartChatting.po';

let page: AppPage;

Before(() => {
    page = new AppPage();
});


/*Given('I am on the card page', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });**/

  Given(/^I am on the card page$/, async () => {
    await page.navigateToCard();
});

 /* When('I click on startChatting button', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });**/
  When(/^I click on startChatting button$/, async () => {
    await page.clickOnStartChattingButton();
});

 /* Then('It should happen anything', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });**/
  Then(/^It should happen anything$/, () => {
});