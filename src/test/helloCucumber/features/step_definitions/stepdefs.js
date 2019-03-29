const assert = require('assert');
const { Given, When, Then } = require('cucumber');


function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

/*
Given('today i s {string}', function (givenDay) {
  this.today = givenDay;
});
**/

Given('today is {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           this.today = string;
         });
/*
When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = isItFriday(this.today);
});
**/
When('I ask whether it\'s Friday yet', function () {
           // Write code here that turns the phrase above into concrete actions
          this.answer = isItFriday(this.today) ;
         });
/*
Then('I should be told {string}', function (expectedAnswer) {
  assert.equal(this.actualAnswer, expectedAnswer);
});**/

Then('I should be told {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           assert.equal(this.answer, string);
         });
		 