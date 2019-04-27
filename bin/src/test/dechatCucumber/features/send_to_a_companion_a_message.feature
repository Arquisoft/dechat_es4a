Feature: Could you send a message to a colleague?
  I want to check the possibility of sending a message to another user

  Scenario Outline: I may or may not send the message
	Given I'm sending a message through the chat
    When I send a "<wordOne>" message
    Then My friend gets the "<wordTwo>" message I sent him
	
	Examples:
    | wordOne | wordTwo |
    | Hello | Hello |
	| Hi | Hi |
    | Bye | Bye |
	| Goodbye | Goodbye |
    | anything else! | anything else! |
	