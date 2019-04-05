Feature: App page

    Scenario: First scenario
        Given I open app page
        When app page loads
        Then title "Solid app" is displayed