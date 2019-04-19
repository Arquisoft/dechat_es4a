import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';

import { clickLoginPage } from '../page/clickLogin.po';

let page: clickLoginPage;

Before(() => {
  page = new clickLoginPage();
});

When(/^I click on the login select menu$/, async () => {
    await page.clickOnLoginSelectMenu();
    //await page.clickOnSolidCommunity();
});