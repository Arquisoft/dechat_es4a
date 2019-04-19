Feature: Did my friends got listed?
  User's friends should be listed on the chat

  Scenario Outline: Were friends listed propertly
	Given I press List Friends button
    When My friend "<name1>" got listed
    Then I looked for my friend "<name2>" 
    
    Examples:
    | name1 | name2 |
    | Elena | Elena |
	| Alberto | Alberto |
    | Aida | Aida |
	| Jaime | Jaime |
    | David | David |
