import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';


import { AppPage } from '../page/app.po';

let page: AppPage;

Before(() => {
  page = new AppPage();
});

//home_page.feature
Given(/^I am on the home page$/, async () => {
  await page.navigateTo();
});

When(/^I do nothing \(home page\)$/, () => {});

Then(/^I should see the title \(home page\)$/, async () => {
  expect(await page.getParagraphText()).to.equal('ASW CHAT');
});

//login_page.feature
Given(/^I am on the login page$/, async () => {
  await page.navigateToLogin();
});

When(/^I do nothing \(login page\)$/, () => {});

Then(/^I should see the title \(login page\)$/, async () => {
  expect(await page.getParagraphText()).to.equal('ASW CHAT');
});

//card_page.feature
Given(/^I am on the card page$/, async () => {
  await page.navigateToCard();
});

When(/^I do nothing$/, () => {
});

Then(/^I should see the card title$/, async () => {
    expect(await page.getCardTitleText()).to.equal('ASW CHAT');
});

//click_login.feature
When(/^I click on the login select menu$/, async () => {
  await page.clickOnLoginSelectMenu();
});

Then(/^It should happen anything$/, () => {
});

//click_register.feature
When(/^I click on register button$/, async () => {
  await page.clickRegisterButton();
});