var co = require("co");
var chalk = require("chalk");
var request = require("superagent");
var ProgressBar = require("progress");

var logger = require("./logger.js");

const BASE_URL = "https://api.appcenter.ms/";
const VERSION = "v0.1";

const ORGANISATION = "";
const TOKEN = "";

var bar = new ProgressBar(chalk.grey("=> [:bar] :percent :etas"), {
    width: 20,
    total: 100,
    clear: true,
});

var isFake = false;

const agent = request
    .agent()
    .accept("application/json")
    .set("Content-Type", "application/json")
    .set("X-API-Token", TOKEN)
    .on("progress", event => {
        bar.tick(event.percent);
    });
// .then(res => {
//     logger.progress("  => Success");
// })
// .catch(error => {
//     logger.progress("  => Error");
//     logger.error(JSON.stringify(error));
// });

module.exports = {
    isFake(value) {
        isFake = value;
    },
    createApp(app) {
        var url = BASE_URL + VERSION + "/orgs/" + ORGANISATION + "/apps";
        logger.warning("Creating " + app.display_name + " - " + app.os + " on AppCenter");

        if (!isFake) {
            agent.post(url).send(JSON.stringify(app));
        } else {
            logger.progress(JSON.stringify(app));
        }
    },
    createClientDistributionGroup(app) {
        var url = BASE_URL + VERSION + "/apps/" + ORGANISATION + "/" + app.name + "/distribution_groups";
        logger.warning("Creating Client Distribution Group for " + app.display_name + " - " + app.os);

        if (!isFake) {
            agent.post(url).send({ name: "Client" });
        } else {
            logger.progress(JSON.stringify({ name: "Client" }));
        }
    },
    addTeamToApp(app, team) {
        var url = BASE_URL + VERSION;
        logger.warning("Adding " + app.display_name + " - " + app.os + " to the team " + team);

        if (!isFake) {
            agent.post(url).send({ name: app.name });
        } else {
            logger.progress(JSON.stringify({ name: app.name }));
        }
    },
    updatePermissionsOfTeam(app, team) {
        var url = BASE_URL + VERSION;
        logger.warning("Update Team " + team + " permissions for " + app.display_name + " - " + app.os);

        if (!isFake) {
            agent.patch(url).send({ permissions: ["manager"] });
        } else {
            logger.progress(JSON.stringify({ permissions: ["manager"] }));
        }
    },
};
