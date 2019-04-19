import { CardPage } from '../page/card.po';
import {Before, Given, Then, When} from 'cucumber';
import {expect} from 'chai';

let page: CardPage;

Before(() => {
  page = new CardPage();
});

Given(/^I am on the login page$/, async () => {
  await page.navigateToCard();
});

When(/^I do nothing$/, () => {
});

  Then(/^I should see the card title$/, async () => {
    expect(await page.getCardTitleText()).to.equal('ASW CHAT');
});