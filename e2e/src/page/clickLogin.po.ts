import { browser, by, element } from 'protractor';

export class clickLoginPage {


    clickOnLoginSelectMenu() {
        return element(by.id('login-select-menu')).click();
    }
    clickOnSolidCommunity() {
        this.sleep(3000);
        return element(by.partialLinkText('Solid Community')).click();
       // return element(by.css('a[innertext=\'Solid Community\']')).click();
    }
    private sleep(milliseconds: number): void {
        const start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }
}