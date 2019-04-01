import { AppPage } from './app.po';


describe('workspace-project App', () => {
    let page: AppPage;

    Before(() => {
        page = new AppPage();
    });
    Given(/^I am on the home page$/, async () => {
        await page.navigateTo();
    });
    When(/^I do nothing$/, () => {});
    Then(/^I should see the title$/, async () => {
        expect(await page.getTitleText()).to.equal('Solid App');
    });
});
