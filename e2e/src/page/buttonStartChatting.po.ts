import {browser, by, element} from 'protractor';

export class AppPage {

    navigateToCard() {
        this.sleep(30000);
        return browser.get('/card');
    }
    getCardTitleText() {
        // Function sleep to try to fix "not found element" and timeout failure
        this.sleep(3000);
        return element(by.css('h1')).getText();
    }

    clickOnStartChattingButton() {
        this.sleep(3000);
        return element(by.id('b')).click();
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