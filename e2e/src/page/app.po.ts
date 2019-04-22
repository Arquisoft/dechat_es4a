import { browser, by, element } from 'protractor';


export class AppPage {

  navigateTo() {
    this.sleep(5000);
    return browser.get('/');
  }

  navigateToLogin() {
    this.sleep(5000);
    return browser.get('/login');
  }

  navigateToCard() {
    this.sleep(5000);
    return browser.get('/card');
    }

  getParagraphText() {
    this.sleep(5000);
    return element(by.css('app-root h1')).getText();
  }

  getCardTitleText() {
    this.sleep(5000);
    return element(by.css('h1')).getText();
    //return $('h1').getText();  //.getText();
  }

  clickOnLoginSelectMenu() {
    this.sleep(5000);
    return element(by.id('login-select-menu')).click();
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