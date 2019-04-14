import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';

import { AppPage } from '../page/app.po';

let page: AppPage;

Before(() => {
  page = new AppPage();
});

Given(/^I am on the home page$/, async () => {
  await page.navigateTo();
});

When(/^I do nothing \(login page\)$/, () => {});

Then(/^I should see the title \(login page\)$/, async () => {
  expect(await page.getParagraphText()).to.equal('ASW CHAT');
});