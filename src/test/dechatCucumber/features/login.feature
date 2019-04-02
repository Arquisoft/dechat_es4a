Feature: Login Inrupt
  Scenario: We are on the login page an we try to login on inrupt
    When I am on the main page to login with Inrupt "http://localhost:4200/"
    And I select Inrupt ID provider and click on Go button

 #    Examples:
  #    | user            | password          | result  |
   #   | ger             | giramos           | Ok      |
    #  | Sunday          | Nope              | Nop     |
  # | anything else!  | Nope              | Nope    |