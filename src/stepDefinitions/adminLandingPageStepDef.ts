import {When} from "cucumber";
import AdminMemberSearchPage from "../pageObjects/AdminMemberSearchPage";

When('I export client details to Excel', async () => {
    await new AdminMemberSearchPage().exportClientDetailsToExcel();
});

When('I export client details to PDF', async () => {
    await new AdminMemberSearchPage().exportClientDetailsToPDF();
});