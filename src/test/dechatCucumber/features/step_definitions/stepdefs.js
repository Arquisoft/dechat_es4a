
const assert = require('assert');
const { Given, When, Then } = require('cucumber');

Given('I\'m sending a message through the chat', function () {
           // Write code here that turns the phrase above into concrete actions
           this.message = true;
         });
		 
When('I send a {string} message', function (string) {
           // Write code here that turns the phrase above into concrete actions
           this.response = string;
           
         });		 
		 
Then('My friend gets the {string} message I sent him', function (string) {
           // Write code here that turns the phrase above into concrete actions
           if(this.message){
			   assert.equal(this.response, string); 
		   }
         });		 