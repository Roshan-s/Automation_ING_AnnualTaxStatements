
Feature: Admin Landing Page

  Background:
    Given I am on "AdminMemberSearch" page


  Scenario: Member is able to export their details to Excel on the Admin Member Search page
    When I enter an active member number in the Admin Member Search Page
    And  I export client details to Excel
    Then I verify "Members" xlsx file is saved and contains below listed DB column values
      | Cell Address | Value               |
      | A10          | D2z_Inst_Cust_No    |
      | C10          | MDz_Member          |
      | D10          | Full_Name           |
      | E10          | Formatted_D2d_Birth |


  Scenario: Member is able to export their details to PDF on the Admin Member Search page
    When I enter an active member number in the Admin Member Search Page
    And  I export client details to PDF
    Then I verify "Members" PDF is saved and contains below listed DB column values
      | DB Column           |
      | D2z_Inst_Cust_No    |
      | MDz_Member          |
      | Full_Name           |
      | Formatted_D2d_Birth |
