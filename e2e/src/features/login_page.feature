
Feature: Go to the login page
  Display the title
  
  @Scenario
  Scenario: Login page
    Given I am on the login page
    When I do nothing (login page)
    Then I should see the title (login page)