Feature: Go to the home page
  Display the title
  @Scenario
  Scenario: Home page
    Given I am on the home page
    When I do nothing (home page)
    Then I should see the title (home page)