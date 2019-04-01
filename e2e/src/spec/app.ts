import { AppPage } from '../app.po';
import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';

    let page: AppPage;

    Before(() => {
        page = new AppPage();
    });
    Given('I open app', async () => {
        await page.navigateTo();
        return 'pending';
    });
    When('app page loads', () => {
        return 'pending';
    });
    Then('check {string} text', async (input) => {
        expect(await page.getTitleText()).to.equal(input);
    });
