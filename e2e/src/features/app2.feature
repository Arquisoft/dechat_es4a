@loginDescription-feature
Feature: See login description
  Display the login button

  @loginDescription-scenario
  Scenario: Login Page
    Given I am on the login page
    When I do nothing
    Then I should see the login description