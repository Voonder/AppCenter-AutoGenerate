var request = require("superagent");
var Throttle = require("superagent-throttle");

var logger = require("./logger.js");

const BASE_URL = "https://api.appcenter.ms/";
const VERSION = "v0.1";

const ORGANISATION = "";
const TOKEN = "";

var throttle = new Throttle({ concurrent: 1 });

var isFake = false;

const agent = request
    .agent()
    .accept("application/json")
    .set("Content-Type", "application/json")
    .set("X-API-Token", TOKEN)
    .use(throttle.plugin());

module.exports = {
    isFake(value) {
        isFake = value;
    },
    createApp(app) {
        var url = BASE_URL + VERSION + "/orgs/" + ORGANISATION + "/apps";

        if (!isFake) {
            agent
                .post(url)
                .send(JSON.stringify(app))
                .end((err, res) => {
                    logger.warning('Creating "' + app.display_name + " - " + app.os + '" on AppCenter');

                    if (err != null) {
                        logger.error("  => ERROR: Unable to create app ");
                        logger.error("\t" + JSON.stringify(err));
                        process.exit(400);
                    } else {
                        logger.info("  => FINISH ");
                    }
                });
        } else {
            logger.progress(JSON.stringify(app));
        }
    },
    createClientDistributionGroup(app) {
        var url = BASE_URL + VERSION + "/apps/" + ORGANISATION + "/" + app.name + "/distribution_groups";

        if (!isFake) {
            agent
                .post(url)
                .send({ name: "Client" })
                .end((err, res) => {
                    logger.warning(
                        'Creating Client Distribution Group for "' + app.display_name + " - " + app.os + '"',
                    );

                    if (err != null) {
                        logger.error("  => ERROR: Unable to create client distribution group");
                        logger.error("\t" + JSON.stringify(err));
                        process.exit(400);
                    } else {
                        logger.info("  => FINISH ");
                    }
                });
        } else {
            logger.progress(JSON.stringify({ name: "Client" }));
        }
    },
    addDistributionGroupToApp(apps, distributionGroup) {
        var url = BASE_URL + VERSION + "/orgs/" + ORGANISATION + "/distribution_groups/" + distributionGroup + "/apps";

        if (!isFake) {
            agent
                .post(url)
                .send({
                    apps: apps.map(a => {
                        return { name: a.name };
                    }),
                })
                .end((err, res) => {
                    logger.warning('Adding Distribution Group "' + distributionGroup + '" to the app(s):"');
                    apps.forEach(app => {
                        logger.warning("- " + a.display_name + " - " + a.os);
                    });

                    if (err != null) {
                        logger.error('  => ERROR: Unable to add distribution group "' + distributionGroup + '"');
                        logger.error("\t" + JSON.stringify(err));
                        process.exit(400);
                    } else {
                        logger.info("  => FINISH ");

                        logger.log("\n--------------------------------------");
                        logger.log("--- AppCenter configuration finish ---");
                        logger.log("--------------------------------------");

                        process.exit(0);
                    }
                });
        } else {
            logger.progress(JSON.stringify(apps));
            logger.progress(distributionGroup);
        }
    },
    addTeamToApp(app, team) {
        var url = BASE_URL + VERSION + "/orgs/" + ORGANISATION + "/teams/" + team + "/apps";

        if (!isFake) {
            agent
                .post(url)
                .send({ name: app.name })
                .end((err, res) => {
                    logger.warning('Adding "' + app.display_name + " - " + app.os + '" to the team "' + team + '"');

                    if (err != null) {
                        logger.error('  => ERROR: Unable to add team "' + team + '"');
                        logger.error("\t" + JSON.stringify(err));
                        process.exit(400);
                    } else {
                        logger.info("  => FINISH ");
                    }
                });
        } else {
            logger.progress(JSON.stringify({ name: app.name }));
        }
    },
    updatePermissionsOfTeam(app, team) {
        var url = BASE_URL + VERSION + "/orgs/" + ORGANISATION + "/teams/" + team + "/apps/" + app.name;

        if (!isFake) {
            agent
                .patch(url)
                .send({ permissions: ["manager"] })
                .end((err, res) => {
                    logger.warning(
                        'Update team "' + team + '" permissions for "' + app.display_name + " - " + app.os + '"',
                    );

                    if (err != null) {
                        logger.error('  => ERROR: Unable to update team "' + team + '" permissions');
                        logger.error("\t" + JSON.stringify(err));
                        process.exit(400);
                    } else {
                        logger.info("  => FINISH ");
                    }
                });
        } else {
            logger.progress(JSON.stringify({ permissions: ["manager"] }));
        }
    },
};
