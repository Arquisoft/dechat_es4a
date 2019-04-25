import { browser, by, element } from 'protractor';


export class AppPage {

  navigateTo() {
    this.sleep(50000);
    return browser.get('/');
  }

  navigateToLogin() {
    this.sleep(50000);
    return browser.get('/login');
  }

  navigateToCard() {
    this.sleep(50000);
    return browser.get('/card');
    }
  navigateToChat() {
    this.sleep(50000);
    return browser.get('/chat');
    }  

  getParagraphText() {
    this.sleep(50000);
    return element(by.css('app-root h1')).getText();
  }

  getCardTitleText() {
    this.sleep(50000);
    return element(by.css('h1')).getText();
    //return $('h1').getText();  //.getText();
  }

  clickOnLoginSelectMenu() {
    this.sleep(50000);
    return element(by.id('login-select-menu')).click();
  }
  
  clickRegisterButton() {
    this.sleep(50000);
    return element(by.id('register')).click();
}
  clickSendButton() {
    this.sleep(50000);
    return element(by.id('send')).click();
}
  clickOnAddFriend() {
    this.sleep(50000);
    return element(by.id('add')).click();
}
  clickOnStartChatting() {
    this.sleep(50000);
    //return element(by.id('start')).click();
    //return element(by.buttonText('Start chatting!')).click();
    return element(by.css('button')).click();
}
  clickOnEmoji() {
    this.sleep(50000);
    //return element(by.id('git')).click();
    return element(by.id('emoji')).click();
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