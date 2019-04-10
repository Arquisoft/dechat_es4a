import { browser, by, element } from 'protractor';

export class AppPage {
    navigateToLogin() {
        return browser.get('/login');
    }
    navigateToCard () {
        return browser.get('/card');
    }

    getTitleText() {
       // return element(by.css('app-root h1')).getText();
        return element(by.css('h1')).getText();
       //return $('h1').getText();
    }
    getDescriptionLogin() {
        return element(by.css('h2')).getText();
    }
    clickOnRegisterButton() {
        return element(by.id('registerButton')).click();
    }
}