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

  navigateToCard() {
    this.sleep(30000);
    return browser.get('/card');
    }

  getParagraphText() {
    this.sleep(3000);
    return element(by.css('app-root h1')).getText();
  }

  getCardTitleText() {
    this.sleep(3000);
    return element(by.css('h1')).getText();
  }
  //este método privado nos permite salvar el error de tiempo expirado
  private sleep(milliseconds: number): void {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
}