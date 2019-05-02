Feature: Could i read a received message?
  We want to be able to read interchanged messages
  
@Scenario
  Scenario Outline: Chatting with a one friend
	Given I am using the app
    When I am chatting with my friend "<name>"
    Then I can read he has sent me "<word>"

     Examples:
    | name | word |
    | Elena | hola |
	| Alberto | adios |
    | Aida | buen dia |
	| Jaime | TGIF |
    | David | que tal? |   