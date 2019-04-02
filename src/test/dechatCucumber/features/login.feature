Feature: Login to enter the page
  Scenario: I sit on the login page and try to log inrupt
    Given Inrupt ID provider
    When I login with <user> and <password> correctly
    Then I can enter to the app <result>

     Examples:
      | user            | password          | result  |
      | ger             | giramos           | Ok      |
      | Sunday          | Nope              | Nop     |
      | anything else!  | Nope              | Nope    |