
Feature: My Pension - Centrelink Schedule

  Background:
    Given I am on "AdminMemberSearch" page

  Scenario: Member is able to download the latest Centrelink Schedule as pdf

    When I look for member with an active pension account
    And  I navigate to "CentrelinkSchedule"
    And  I click Request New Schedule
    And  I click Download
    Then I verify "CentrelinkSchedule" PDF is saved and contains below listed DB column values
      | DB Column       |
      | D2z_Given_Names |
      | D2z_Surname     |
      | MDz_Member      |
    Then I verify the latest Centrelink Schedule appears within the list


  Scenario: Member is able to download the latest Centrelink Schedule as Excel

    When I look for member with an active pension account
    And  I navigate to "CentrelinkSchedule"
    And  I click Request New Schedule
    And  I click Cancel
    Then I verify the latest Centrelink Schedule appears within the list
    And  I export Centrelink Details to Excel
    Then I verify "CentrelinkSchedule" xlsx file is saved and contains below listed DB column values
      | Cell Address | Value       |
      | A9           | CurrentDate |



