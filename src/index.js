#!/usr/bin/env node

var chalk = require("chalk");
var co = require("co");
var program = require("commander");
var prompt = require("co-prompt");
var confirm = require("co-prompt");
var request = require("superagent");

var logger = require("./logger.js");

//#region MODEL

var systems = [
    { id: 1, key: "Android", display: "Android", platform: "Java" },
    { id: 2, key: "iOS", display: "iOS", platform: "Objective-C-Swift" },
    { id: 3, key: "macOS", display: "macOS" },
    { id: 4, key: "Tizen", display: "Tizen" },
    { id: 5, key: "tvOS", display: "tvOS" },
    { id: 6, key: "Windows", display: "Windows" },
];

var platforms = [
    { id: 1, display: "Native" },
    { id: 2, key: "UWP", display: "UWP" },
    { id: 3, key: "Cordova", display: "Cordova" },
    { id: 4, key: "React-Native", display: "React-Native" },
    { id: 5, key: "Xamarin", display: "Xamarin" },
    { id: 6, key: "Unity", display: "Unity" },
];

//#endregion

//#region APP CENTER CONFIGURATION

//#endregion

function createApp(appName, os, platform) {
    request
        .post(BASE_URL + VERSION + "/orgs/" + ORGANISATION + "/apps")
        .send({
            display_name: appName,
            name: "",
            os: os,
            platform: platform,
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
            if (!err && res.ok) {
            } else {
            }
        });
}

function handleFinish(os, language, environments, product, displayName, team) {
    process.exit(0);
}

program
    .option("-f, --fake", "Avoid REST API. Use for development only")
    .action(function() {
        logger.info("----------------------------------------------");
        logger.info("--- Welcome to AppCenter Auto-Generate CLI ---");
        logger.info("----------------------------------------------");
        logger.debug("AppCenter auto-generate can help you to create all apps slots for your mobile/desktop app.\n");

        co(function*() {
            logger.info("--------------------------------");
            logger.info("--- Setting up auto-generate ---");
            logger.info("--------------------------------");

            // System Input

            logger.debug("Select the OS the app will be running on (separate with comma if multiple)\n");
            systems.forEach(system => {
                logger.debug(system.id + ". " + system.display);
            });
            var os = yield prompt(chalk.blue("(1,2) => "));
            if (os == "") {
                os = "1,2";
            }
            os = os
                .replace(/\s/g, "")
                .toLowerCase()
                .split(/[,.]/);
            os.forEach(id => {
                if (0 < id && id <= systems.length) {
                } else {
                    logger.error("Entry " + id + " not valid.");
                    process.exit(0);
                }
            });

            // Platform Input

            logger.debug("\nSelect the platform of the app will be running");
            platforms.forEach(platform => {
                logger.debug(platform.id + ". " + platform.display);
            });
            var language = yield prompt(chalk.blue("(1) => "));
            language = language.replace(/\s/g, "").toLowerCase();
            if (language == "") {
                language = "1";
            }
            if (0 < language && language <= platforms.length) {
            } else {
                logger.error("Entry " + language + " not valid.");
                process.exit(0);
            }

            // Environment Input

            logger.debug("\nInsert the list of environment (separate with comma if multiple)");
            var environments = yield prompt(chalk.blue("(itg,prp,prod) => "));
            if (environments == "") {
                environments = "itg,prp,prod";
            }
            environments = environments
                .replace(/\s/g, "")
                .toLowerCase()
                .split(/[,.]/);

            // Product Input

            logger.debug("\nProduct Name (use in AppCenter url)");
            var product = yield prompt(chalk.blue(" => "));
            product = product.replace(/\s/g, "-").toLowerCase();
            if (product == "") {
                logger.error("Entry must be valid.");
                process.exit(0);
            }

            // Display Name Input

            logger.debug("\nDisplay Name");
            var displayName = yield prompt(chalk.blue(" => "));
            if (displayName == "") {
                logger.error("Entry must be valid.");
                process.exit(0);
            }

            // Team Input

            logger.debug("\nTeam Name");
            var team = yield prompt(chalk.blue("(empty to ignore) => "));

            // Confirmation Input

            logger.info("\n----------------------");
            logger.info("--- Confirm inputs ---");
            logger.info("----------------------");

            var sInfo = "\t - Systems: ";
            os.forEach(id => {
                var value = systems.find(function(s) {
                    return s.id == id;
                });
                if (value != undefined) {
                    sInfo += value.display + " ";
                }
            });

            logger.debug(sInfo);
            logger.debug(
                "\t - Platforms: " +
                    platforms.find(function(p) {
                        return language == p.id;
                    }).display,
            );
            logger.debug("\t - Environnements: " + environments);
            logger.debug("\t - Product: " + product);
            logger.debug("\t - Display Name: " + displayName);
            logger.debug("\t - Team: " + team + "\n");

            logger.debug("Is correct?");
            var isValid = yield confirm(chalk.blue("(y/n) => "));

            if (isValid == "n") {
                logger.error("Entries contain error. Re-run program to fix it.");
                process.exit(0);
            }

            yield handleFinish(os, language, environments, product, displayName, team);
        });
    })
    .parse(process.argv);
