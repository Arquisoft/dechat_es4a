const assert = require("assert")  ;
const { Given, When, Then } = require('cucumber');

//History of being able to send a message to a colleague

Given('I am chatting', function() {
	this.chatting = true;
});

When('I send a message {string}', function(message) {
	this.mensaje = message;
});

Then('My friend gets a message {string} from me', function(message) {
	if (this.chatting) {
		assert.equal(this.mensaje, message); 
	}
});