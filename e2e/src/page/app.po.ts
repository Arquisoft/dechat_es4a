import { browser, by, element } from 'protractor';

export class AppPage {

  navigateTo() {
    this.sleep(3000);
    return browser.get('/');
  }

  navigateToLogin() {
    this.sleep(3000);
    return browser.get('/login');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
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