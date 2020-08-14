/*
* Author      : Roshan S.
* Description : This file contain configuration details and functions to query/update the SQL database. The actual environment details are fetched from the environment.json file
*               located under ./src/env/ .
* */

import * as assert from "assert";
import {e2eLogError, e2eLogInfo} from "./CustomLogger";


import {browser} from "protractor";
import {getSqlDatabaseName, getSqlServerName} from "../env/environmentProps";
import {client, host} from "../hooks/preHooks";
import {SqlClient} from "msnodesqlv8";
import {createDeflateRaw} from "zlib";

const sql = require("msnodesqlv8");


const connectionString = `server=${getSqlServerName(client, host)};Database=${getSqlDatabaseName(client, host)};Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}`;

/**
 *  Queries the database and returns the first row from the response as an object.
 *
 *  @query - A valid SQL query
 *  @errorMessage - Error message to be displayed is the returned response is empty
 *
 *  @return - Returns the first row from the response as an object as a Key (column Name) : Value (correponding data) pair.
 *
 */
export function runSqlQueryAndReturnResult (query: string, errorMessage: string):object {

    return new Promise((resolve, reject) => {

        sql.query(connectionString, query, (err: string, rows: object[]) => {

             // Throws error if connection to the database is unsuccessful
             assert.ifError(err);
             (rows.length < 1) ? reject(`SQL Error - Unable to retrive the following from the Database : ${errorMessage}`) : resolve(rows[0]);
        });
    });
}

/**
 *  Updates the database table and only returns an error if the update fails.
 *
 *  @query - A valid SQL query
 *  @errorMessage - Error message to be displayed is the update fails
 *
 *  @return - Returns void is the update is successful otherwise returns the appropriate error message.
 *
 */
export function runUpdateSqlQuery(query, errorMessage) {

    return new Promise((resolve, reject) => {

        sql.query(connectionString, query, (err, res) => {
            // Throws error if connection to the database is unsuccessful
            assert.ifError(err);
            err ? reject(`${err} SQL Error - Unable to update the following in the Database : ${errorMessage}`) : resolve(res[0]);
        });
    });
}




