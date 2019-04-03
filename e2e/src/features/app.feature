@loginTitle-feature
Feature: Go to the home
  Display the title
  
  @loginTitle-scenario
  Scenario: Home Page
    Given I am on the home page
    When I do nothing
    Then I should see the title