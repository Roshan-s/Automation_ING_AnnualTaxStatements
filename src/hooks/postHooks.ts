/*
 Author      : Roshan S.
 Description : Hooks are blocks of code that can run at various points in the Cucumber execution cycle.
               They are typically used for setup and teardown of the environment before and after each scenario.
               Where a hook is defined has no impact on what scenarios or steps it is run for.
*/


import {After, AfterAll, Status} from "cucumber";
import {browser} from "protractor";
import {
    browserLogError,
    e2eConsoleBrowserLogInfo, e2eConsoleLogError, e2eLogError,
    e2eLogInfo
} from "../wrappers/CustomLogger";
import {CustomBrowserDriver} from "../wrappers/CustomBrowserDriver";


/* After hook runs after the last step of each scenario, even when the step result is failed, undefined, pending, or skipped. */
After(async function (scenario) {


    /*
      For unknown reason at the moment, screenshot does not work with arrow
      function. Will need to investigate at a later stage for code consistency.
   */

    if (scenario.result.status === Status.FAILED) {

        const screenshot = await browser.takeScreenshot();
        await this.attach(screenshot, "image/png");
        if (scenario.result.exception) {
            await this.attach(`Scenario Failure Reason : ${scenario.result.exception.message}`);
            await e2eConsoleLogError(`${scenario.result.exception.message}`);
        }

        await browser.refresh();
    }


    /* Capture browser console log and append it to the browser.log file after the suite run completion. */
    await browser.manage().logs().get('browser').then((browserLogs) => {
        // browserLogs is an array of objects with level and message fields
        browserLogs.forEach(async (log) => {
            if (log.level.value > 500) { // it's an error log
                // await browserLogInfo('Browser console error!');
                await browserLogError(log.message);
            }
        });
    });

    await new CustomBrowserDriver().closeCurrentWindowAndSwitchToMain();

    /* Log Scenario description in e2e.log */
    await e2eLogInfo(`-----------------Finished Execution of : ${scenario.pickle.name.toString()}----------------------
                            
                           `);
});


/* AfterAll is called once post e2e suite execution */
AfterAll(async () => {

    await e2eConsoleBrowserLogInfo(`
                                          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  Finished E2E Test  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
                                          
                                          `);

});

