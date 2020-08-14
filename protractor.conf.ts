import {browser, Config} from "protractor";

import {currentDateAndTime, generateHtmlReport} from "./src/utils/reportUtil";
import {createNewDir} from "./src/utils/fileSystemUtil";


/**
* Configuration to run your cucumber
* feature files and step definitions with protractor.
*/

export let config: Config = {
    // set to "custom" instead of cucumber.
    framework: 'custom',

    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    capabilities: {
        browserName: 'chrome',
        // shardTestFiles: true,
        // maxInstances: 3,

        chromeOptions: {
            'args': [

                '--disable-gpu',
                // set chrome locale
                'lang=en-AU',
                '--disable-popup-blocking',
                'disable-infobars'
            ]
        }

        // browserName: 'firefox',
        //
        // capabilities: {
        //     'browserName': 'firefox',
        //     'moz:firefoxOptions': {
        //         'args': ['--safe-mode']
        //     }
        // },


    },


    params: {
        clientName: '',
        hostName: ''


    },

    directConnect: true,
    restartBrowserBetweenTests: false,

    suites: {
        ing: '../src/testCases/ing/**/*.feature',
        statewide: '../src/testCases/statewide/**/*.feature',
    },

    suite: 'Please specify a suite to run. Available options - ing, statewide',


    // specs: [`../src/testCases/**/*.feature`],

    seleniumAddress: 'http://localhost:4444/wd/hub',

    // You could set no globals to true to avoid jQuery '$' and protractor '$'
    // collisions on the global namespace.
    noGlobals: true,

    // cucumber command line options
    cucumberOpts: {
        require: ['./**/*.js'],  // require step definition files before executing features
        tags: ['@onlyThis'],                      // <string[]> (expression) only execute the features or scenarios with tags matching the expression
        strict: true,                  // <boolean> fail if there are any undefined or pending steps
        format: ["json:./report.json", require.resolve('cucumber-pretty')],            // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        'dry-run': false,              // <boolean> invoke formatters without executing steps
        compiler: []                 // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)

    },

    plugins: [],

    onPrepare: () => {
        createNewDir(`./reports/${browser.params.clientName}/${browser.params.hostName}/${currentDateAndTime}/`);
        },

    afterLaunch: () => {

    },

    onComplete: () => {

        // new reportExtension().generateHtmlReport();

        generateHtmlReport();

    }


};

