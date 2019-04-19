import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';

import { clicRegisterPage } from '../page/clickRegister.po';

let page: clicRegisterPage;

Before(() => {
  page = new clicRegisterPage();
});

/*When('I click on register button', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });*/
  When(/^I click on register button$/, async () => {
    await page.clickRegisterButton();
});