import {browser, by, element} from 'protractor';

export class CardPage {

    navigateToCard() {
        this.sleep(30000);
        return browser.get('/card');
    }

    getCardTitleText() {
        this.sleep(3000);
        return element(by.css('h1')).getText();
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