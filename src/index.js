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
    { id: 3, key: "macOS", display: "macOS", platform: "Objective-C-Swift" },
    { id: 4, key: "Windows", display: "Windows", platform: "UWP" },
];

var platforms = [
    { id: 1, display: "Native" },
    { id: 2, key: "Cordova", display: "Cordova" },
    { id: 3, key: "React-Native", display: "React-Native" },
    { id: 4, key: "Xamarin", display: "Xamarin" },
    { id: 5, key: "Unity", display: "Unity" },
];

//#endregion

function handleFinish(systems, environments, product, displayName, team) {
    logger.info("\n----------------------------------------");
    logger.info("--- Send configurations to AppCenter ---");
    logger.info("----------------------------------------");

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
            var systemInput = yield prompt(chalk.blue("(1,2) => "));
            if (systemInput == "") {
                systemInput = "1,2";
            }
            systemInput = systemInput
                .replace(/\s/g, "")
                .toLowerCase()
                .split(/[,.]/);
            var system = systemInput.map(input => {
                return systems.find(s => s.id == input);
            });
            if (system.length != systemInput.length) {
                logger.error("Entry " + systemInput.join(",") + "not valid.");
                process.exit(0);
            }

            // Platform Input

            logger.debug("\nSelect the platform of the app will be running");
            platforms.forEach(platform => {
                logger.debug(platform.id + ". " + platform.display);
            });
            var platformInput = yield prompt(chalk.blue("(1) => "));
            platformInput = platformInput.replace(/\s/g, "").toLowerCase();
            if (platformInput == "") {
                platformInput = "1";
            }
            if (0 < platformInput && platformInput <= platforms.length) {
                system.forEach(s => {
                    if (platformInput != 1) {
                        s.platform = platforms.find(p => p.id == platformInput).key;
                    }
                });
            } else {
                logger.error("Entry " + platformInput + " not valid.");
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

            system.forEach(s => {
                logger.debug("\t - Systems: " + s.display + " | Platforms: " + s.platform);
            });
            logger.debug("\t - Environnements: " + environments.join(", ").toUpperCase());
            logger.debug("\t - Product: " + product);
            logger.debug("\t - Display Name: " + displayName);
            logger.debug("\t - Team: " + team + "\n");

            logger.debug("Is correct?");
            var isValid = yield confirm(chalk.blue("(y/n) => "));

            if (isValid == "n") {
                logger.error("Entries contain error. Re-run program to fix it.");
                process.exit(0);
            }

            yield handleFinish(system, environments, product, displayName, team);
        });
    })
    .parse(process.argv);
