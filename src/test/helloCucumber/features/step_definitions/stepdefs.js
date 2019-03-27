const assert = require('assert');
const { Given, When, Then } = require('cucumber');

//Example 

function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

Given('today is {string}', function (givenDay) {
  this.today = givenDay;
});

When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = isItFriday(this.today);
});

Then('I should be told {string}', function (expectedAnswer) {
  assert.equal(this.actualAnswer, expectedAnswer);
});

//History of being able to send a message to a colleague

Given('I am chatting', function() {
	this.chatting = true;
});

When('I send a message {string}', function(message) {
	this.mensaje = message;
});

Then('My partner receives a message "<message>" from me', function(message) {
	if (this.chatting) {
		assert.equal(this.mensaje, message); 
	}
});