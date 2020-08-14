
Feature: My Investments - Investment Valuation

  Background:
    Given I am on "AdminMemberSearch" page


  Scenario: Member's Investment Allocation is reflected correctly on AOL
    Given I look up for a member under "65" years of age in super fund
    And   I navigate to "Valuation"
    Then  I validate that the Investment Valuation is listed correctly on AOL


#  Scenario: Member is able to download their Investment Allocation to Excel
#    Given I look up for a member under "65" years of age in super fund
#    And   I navigate to "Valuation"
#    Then  I validate that the Investment Valuation is listed correctly on AOL
#    And   I export Investment Valuation details to Excel
#    Then  I verify "InvestmentValuation" xlsx file is saved and contains Investment Valuation details
#
#
#  Scenario: Member is able to download their Investment Allocation to PDF
#    Given I look up for a member under "65" years of age in super fund
#    And   I navigate to "Valuation"
#    Then  I validate that the Investment Valuation is listed correctly on AOL
#    And   I export Investment Valuation details to PDF
#    Then  I verify "InvestmentValuation" pdf file is saved and contains Investment Valuation details
