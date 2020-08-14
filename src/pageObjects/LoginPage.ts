import {browser} from "protractor";
import {e2eLogInfo} from "../wrappers/CustomLogger";
import {getBaseURL, getClientPassword, getClientUsername, getHostUrlName} from "../env/environmentProps";
import {BasePage} from "./BasePage";
import {client, host} from "../hooks/preHooks";





export class LoginPage extends BasePage {

    /* Performs a login to AOL. Reads the username and password from environmentProps.json file located under ./src/env/
     */
    async loginToAOL() {
        await browser.navigate().to(`https://${getHostUrlName(client,host)}.${getBaseURL()}/${client}/index.html#Login`);
        await e2eLogInfo(`Navigated to URL : ${await browser.getCurrentUrl()}`);

        await this.enterIntoInputField('username', getClientUsername(client));
        await this.enterIntoInputField('password', getClientPassword(client));
        await this.clickOnWebElem('Submit');
    }
}

