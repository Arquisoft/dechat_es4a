import { browser, by, element } from 'protractor';

export class LoginPage {

  navigateTo() {
    return browser.get('/login');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getLoginSelector() {
    return element(by.css('logic-selector'));
  }

  getGoButton() {
    return element(by.id('btn-go'));
  }

  getRegisterButton() {
    return element(by.id('btn-register'));
  }

}