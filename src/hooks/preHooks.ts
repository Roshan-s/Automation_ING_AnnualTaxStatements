/*
 Author      : Roshan S.
 Description : Hooks are blocks of code that can run at various points in the Cucumber execution cycle.
               They are typically used for setup and teardown of the environment before and after each scenario.
               Where a hook is defined has no impact on what scenarios or steps it is run for.
*/

import {Before, BeforeAll, setDefaultTimeout} from "cucumber";
import {
    e2eConsoleBrowserLogInfo,
    e2eLogInfo,
} from "../wrappers/CustomLogger";
import {browser} from "protractor";
import {LoginPage} from "../pageObjects/LoginPage";

export const client = browser.params.clientName;
export const host = browser.params.hostName;

setDefaultTimeout(180 * 1000);
/* BeforeAll hook runs once at the start of e2e suite execution. Timeout is set to 3 min */

BeforeAll(async () => {


    await browser.waitForAngularEnabled(false);
    await browser.manage().timeouts().pageLoadTimeout(40000);
    await browser.manage().timeouts().implicitlyWait(1000);
    await browser.manage().window().maximize() ;



    await e2eConsoleBrowserLogInfo(`
                                          
                                          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  Starting E2E Test  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                          
                                          `);


    await new LoginPage().loginToAOL();



});


/* Before hook runs before the first step of each scenario. */

Before(async (scenario) => {


    await e2eLogInfo(`---------------------Started Execution of : ${scenario.pickle.name.toString()}---------------------
                           
                            `);

});






