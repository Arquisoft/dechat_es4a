import { browser, by, element } from 'protractor';

export class clicRegisterPage {

    clickRegisterButton() {
        return element(by.id('register')).click();
    }

}