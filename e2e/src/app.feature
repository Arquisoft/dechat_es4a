Feature: Start the app
  Check the title

  Scenario: First scenario
    Given I open app
    When app page loads
    Then check "Solid App" text