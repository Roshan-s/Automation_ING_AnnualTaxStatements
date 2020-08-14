#
#Feature: Trade Share and Exchange Traded Funds - ING
#
#  Background:
#    Given I am on "AdminMemberSearch" page
#
#
#  Scenario: Test 08 - Client with no trading account submits a request
#
#    When  I look for a member with no share trading account
#    And   I select the member account
#    *     I navigate to "ShareTrading"
#    *     I check Share Trading checkbox
#    *     I hit submit
#    Then  I see the following share trade request submitted message
#          """
#          Thank you for applying for Share Trading. We'll email you once you're all set up and ready to trade - usually within three business days.
#          """
#    *     Application status is submitted in Acurity Database
#
#
#    Scenario: Test 09 - Client with trading account is able to Sell a share
#
#      When I look for a member with share trading account
#      And  I select the member account
#      *    I navigate to "ShareTrading"
#      *    I buy "15" new share of "GOZ" at market price
#      *    I hit continue
#      *    I hit submit
